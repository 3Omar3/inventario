const { app, BrowserWindow } = require("electron");
const path = require("path");
const env = process.env.NODE_ENV || "development";

// If development environment
if (env === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("src/views/index.html");
  win.maximize();
  win.show();
}

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
