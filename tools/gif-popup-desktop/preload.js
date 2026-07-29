const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showPopup: (data) => ipcRenderer.send('show-popup', data),
  stopPopup: () => ipcRenderer.send('stop-popup'),
  resizePopup: (size) => ipcRenderer.send('resize-popup', size),
  onPopupData: (callback) => ipcRenderer.on('popup-data', (event, data) => callback(data)),
});
