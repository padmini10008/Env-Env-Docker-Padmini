const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

function loadSecrets() {
  const dockerSecretsDir = "/run/secrets";
  let secrets = {};
  
  // Priority 1: Docker Swarm secrets (production)
  if (fs.existsSync(dockerSecretsDir)) {
    try {
      const secretFiles = fs.readdirSync(dockerSecretsDir);
      const loadedVars = [];
      
      for (const file of secretFiles) {
        const filePath = path.join(dockerSecretsDir, file);
        if (fs.statSync(filePath).isFile()) {
          const value = fs.readFileSync(filePath, "utf8").trim();
          secrets[file] = value;
          loadedVars.push(file);
        }
      }
      
      console.log("✅ Loaded Docker Swarm secrets:", loadedVars);
      return secrets;
    } catch (error) {
      console.error("❌ Failed to load Docker secrets:", error.message);
    }
  }
  
  console.warn("⚠️ No secrets source found");
  return {};
}

const secrets = loadSecrets();

// Create React environment variables without modifying global process.env
const reactEnvVars = {};
for (const [key, value] of Object.entries(secrets)) {
  // Ensure variables are prefixed with REACT_APP_ for React to see them
  const reactKey = key.startsWith('REACT_APP_') ? key : `REACT_APP_${key}`;
  reactEnvVars[reactKey] = value;
}

// Start React with injected environment variables
const env = { ...process.env, ...reactEnvVars };
const child = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  env: env,
  shell: true
});

child.on('close', (code) => {
  process.exit(code);
});
