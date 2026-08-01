import { deflateRawSync } from "zlib";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

// --- CRC32 (standard table-based implementation) ---
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const skip = new Set([
  "node_modules",
  "dist",
  ".git",
  "nda-os.zip",
  ".env",
  ".env.local",
  "make-zip.mjs",
]);

const files = [];
function walk(dir, prefix) {
  let es;
  try {
    es = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of es) {
    const name = e.name;
    if (skip.has(name)) continue;
    const full = join(dir, name);
    const rel = prefix ? prefix + "/" + name : name;
    if (e.isDirectory()) walk(full, rel);
    else files.push({ rel, full });
  }
}
walk(".", "");

const localParts = [];
const centralParts = [];
let offset = 0;

for (const f of files) {
  const data = readFileSync(f.full);
  const nameBuf = Buffer.from(f.rel, "utf8");
  const crc = crc32(data);
  const comp = deflateRawSync(data);

  // Local file header
  const lh = Buffer.alloc(30);
  lh.writeUInt32LE(0x04034b50, 0); // PK\x03\x04
  lh.writeUInt16LE(20, 4); // version needed
  lh.writeUInt16LE(0, 6); // flags
  lh.writeUInt16LE(8, 8); // method: deflate
  lh.writeUInt16LE(0, 10); // mod time
  lh.writeUInt16LE(0, 12); // mod date
  lh.writeUInt32LE(crc, 14);
  lh.writeUInt32LE(comp.length, 18);
  lh.writeUInt32LE(data.length, 22);
  lh.writeUInt16LE(nameBuf.length, 26);
  lh.writeUInt16LE(0, 28); // extra len
  localParts.push(lh, nameBuf, comp);

  // Central directory header
  const ch = Buffer.alloc(46);
  ch.writeUInt32LE(0x02014b50, 0); // PK\x01\x02
  ch.writeUInt16LE(20, 4); // version made by
  ch.writeUInt16LE(20, 6); // version needed
  ch.writeUInt16LE(0, 8); // flags
  ch.writeUInt16LE(8, 10); // method
  ch.writeUInt16LE(0, 12); // time
  ch.writeUInt16LE(0, 14); // date
  ch.writeUInt32LE(crc, 16);
  ch.writeUInt32LE(comp.length, 20);
  ch.writeUInt32LE(data.length, 24);
  ch.writeUInt16LE(nameBuf.length, 28);
  ch.writeUInt16LE(0, 30); // extra
  ch.writeUInt16LE(0, 32); // comment
  ch.writeUInt16LE(0, 34); // disk
  ch.writeUInt16LE(0, 36); // internal attrs
  ch.writeUInt32LE(0, 38); // external attrs
  ch.writeUInt32LE(offset, 42); // local header offset
  centralParts.push(ch, nameBuf);

  offset += lh.length + nameBuf.length + comp.length;
}

const central = Buffer.concat(centralParts);

// End of central directory
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0); // PK\x05\x06
eocd.writeUInt16LE(0, 4); // disk
eocd.writeUInt16LE(0, 6); // cd disk
eocd.writeUInt16LE(files.length, 8); // entries this disk
eocd.writeUInt16LE(files.length, 10); // total entries
eocd.writeUInt32LE(central.length, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20);

const zip = Buffer.concat([...localParts, central, eocd]);
writeFileSync("nda-os.zip", zip);
console.log(
  "ZIP_DONE",
  files.length,
  "files,",
  Math.round(zip.length / 1024) + " KB",
);
