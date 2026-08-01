/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as diet from "../diet.js";
import type * as fitness from "../fitness.js";
import type * as habits from "../habits.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as medical from "../medical.js";
import type * as mock from "../mock.js";
import type * as notes from "../notes.js";
import type * as olq from "../olq.js";
import type * as profile from "../profile.js";
import type * as roadmap from "../roadmap.js";
import type * as speaking from "../speaking.js";
import type * as study from "../study.js";
import type * as syllabus from "../syllabus.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  diet: typeof diet;
  fitness: typeof fitness;
  habits: typeof habits;
  helpers: typeof helpers;
  http: typeof http;
  medical: typeof medical;
  mock: typeof mock;
  notes: typeof notes;
  olq: typeof olq;
  profile: typeof profile;
  roadmap: typeof roadmap;
  speaking: typeof speaking;
  study: typeof study;
  syllabus: typeof syllabus;
  tasks: typeof tasks;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
