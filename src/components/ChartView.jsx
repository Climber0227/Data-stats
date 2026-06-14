import { useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'

const ACCENT_COLORS = ['#e11d48', '#d97706', '#059669', '#0891b2', '#dc2626', '#ca8a04']

export default function ChartView({ records, loading }) {
  const [tab, setTab] = useState('daily')

  const sorted = useMemo(
    () => [...records].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [records]
  )

  // Daily trend chart
  const dailyOption = useMemo(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      borderRadius: 12,
      padding: [12, 16],
      textStyle: { color: '#1f2937', fontSize: 13 },
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      formatter: (params) => {
        const p = params[0]
        return `<div style="font-weight:600;margin-bottom:4px;color:#111">${p.axisValue}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span>
            <span style="color:#666">数值：</span><b style="color:#111">${p.value.toFixed(1)}</b>
          </div>`
      },
    },
    grid: { left: 16, right: 24, top: 16, bottom: 8 },
    xAxis: {
      type: 'category',
      data: sorted.map(r => r.date.slice(5)),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    series: [{
      type: 'line',
      data: sorted.map(r => r.value),
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 3, color: '#e11d48' },
      itemStyle: { color: '#e11d48', borderColor: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(225,29,72,0.12)' },
            { offset: 1, color: 'rgba(225,29,72,0.0)' },
          ],
        },
      },
    }],
  }), [sorted])

  // Monthly summary bar chart
  const monthlyOption = useMemo(() => {
    const months = {}
    sorted.forEach(r => {
      const m = r.date.slice(0, 7)
      if (!months[m]) months[m] = { total: 0, count: 0 }
      months[m].total += r.value
      months[m].count++
    })
    const entries = Object.entries(months)
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderRadius: 12,
        padding: [12, 16],
        textStyle: { color: '#1f2937', fontSize: 13 },
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      },
      grid: { left: 16, right: 24, top: 16, bottom: 8 },
      xAxis: {
        type: 'category',
        data: entries.map(([m]) => m),
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
      series: [{
        type: 'bar',
        data: entries.map(([, v], i) => ({
          value: v.total,
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
            color: ACCENT_COLORS[i % ACCENT_COLORS.length],
          },
        })),
        barWidth: 32,
        emphasis: {
          itemStyle: { color: '#111' },
        },
      }],
    }
  }, [sorted])

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { key: 'daily', label: '每日趋势' },
          { key: 'monthly', label: '月度汇总' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              tab === t.key
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
          <p className="text-sm">暂无数据，点击右上角添加记录</p>
        </div>
      ) : (
        <ReactECharts
          option={tab === 'daily' ? dailyOption : monthlyOption}
          style={{ height: 320 }}
          opts={{ renderer: 'svg' }}
        />
      )}
    </div>
  )
}
