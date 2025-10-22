const { app, BrowserWindow, Tray, globalShortcut, ipcMain, screen, Menu } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Create the overlay window
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Calculate overlay dimensions (60% width, 70% height, centered)
  const windowWidth = Math.floor(width * 0.6);
  const windowHeight = Math.floor(height * 0.7);
  const windowX = Math.floor((width - windowWidth) / 2);
  const windowY = Math.floor((height - windowHeight) / 2);

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: windowX,
    y: windowY,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Hide instead of close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      hideWindow();
    }
  });

  mainWindow.on('blur', () => {
    // Hide when clicking outside (unless in focus mode)
    const isFocusMode = store.get('focusMode', false);
    if (!isFocusMode) {
      hideWindow();
    }
  });
}

function showWindow() {
  if (!mainWindow) {
    createWindow();
  }

  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.show();
  mainWindow.focus();

  // Animate in with opacity
  mainWindow.setOpacity(0);
  let opacity = 0;
  const fadeIn = setInterval(() => {
    opacity += 0.1;
    if (opacity >= 1) {
      mainWindow.setOpacity(1);
      clearInterval(fadeIn);
    } else {
      mainWindow.setOpacity(opacity);
    }
  }, 20); // 200ms total (10 steps * 20ms)
}

function hideWindow() {
  if (!mainWindow) return;

  // Animate out with opacity
  let opacity = 1;
  const fadeOut = setInterval(() => {
    opacity -= 0.12;
    if (opacity <= 0) {
      mainWindow.setOpacity(0);
      mainWindow.hide();
      clearInterval(fadeOut);
    } else {
      mainWindow.setOpacity(opacity);
    }
  }, 20); // 180ms total
}

function toggleWindow() {
  if (mainWindow && mainWindow.isVisible()) {
    hideWindow();
  } else {
    showWindow();
  }
}

// Create system tray
function createTray() {
  // Create a simple icon (you'll want to replace this with actual icon)
  tray = new Tray(path.join(__dirname, '../../assets/tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Followw',
      click: () => showWindow()
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        showWindow();
        mainWindow.webContents.send('navigate-to', 'settings');
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Followw',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Followw - Work that moves with you');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    toggleWindow();
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  createTray();

  // Register global shortcut (Cmd/Ctrl+Shift+Space)
  const ret = globalShortcut.register('CommandOrControl+Shift+Space', () => {
    toggleWindow();
  });

  if (!ret) {
    console.log('Global shortcut registration failed');
  }

  // Additional shortcuts
  globalShortcut.register('CommandOrControl+K', () => {
    if (mainWindow && mainWindow.isVisible()) {
      mainWindow.webContents.send('show-command-palette');
    }
  });

  globalShortcut.register('Escape', () => {
    if (mainWindow && mainWindow.isVisible()) {
      hideWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Don't quit on window close - keep running in tray
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.on('hide-window', () => {
  hideWindow();
});

ipcMain.on('quit-app', () => {
  isQuitting = true;
  app.quit();
});

ipcMain.on('set-focus-mode', (event, enabled) => {
  store.set('focusMode', enabled);
});

ipcMain.handle('get-store-value', async (event, key) => {
  return store.get(key);
});

ipcMain.on('set-store-value', (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle('get-all-data', async () => {
  return {
    tasks: store.get('tasks', []),
    clients: store.get('clients', []),
    projects: store.get('projects', []),
    timeEntries: store.get('timeEntries', []),
    settings: store.get('settings', {})
  };
});

ipcMain.on('save-all-data', (event, data) => {
  if (data.tasks) store.set('tasks', data.tasks);
  if (data.clients) store.set('clients', data.clients);
  if (data.projects) store.set('projects', data.projects);
  if (data.timeEntries) store.set('timeEntries', data.timeEntries);
  if (data.settings) store.set('settings', data.settings);
});
