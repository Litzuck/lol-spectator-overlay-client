const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  loadReplay: () => ipcRenderer.invoke('load-replay-dialog'),
  updateImages: () => ipcRenderer.invoke('update-images'),
  connectToClient: () => ipcRenderer.invoke('connect-to-client'),
  sendNewConfig: (newConfig) => ipcRenderer.send('newConfig', newConfig),
  openOverlay: () => ipcRenderer.send('open-overlay'),
  onNewServerStatus: (callback) => ipcRenderer.on('server-status', callback)
})