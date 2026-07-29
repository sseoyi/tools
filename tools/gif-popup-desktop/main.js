const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;
let popupWindow;
let popupCloseTimer = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
}

function closePopup() {
  if (popupCloseTimer) {
    clearTimeout(popupCloseTimer);
    popupCloseTimer = null;
  }
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.close();
  }
  popupWindow = null;
}

function showPopup(data) {
  closePopup();

  popupWindow = new BrowserWindow({
    width: 420,
    height: 320,
    show: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    focusable: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 'screen-saver' level keeps it above fullscreen apps on macOS too
  popupWindow.setAlwaysOnTop(true, 'screen-saver');
  popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  popupWindow.loadFile(path.join(__dirname, 'src', 'popup.html'));

  popupWindow.webContents.once('did-finish-load', () => {
    if (popupWindow && !popupWindow.isDestroyed()) {
      popupWindow.webContents.send('popup-data', data);
    }
  });

  const duration = (parseFloat(data.duration) || 30) * 1000;
  popupCloseTimer = setTimeout(closePopup, duration);
}

ipcMain.on('show-popup', (event, data) => {
  showPopup(data);
});

ipcMain.on('stop-popup', () => {
  closePopup();
});

// Popup window asks to be resized/positioned once it knows the GIF's natural size
ipcMain.on('resize-popup', (event, { width, height }) => {
  if (!popupWindow || popupWindow.isDestroyed()) return;
  const display = screen.getPrimaryDisplay();
  const { width: sw, height: sh } = display.workAreaSize;
  const margin = 24;
  const x = Math.max(0, sw - width - margin);
  const y = Math.max(0, sh - height - margin);
  popupWindow.setBounds({ x, y, width: Math.round(width), height: Math.round(height) });
  popupWindow.show();
});

app.whenReady().then(() => {
  createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  closePopup();
  if (process.platform !== 'darwin') app.quit();
});
