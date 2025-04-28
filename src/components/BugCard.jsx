import { Card, CardContent } from "@/components/ui/card"
import RadarPlot from "@/components/RadarPlot"
import { Badge } from "@/components/ui/badge"

function BugCard({ bug }) {
  return (
    <Card className="w-full max-w-md h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
      <CardContent className="flex flex-col gap-3 flex-1">
        <img
          src={bug.image}
          alt={bug.name}
          className="w-full h-60 flex-none object-cover rounded-xl"
        />
        <div className="flex flex-wrap gap-1 justify-center mt-1">
          {bug.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">
              {t}
            </Badge>
          ))}
        </div>
        <h2 className="text-xl font-semibold text-center">{bug.name}</h2>
        <p className="text-center text-sm italic">“{bug.pickupLine}”</p>
        <RadarPlot stats={bug.stats} />
      </CardContent>
    </Card>
  )
}

export default BugCard
