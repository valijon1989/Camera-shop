const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const backendPort = process.env.BACKEND_PORT || "9091";
const frontendPort = process.env.FRONTEND_PORT || process.env.PORT || "3000";
const reactScriptsPath = path.join(
  rootDir,
  "node_modules",
  ".bin",
  "react-scripts"
);

const children = [];
let shuttingDown = false;

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    env: process.env,
    ...options,
  });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    if (signal || code) {
      console.error(
        `${command} ${args.join(" ")} exited unexpectedly` +
          (signal ? ` with signal ${signal}` : ` with code ${code}`)
      );
      shutdown(code || 1);
    }
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    console.error(`Failed to start ${command}:`, error.message);
    shutdown(1);
  });

  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 150);
}

console.log(`Starting backend on http://localhost:${backendPort}/api`);
console.log(`Starting CRA dev server on http://localhost:${frontendPort}`);

spawnProcess("node", ["server/index.js"], {
  env: {
    ...process.env,
    PORT: backendPort,
  },
});

spawnProcess(reactScriptsPath, ["start"], {
  env: {
    ...process.env,
    BROWSER: process.env.BROWSER || "none",
    PORT: frontendPort,
  },
});

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
