const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // Projects
  getProjects: () => ipcRenderer.invoke('get-projects'),
  createProject: (name) => ipcRenderer.invoke('create-project', name),
  renameProject: (id, name) => ipcRenderer.invoke('rename-project', id, name),
  deleteProject: (id) => ipcRenderer.invoke('delete-project', id),

  // Records
  getRecords: (projectId) => ipcRenderer.invoke('get-records', projectId),
  addRecord: (projectId, record) => ipcRenderer.invoke('add-record', projectId, record),
  updateRecord: (projectId, recordId, updates) =>
    ipcRenderer.invoke('update-record', projectId, recordId, updates),
  deleteRecord: (projectId, recordId) =>
    ipcRenderer.invoke('delete-record', projectId, recordId),

  // Utility
  getDataPath: () => ipcRenderer.invoke('get-data-path'),
})
