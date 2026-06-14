/**
 * API abstraction: Electron IPC in production, HTTP fetch in browser dev mode.
 */
const isElectron = () => typeof window !== 'undefined' && window.electronAPI

const api = {
  // Projects
  async getProjects() {
    if (isElectron()) return window.electronAPI.getProjects()
    const res = await fetch('/api/projects')
    return res.json()
  },

  async createProject(name) {
    if (isElectron()) return window.electronAPI.createProject(name)
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    return res.json()
  },

  async renameProject(id, name) {
    if (isElectron()) return window.electronAPI.renameProject(id, name)
    await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
  },

  async deleteProject(id) {
    if (isElectron()) return window.electronAPI.deleteProject(id)
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (res.status === 400) throw new Error('至少保留一个项目')
  },

  // Records
  async getRecords(projectId) {
    if (isElectron()) return window.electronAPI.getRecords(projectId)
    const res = await fetch(`/api/projects/${projectId}/records`)
    return res.json()
  },

  async addRecord(projectId, record) {
    if (isElectron()) return window.electronAPI.addRecord(projectId, record)
    const res = await fetch(`/api/projects/${projectId}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })
    return res.json()
  },

  async updateRecord(projectId, recordId, updates) {
    if (isElectron()) return window.electronAPI.updateRecord(projectId, recordId, updates)
    await fetch(`/api/projects/${projectId}/records/${recordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  },

  async deleteRecord(projectId, recordId) {
    if (isElectron()) return window.electronAPI.deleteRecord(projectId, recordId)
    await fetch(`/api/projects/${projectId}/records/${recordId}`, { method: 'DELETE' })
  },
}

export default api
