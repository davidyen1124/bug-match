import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

function RadarPlot({ stats }) {
  const data = Object.entries(stats).map(([trait, value]) => ({ trait, value }))
  return (
    <RadarChart width={280} height={200} data={data} className="mx-auto">
      <PolarGrid />
      <PolarAngleAxis dataKey="trait" tick={{ fontSize: 10 }} />
      <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} />
      <Radar dataKey="value" strokeWidth={2} fillOpacity={0.3} />
    </RadarChart>
  )
}

export default RadarPlot
