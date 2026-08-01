export interface RoadmapItem {
  id: string;
  title: string;
  type: "learn" | "project" | "dsa" | "practice";
}

export interface RoadmapPhase {
  id: string;
  title: string;
  duration: string;
  goal: string;
  items: RoadmapItem[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "phase-1",
    title: "Phase 1 — Build Your Foundation",
    duration: "≈ 8 weeks",
    goal: "Become an excellent programmer first. No AI shortcuts.",
    items: [
      { id: "p1-python", title: "Python — variables, loops, functions, OOP, exceptions, file handling, JSON, regex, modules, virtual environments, async, threading", type: "learn" },
      { id: "p1-python-project", title: "Password Manager", type: "project" },
      { id: "p1-linux", title: "Linux — terminal, file permissions, SSH, cron, bash, system services, package management", type: "learn" },
      { id: "p1-linux-project", title: "Personal Linux Server", type: "project" },
      { id: "p1-git", title: "Git — branches, merging, pull requests, GitHub portfolio", type: "learn" },
      { id: "p1-sql", title: "SQL — MySQL/PostgreSQL: JOIN, GROUP BY, indexes, views, stored procedures", type: "learn" },
      { id: "p1-sql-project", title: "Inventory Management Database", type: "project" },
      { id: "p1-dsa", title: "DSA daily — 2 LeetCode problems: arrays, strings, hash maps, linked lists, stacks, queues, math", type: "dsa" },
      { id: "p1-revision", title: "Revise probability, linear algebra, statistics", type: "practice" },
    ],
  },
  {
    id: "phase-2",
    title: "Phase 2 — Become a Software Engineer",
    duration: "≈ 10 weeks",
    goal: "Full-stack web development and backend skills.",
    items: [
      { id: "p2-web", title: "HTML, CSS, JavaScript, React, Node.js, FastAPI, REST APIs", type: "learn" },
      { id: "p2-security", title: "Authentication, JWT, MongoDB, Docker basics", type: "learn" },
      { id: "p2-project-erp", title: "Student ERP", type: "project" },
      { id: "p2-project-defence", title: "Defence Asset Tracker", type: "project" },
      { id: "p2-project-attendance", title: "Attendance System", type: "project" },
      { id: "p2-dsa", title: "DSA — trees, graphs, recursion, binary search", type: "dsa" },
    ],
  },
  {
    id: "phase-3",
    title: "Phase 3 — Machine Learning",
    duration: "≈ 8 weeks",
    goal: "Classical ML end-to-end with real datasets.",
    items: [
      { id: "p3-libs", title: "NumPy, Pandas, Matplotlib, Scikit-Learn", type: "learn" },
      { id: "p3-ml", title: "Regression, classification, clustering, feature engineering, model evaluation, cross validation", type: "learn" },
      { id: "p3-project-vehicle", title: "Military Vehicle Prediction", type: "project" },
      { id: "p3-project-personnel", title: "Personnel Analytics Dashboard", type: "project" },
      { id: "p3-project-threat", title: "Threat Classification Model", type: "project" },
      { id: "p3-kaggle", title: "Kaggle — complete 10 competitions", type: "practice" },
    ],
  },
  {
    id: "phase-4",
    title: "Phase 4 — Deep Learning",
    duration: "≈ 8 weeks",
    goal: "Neural networks and transformer fundamentals.",
    items: [
      { id: "p4-frameworks", title: "PyTorch & TensorFlow", type: "learn" },
      { id: "p4-architectures", title: "CNN, RNN, Transformers, Attention, Transfer Learning, GPU training", type: "learn" },
      { id: "p4-project-tank", title: "Tank Detection", type: "project" },
      { id: "p4-project-weapon", title: "Weapon Detection", type: "project" },
      { id: "p4-project-camo", title: "Camouflage Detection", type: "project" },
      { id: "p4-project-satellite", title: "Satellite Image Classification", type: "project" },
    ],
  },
  {
    id: "phase-5",
    title: "Phase 5 — Computer Vision",
    duration: "≈ 6 weeks",
    goal: "Real-time vision systems.",
    items: [
      { id: "p5-cv", title: "OpenCV, YOLO, image segmentation, OCR, tracking, pose estimation", type: "learn" },
      { id: "p5-project-drone", title: "Drone Detection", type: "project" },
      { id: "p5-project-counter", title: "Vehicle Counter", type: "project" },
      { id: "p5-project-helmet", title: "Helmet Detection", type: "project" },
      { id: "p5-project-border", title: "Border Surveillance AI", type: "project" },
    ],
  },
  {
    id: "phase-6",
    title: "Phase 6 — Generative AI & LLMs",
    duration: "≈ 8 weeks",
    goal: "Build with LLMs: RAG, agents, fine-tuning.",
    items: [
      { id: "p6-llm", title: "LLMs, Transformers, prompt engineering, embeddings, vector databases, RAG, LangChain, HuggingFace, Ollama, fine-tuning, AI agents", type: "learn" },
      { id: "p6-project-chatbot", title: "Military Knowledge Chatbot", type: "project" },
      { id: "p6-project-legal", title: "Legal Document Assistant", type: "project" },
      { id: "p6-project-nl2sql", title: "Natural Language → SQL", type: "project" },
      { id: "p6-project-planner", title: "Mission Planning AI", type: "project" },
    ],
  },
  {
    id: "phase-7",
    title: "Phase 7 — Robotics",
    duration: "≈ 6 weeks",
    goal: "Robots that sense, plan and move.",
    items: [
      { id: "p7-ros", title: "ROS2, Gazebo, SLAM, navigation, path planning, sensor fusion, localization", type: "learn" },
      { id: "p7-hardware", title: "Arduino, ESP32, STM32, Raspberry Pi", type: "learn" },
      { id: "p7-project-rover", title: "Autonomous Rover", type: "project" },
      { id: "p7-project-nav", title: "Robot Navigation", type: "project" },
      { id: "p7-project-obstacle", title: "Obstacle Avoidance", type: "project" },
    ],
  },
  {
    id: "phase-8",
    title: "Phase 8 — Drone Systems",
    duration: "≈ 4 weeks",
    goal: "Full drone software stack.",
    items: [
      { id: "p8-drone", title: "PX4, ArduPilot, Mission Planner, MAVLink, telemetry, waypoint missions, autonomous flight", type: "learn" },
      { id: "p8-project-planner", title: "Drone Mission Planner", type: "project" },
      { id: "p8-project-swarm", title: "Swarm Simulation", type: "project" },
      { id: "p8-project-gcs", title: "Drone Ground Control Software", type: "project" },
    ],
  },
  {
    id: "phase-9",
    title: "Phase 9 — Cybersecurity",
    duration: "≈ 4 weeks",
    goal: "Understand attack & defence.",
    items: [
      { id: "p9-net", title: "OSI model, TCP/IP, firewalls, Wireshark, Nmap, Burp Suite, OWASP Top 10, JWT security, encryption, Linux hardening", type: "learn" },
      { id: "p9-project-chat", title: "Secure Chat App", type: "project" },
      { id: "p9-project-scanner", title: "Network Scanner", type: "project" },
      { id: "p9-project-dashboard", title: "Threat Dashboard", type: "project" },
    ],
  },
  {
    id: "phase-10",
    title: "Phase 10 — DevSecOps",
    duration: "≈ 4 weeks",
    goal: "Ship and monitor like a professional.",
    items: [
      { id: "p10-devops", title: "Docker, Docker Compose, Kubernetes, GitHub Actions, Terraform, Nginx, CI/CD, logging, monitoring, Elastic Stack", type: "learn" },
      { id: "p10-project-ai", title: "Deploy an AI app", type: "project" },
      { id: "p10-project-fullstack", title: "Deploy a full-stack app", type: "project" },
      { id: "p10-project-monitor", title: "Monitoring Dashboard", type: "project" },
    ],
  },
  {
    id: "phase-11",
    title: "Phase 11 — Cloud & Portfolio",
    duration: "≈ 3 weeks",
    goal: "Cloud deployments + a portfolio that sells you.",
    items: [
      { id: "p11-cloud", title: "AWS — EC2, S3, Lambda, IAM, CloudWatch; Azure basics", type: "learn" },
      { id: "p11-deploy-ai", title: "Deploy AI models", type: "project" },
      { id: "p11-deploy-robotics", title: "Deploy a robotics dashboard", type: "project" },
      { id: "p11-portfolio", title: "Portfolio with ~20 substantial GitHub repos", type: "project" },
    ],
  },
];

export const PORTFOLIO_REPOS: { id: string; title: string; area: string }[] = [
  { id: "pf-erp", title: "Defence ERP", area: "Software" },
  { id: "pf-inventory", title: "Military Inventory", area: "Software" },
  { id: "pf-chat", title: "Secure Chat", area: "Software" },
  { id: "pf-logistics", title: "Logistics Dashboard", area: "Software" },
  { id: "pf-tank", title: "Tank Detection", area: "AI" },
  { id: "pf-drone", title: "Drone Detection", area: "AI" },
  { id: "pf-satellite", title: "Satellite Vision", area: "AI" },
  { id: "pf-camo", title: "Camouflage Detection", area: "AI" },
  { id: "pf-threat", title: "Threat Classifier", area: "AI" },
  { id: "pf-chatbot", title: "Military Chatbot", area: "LLM" },
  { id: "pf-legal", title: "Legal Assistant", area: "LLM" },
  { id: "pf-nl2sql", title: "NL to SQL", area: "LLM" },
  { id: "pf-planner", title: "AI Planner", area: "LLM" },
  { id: "pf-rover", title: "Rover", area: "Robotics" },
  { id: "pf-slam", title: "SLAM Demo", area: "Robotics" },
  { id: "pf-nav", title: "Navigation", area: "Robotics" },
  { id: "pf-mission", title: "Drone Mission Planner", area: "Drone" },
  { id: "pf-tracker", title: "Drone Tracker", area: "Drone" },
  { id: "pf-swarm", title: "Swarm Simulation", area: "Drone" },
  { id: "pf-k8s", title: "Kubernetes Deployment", area: "DevOps" },
  { id: "pf-docker", title: "Dockerized AI", area: "DevOps" },
  { id: "pf-scanner", title: "Vulnerability Scanner", area: "Cybersecurity" },
  { id: "pf-auth", title: "Secure Authentication", area: "Cybersecurity" },
];

export const DAILY_ROUTINE: { time: string; task: string }[] = [
  { time: "1.5 h", task: "Core learning — current month's topic" },
  { time: "1 h", task: "DSA — 2–3 LeetCode problems" },
  { time: "1.5 h", task: "Build or extend your project" },
  { time: "30 min", task: "Read documentation or research papers" },
  { time: "30 min", task: "GitHub commits, notes and documentation" },
  { time: "30–60 min", task: "Review or experiment" },
];

export const SKILLS_CHECKLIST: { id: string; name: string }[] = [
  { id: "sk-python", name: "Python" },
  { id: "sk-cpp", name: "C++" },
  { id: "sk-js", name: "JavaScript" },
  { id: "sk-sql", name: "SQL" },
  { id: "sk-linux", name: "Linux" },
  { id: "sk-git", name: "Git & GitHub" },
  { id: "sk-dsa", name: "Data Structures & Algorithms" },
  { id: "sk-react", name: "React" },
  { id: "sk-backend", name: "FastAPI / Node.js" },
  { id: "sk-docker", name: "Docker" },
  { id: "sk-k8s", name: "Kubernetes" },
  { id: "sk-aws", name: "AWS basics" },
  { id: "sk-ml", name: "Machine Learning" },
  { id: "sk-dl", name: "Deep Learning" },
  { id: "sk-cv", name: "Computer Vision" },
  { id: "sk-llm", name: "Generative AI & LLMs" },
  { id: "sk-rag", name: "RAG & AI Agents" },
  { id: "sk-ros", name: "Robotics (ROS2)" },
  { id: "sk-embedded", name: "Embedded Systems (Arduino/ESP32/RPi)" },
  { id: "sk-drone", name: "Drone Software (PX4/ArduPilot/MAVLink)" },
  { id: "sk-security", name: "Cybersecurity fundamentals" },
  { id: "sk-devsecops", name: "DevSecOps" },
  { id: "sk-docs", name: "Technical documentation & presentation" },
];
