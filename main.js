"use strict";

const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const keyEvents = require("./key-events");

function handleKeyUp(message) {
  mainWindow.webContents.send("keyboard-command", message);
}

function startLogging() {
  keyEvents.setCallback(handleKeyUp);
  keyEvents.startListening();
}

let mainWindow;
let dev = false;

if (
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 680,
    show: false
  });
  mainWindow.setMenu(null);
  mainWindow.setMinimumSize(560, 680);

  let indexPath;

  // Implementing Webpack
  if (dev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true
    });
  }

  mainWindow.loadURL(indexPath);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    startLogging();

    if (dev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  keyEvents.stopListening();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
