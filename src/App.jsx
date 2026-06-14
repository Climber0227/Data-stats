import { useState, useEffect, useCallback } from 'react'
import StatsCards from './components/StatsCards'
import ChartView from './components/ChartView'
import RecordTable from './components/RecordTable'
import AddRecordModal from './components/AddRecordModal'
import Sidebar from './components/Sidebar'
import api from './api'
import { ShinyButton } from '@/components/ui/shiny-button'
import { BlurFade } from '@/components/ui/blur-fade'
import { Particles } from '@/components/ui/particles'

export default function App() {
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  // Load projects
  const loadProjects = useCallback(async () => {
    try {
      const data = await api.getProjects()
      setProjects(data)
      if (data.length > 0 && (!activeProjectId || !data.find(p => p.id === activeProjectId))) {
        setActiveProjectId(data[0].id)
      }
    } catch (err) {
      console.error('获取项目列表失败:', err)
    }
  }, [activeProjectId])

  useEffect(() => { loadProjects() }, [])

  // Load records for active project
  const fetchRecords = useCallback(async () => {
    if (!activeProjectId) return
    setLoading(true)
    try {
      const data = await api.getRecords(activeProjectId)
      setRecords(data)
    } catch (err) {
      console.error('获取数据失败:', err)
    } finally {
      setLoading(false)
    }
  }, [activeProjectId])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const activeProject = projects.find(p => p.id === activeProjectId)

  // Project CRUD
  const handleCreateProject = async (name) => {
    const created = await api.createProject(name)
    await loadProjects()
    setActiveProjectId(created.id)
  }

  const handleRenameProject = async (id, name) => {
    await api.renameProject(id, name)
    loadProjects()
  }

  const handleDeleteProject = async (id) => {
    try {
      await api.deleteProject(id)
      loadProjects()
    } catch (err) {
      alert(err.message || '删除失败')
    }
  }

  // Record CRUD
  const handleAdd = async (record) => {
    await api.addRecord(activeProjectId, record)
    fetchRecords()
    loadProjects()
    setModalOpen(false)
  }

  const handleUpdate = async (id, record) => {
    await api.updateRecord(activeProjectId, id, record)
    fetchRecords()
    setEditingRecord(null)
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这条记录吗？')) return
    await api.deleteRecord(activeProjectId, id)
    fetchRecords()
    loadProjects()
  }

  const openEdit = (record) => {
    setEditingRecord(record)
    setModalOpen(true)
  }

  const openAdd = () => {
    setEditingRecord(null)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white flex relative">
      <Particles
        className="fixed inset-0 z-0 pointer-events-none"
        quantity={30}
        size={0.4}
        staticity={70}
        ease={80}
        color="#1a1a1a"
        refresh={false}
      />

      {/* Sidebar */}
      <Sidebar
        projects={projects}
        activeId={activeProjectId}
        onSwitch={setActiveProjectId}
        onCreate={handleCreateProject}
        onRename={handleRenameProject}
        onDelete={handleDeleteProject}
      />

      {/* Main content */}
      <div className="flex-1 relative z-10 min-w-0">
        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-black tracking-tight">
                数据图工具
                {activeProject && (
                  <span className="ml-2 text-sm font-normal text-gray-400">/ {activeProject.name}</span>
                )}
              </h1>
            </div>

            <ShinyButton
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-gray-300 bg-black text-white hover:bg-gray-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              添加记录
            </ShinyButton>
          </div>
        </header>

        <main className="px-6 py-6 space-y-6 max-w-5xl">
          <BlurFade inView={true} delay={0.1} duration={0.5} blur="4px">
            <StatsCards records={records} />
          </BlurFade>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <BlurFade inView={true} delay={0.2} duration={0.5} blur="4px">
                <ChartView records={records} loading={loading} />
              </BlurFade>
              <BlurFade inView={true} delay={0.3} duration={0.5} blur="4px">
                <RecordTable records={records} loading={loading} onEdit={openEdit} onDelete={handleDelete} />
              </BlurFade>
            </div>

            <div className="space-y-4">
              <BlurFade inView={true} delay={0.25} duration={0.5} blur="4px">
                <QuickInfo records={records} projectName={activeProject?.name} />
              </BlurFade>
            </div>
          </div>
        </main>

        <AddRecordModal
          open={modalOpen}
          record={editingRecord}
          onClose={() => { setModalOpen(false); setEditingRecord(null) }}
          onSubmit={editingRecord ? (r) => handleUpdate(editingRecord.id, r) : handleAdd}
        />
      </div>
    </div>
  )
}

// ── Quick Info ──

function QuickInfo({ records, projectName }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayRecord = records.find(r => r.date === today)
  const last7 = records
    .filter(r => r.date >= new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10))
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {projectName || ''} 概览
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">今日记录</span>
          <span className="text-sm font-semibold text-black">
            {todayRecord ? todayRecord.value.toFixed(1) : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">近7天最低</span>
          <span className="text-sm font-semibold text-emerald-600">
            {last7.length ? Math.min(...last7.map(r => r.value)).toFixed(1) : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">近7天最高</span>
          <span className="text-sm font-semibold text-rose-500">
            {last7.length ? Math.max(...last7.map(r => r.value)).toFixed(1) : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-500">总记录数</span>
          <span className="text-sm font-semibold text-black">{records.length}</span>
        </div>
      </div>
    </div>
  )
}
