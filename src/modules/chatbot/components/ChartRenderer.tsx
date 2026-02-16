import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import type { ChartData } from '../types/Chat.ts'

interface ChartRendererProps {
  readonly chartData: ChartData
}

const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#a78bfa',
  '#c4b5fd',
  '#818cf8',
  '#7c3aed',
  '#4f46e5',
  '#4338ca',
] as const

function renderBarChart(chartData: ChartData) {
  return (
    <BarChart data={[...chartData.data]}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={chartData.xKey} tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend />
      <Bar dataKey={chartData.yKey} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
    </BarChart>
  )
}

function renderLineChart(chartData: ChartData) {
  return (
    <LineChart data={[...chartData.data]}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={chartData.xKey} tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey={chartData.yKey}
        stroke={CHART_COLORS[0]}
        strokeWidth={2}
        dot={{ fill: CHART_COLORS[0], r: 4 }}
      />
    </LineChart>
  )
}

function renderPieChart(chartData: ChartData) {
  return (
    <PieChart>
      <Pie
        data={[...chartData.data]}
        dataKey={chartData.yKey}
        nameKey={chartData.xKey}
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {chartData.data.map((_, index) => (
          <Cell key={`cell-${index.toString()}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  )
}

const CHART_RENDERERS: Record<ChartData['type'], (data: ChartData) => React.JSX.Element> = {
  bar: renderBarChart,
  line: renderLineChart,
  pie: renderPieChart,
}

export function ChartRenderer({ chartData }: ChartRendererProps) {
  const renderer = CHART_RENDERERS[chartData.type]

  return (
    <div className="my-3">
      <p className="mb-2 text-sm font-medium text-primary">{chartData.title}</p>
      <div className="max-h-64 w-full">
        <ResponsiveContainer width="100%" height={256}>
          {renderer(chartData)}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
