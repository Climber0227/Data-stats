import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data.json')
const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Ensure data file exists with proper structure
if (!existsSync(DATA_FILE)) {
  writeFileSync(DATA_FILE, JSON.stringify({ projects: [] }, null, 2), 'utf-8')
}

function readData() {
  const raw = readFileSync(DATA_FILE, 'utf-8')
  const data = JSON.parse(raw)
  // Migrate from old flat format
  if (Array.isArray(data)) {
    const migrated = {
      projects: [{ id: uuidv4(), name: '默认', records: data }],
    }
    writeData(migrated)
    return migrated
  }
  if (!data.projects) data.projects = []
  return data
}

function writeData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Projects ──

// GET all projects (without full records, just summary)
app.get('/api/projects', (_req, res) => {
  const data = readData()
  const summaries = data.projects.map(p => ({
    id: p.id,
    name: p.name,
    recordCount: p.records.length,
    lastRecord: p.records.length
      ? [...p.records].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      : null,
  }))
  res.json(summaries)
})

// POST create project
app.post('/api/projects', (req, res) => {
  const { name } = req.body
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '项目名称不能为空' })
  }
  const data = readData()
  const project = { id: uuidv4(), name: name.trim(), records: [] }
  data.projects.push(project)
  writeData(data)
  res.status(201).json(project)
})

// PUT rename project
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params
  const { name } = req.body
  if (!name || !name.trim()) {
    return res.status(400).json({ error: '项目名称不能为空' })
  }
  const data = readData()
  const project = data.projects.find(p => p.id === id)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  project.name = name.trim()
  writeData(data)
  res.json(project)
})

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params
  const data = readData()
  const idx = data.projects.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ error: '项目不存在' })
  if (data.projects.length <= 1) {
    return res.status(400).json({ error: '至少保留一个项目' })
  }
  data.projects.splice(idx, 1)
  writeData(data)
  res.json({ success: true })
})

// ── Records (within a project) ──

// GET records for a project
app.get('/api/projects/:id/records', (req, res) => {
  const { id } = req.params
  const data = readData()
  const project = data.projects.find(p => p.id === id)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  const records = [...project.records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )
  res.json(records)
})

// POST new record to a project
app.post('/api/projects/:id/records', (req, res) => {
  const { id } = req.params
  const { date, value, note } = req.body
  if (!date || value === undefined || value === null) {
    return res.status(400).json({ error: '日期和数值为必填项' })
  }
  const data = readData()
  const project = data.projects.find(p => p.id === id)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  const record = { id: uuidv4(), date, value: Number(value), note: note || '' }
  project.records.push(record)
  writeData(data)
  res.status(201).json(record)
})

// PUT update a record
app.put('/api/projects/:projectId/records/:recordId', (req, res) => {
  const { projectId, recordId } = req.params
  const { date, value, note } = req.body
  const data = readData()
  const project = data.projects.find(p => p.id === projectId)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  const record = project.records.find(r => r.id === recordId)
  if (!record) return res.status(404).json({ error: '记录不存在' })
  if (date !== undefined) record.date = date
  if (value !== undefined) record.value = Number(value)
  if (note !== undefined) record.note = note
  writeData(data)
  res.json(record)
})

// DELETE a record
app.delete('/api/projects/:projectId/records/:recordId', (req, res) => {
  const { projectId, recordId } = req.params
  const data = readData()
  const project = data.projects.find(p => p.id === projectId)
  if (!project) return res.status(404).json({ error: '项目不存在' })
  const idx = project.records.findIndex(r => r.id === recordId)
  if (idx === -1) return res.status(404).json({ error: '记录不存在' })
  project.records.splice(idx, 1)
  writeData(data)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
