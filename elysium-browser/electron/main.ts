import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FFFFFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      sandbox: false,
    },
    frame: false,
    show: false,
  });

  // Graceful window show
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Security: Disable navigation to external sites in the main window
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    callback({});
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

// Memory and storage handlers
ipcMain.handle('storage:save', async (_, key: string, value: any) => {
  // In production, implement encrypted storage
  return { success: true };
});

ipcMain.handle('storage:load', async (_, key: string) => {
  // In production, implement encrypted storage
  return null;
});

ipcMain.handle('storage:delete', async (_, key: string) => {
  return { success: true };
});

// AI service handlers (stub for integration)
ipcMain.handle('ai:query', async (_, prompt: string, context?: any) => {
  // This is where you'd integrate with OpenAI, Anthropic, or local models
  return {
    response: `[AI Response to: ${prompt}]`,
    timestamp: new Date().toISOString(),
  };
});

export {};
