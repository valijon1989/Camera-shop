const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const backendPort = String(process.env.BACKEND_PORT || "9091");
const frontendPort = String(process.env.FRONTEND_PORT || "3010");
const serverEntry = path.join(rootDir, "server", "index.js");
const localServeBinary = path.join(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "serve.cmd" : "serve"
);
const serveCommand = fs.existsSync(localServeBinary) ? localServeBinary : "serve";

let backendChild = null;
let frontendChild = null;
let shuttingDown = false;

function attachLifecycle(name, child) {
  child.on("error", (error) => {
    if (shuttingDown) return;
    console.error(`[start-prod] Failed to start ${name}: ${error.message}`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    const reason = signal ? `signal ${signal}` : `code ${code}`;
    console.error(`[start-prod] ${name} exited unexpectedly with ${reason}`);
    shutdown(code || 1);
  });

  return child;
}

function spawnBackend() {
  if (backendChild && !backendChild.killed) {
    console.log("[start-prod] Backend is already running, skipping duplicate spawn.");
    return backendChild;
  }

  backendChild = attachLifecycle(
    "backend",
    spawn(process.execPath, [serverEntry], {
      cwd: rootDir,
      stdio: "inherit",
      env: {
        ...process.env,
        PORT: backendPort,
      },
    })
  );

  return backendChild;
}

function spawnFrontend() {
  if (frontendChild && !frontendChild.killed) {
    console.log("[start-prod] Frontend is already running, skipping duplicate spawn.");
    return frontendChild;
  }

  frontendChild = attachLifecycle(
    "frontend",
    spawn(serveCommand, ["-s", "build", "-l", frontendPort], {
      cwd: rootDir,
      stdio: "inherit",
      env: process.env,
    })
  );

  return frontendChild;
}

function stopChild(child) {
  if (!child || child.killed) return;
  child.kill("SIGTERM");
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  stopChild(frontendChild);
  stopChild(backendChild);

  setTimeout(() => process.exit(exitCode), 250);
}

function ensurePortAvailable(port, label) {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once("error", (error) => {
      if (error && error.code === "EADDRINUSE") {
        reject(
          new Error(
            `${label} port ${port} is already in use. Stop the existing process before running start:prod.`
          )
        );
        return;
      }
      reject(error);
    });

    tester.once("listening", () => {
      tester.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }
        resolve();
      });
    });

    tester.listen(Number(port), "0.0.0.0");
  });
}

async function main() {
  console.log(`[start-prod] Checking backend port ${backendPort}...`);
  await ensurePortAvailable(backendPort, "Backend");
  console.log(`[start-prod] Checking frontend port ${frontendPort}...`);
  await ensurePortAvailable(frontendPort, "Frontend");

  console.log(`[start-prod] Starting backend: node server/index.js on ${backendPort}`);
  spawnBackend();

  console.log(`[start-prod] Starting frontend: serve -s build -l ${frontendPort}`);
  spawnFrontend();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => {
  console.error(`[start-prod] ${error.message}`);
  shutdown(1);
});
