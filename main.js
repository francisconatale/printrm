const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let springBootProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "PrusaSlicer Portable",
  });

  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    const indexPath = path.join(__dirname, 'frontend/dist/index.html');
    mainWindow.loadFile(indexPath).catch(err => {
      console.error("Failed to load index.html:", err);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  console.log("Starting Spring Boot Backend...");
  
  const isDev = process.env.NODE_ENV === 'development';
  let jrePath;
  let jarPath;

  if (isDev) {
    console.log("Mode: Development");
    springBootProcess = spawn('cmd.exe', ['/c', 'gradlew.bat', 'bootRun', '--args="--server.port=8080"'], {
      cwd: path.join(__dirname, 'backend')
    });
  } else {
    console.log("Mode: Production");
    jarPath = path.join(process.resourcesPath, 'backend', 'prusaslicer-java-wrapper.jar');
    jrePath = path.join(process.resourcesPath, 'backend', 'jre', 'bin', 'java.exe');
    
    console.log("Expected JRE at:", jrePath);
    console.log("Expected JAR at:", jarPath);

    let finalJavaCmd = jrePath;

    if (!fs.existsSync(jrePath)) {
        console.warn(`Bundled JRE not found at ${jrePath}. Falling back to system 'java'.`);
        finalJavaCmd = 'java';
    }

    if (!fs.existsSync(jarPath)) {
        console.error(`Backend JAR not found at ${jarPath}`);
        // Fallback for testing without full packaging
        const localJar = path.join(__dirname, 'backend/build/staging/backend/prusaslicer-java-wrapper.jar');
        if (fs.existsSync(localJar)) {
            console.log("Found JAR in staging, using local path:", localJar);
            jarPath = localJar;
        } else {
            dialog.showErrorBox("Backend Error", "No se encontró el archivo .jar del servidor.");
            return;
        }
    }

    springBootProcess = spawn(finalJavaCmd, ['-jar', jarPath, '--server.port=8080']);
  }

  springBootProcess.on('error', (err) => {
    console.error("Failed to start backend process:", err);
    dialog.showErrorBox("Backend Spawn Error", err.message);
  });

  springBootProcess.stdout.on('data', (data) => {
    console.log(`[Backend]: ${data}`);
  });

  springBootProcess.stderr.on('data', (data) => {
    console.error(`[Backend-Error]: ${data}`);
  });

  springBootProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    if (code !== 0 && code !== null) {
        dialog.showErrorBox("Backend Crash", `El proceso Java termino inesperadamente con codigo: ${code}`);
    }
  });
}

app.on('ready', () => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (springBootProcess) {
    console.log("Killing Spring Boot Backend...");
    if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', springBootProcess.pid, '/f', '/t']);
    } else {
        springBootProcess.kill();
    }
  }
});
