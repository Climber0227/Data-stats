const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs')
const { v4: uuidv4 } = require('uuid')

const isDev = process.env.NODE_ENV === 'dev' || process.argv.includes('--dev')

// Data file in user's app data folder
let DATA_FILE

function ensureDataDir() {
  const userDataPath = app.getPath('userData')
  DATA_FILE = join(userDataPath, 'data.json')
  if (!existsSync(userDataPath)) mkdirSync(userDataPath, { recursive: true })
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify({ projects: [] }, null, 2), 'utf-8')
  }
}

function readData() {
  ensureDataDir()
  const raw = readFileSync(DATA_FILE, 'utf-8')
  const data = JSON.parse(raw)
  if (Array.isArray(data)) {
    const migrated = { projects: [{ id: uuidv4(), name: '默认', records: data }] }
    writeFileSync(DATA_FILE, JSON.stringify(migrated, null, 2), 'utf-8')
    return migrated
  }
  if (!data.projects) data.projects = []
  return data
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ── IPC Handlers ──

function setupIPC() {
  ipcMain.handle('get-projects', () => {
    const data = readData()
    return data.projects.map(p => ({
      id: p.id,
      name: p.name,
      recordCount: p.records.length,
      lastRecord: p.records.length
        ? [...p.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        : null,
    }))
  })

  ipcMain.handle('create-project', (_e, name) => {
    const data = readData()
    const project = { id: uuidv4(), name: name.trim(), records: [] }
    data.projects.push(project)
    writeData(data)
    return project
  })

  ipcMain.handle('rename-project', (_e, id, name) => {
    const data = readData()
    const project = data.projects.find(p => p.id === id)
    if (!project) throw new Error('项目不存在')
    project.name = name.trim()
    writeData(data)
    return project
  })

  ipcMain.handle('delete-project', (_e, id) => {
    const data = readData()
    const idx = data.projects.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('项目不存在')
    if (data.projects.length <= 1) throw new Error('至少保留一个项目')
    data.projects.splice(idx, 1)
    writeData(data)
    return { success: true }
  })

  ipcMain.handle('get-records', (_e, projectId) => {
    const data = readData()
    const project = data.projects.find(p => p.id === projectId)
    if (!project) throw new Error('项目不存在')
    return [...project.records].sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  ipcMain.handle('add-record', (_e, projectId, record) => {
    const data = readData()
    const project = data.projects.find(p => p.id === projectId)
    if (!project) throw new Error('项目不存在')
    const newRecord = {
      id: uuidv4(),
      date: record.date,
      value: Number(record.value),
      note: record.note || '',
    }
    project.records.push(newRecord)
    writeData(data)
    return newRecord
  })

  ipcMain.handle('update-record', (_e, projectId, recordId, updates) => {
    const data = readData()
    const project = data.projects.find(p => p.id === projectId)
    if (!project) throw new Error('项目不存在')
    const record = project.records.find(r => r.id === recordId)
    if (!record) throw new Error('记录不存在')
    if (updates.date !== undefined) record.date = updates.date
    if (updates.value !== undefined) record.value = Number(updates.value)
    if (updates.note !== undefined) record.note = updates.note
    writeData(data)
    return record
  })

  ipcMain.handle('delete-record', (_e, projectId, recordId) => {
    const data = readData()
    const project = data.projects.find(p => p.id === projectId)
    if (!project) throw new Error('项目不存在')
    const idx = project.records.findIndex(r => r.id === recordId)
    if (idx === -1) throw new Error('记录不存在')
    project.records.splice(idx, 1)
    writeData(data)
    return { success: true }
  })

  ipcMain.handle('get-data-path', () => DATA_FILE)
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: '数据图工具',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, '..', 'dist', 'index.html'))
  }

  win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
  setupIPC()
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
