import { Card, CardContent } from "@/components/ui/card"
import RadarPlot from "@/components/RadarPlot"
import { Badge } from "@/components/ui/badge"

function BugCard({ bug }) {
  return (
    <Card
      className="w-full max-w-md bg-white rounded-2xl overflow-hidden select-none"
      draggable={false}
    >
      <CardContent
        className="flex flex-col gap-3 flex-1 select-none"
        draggable={false}
      >
        <img
          src={bug.image}
          alt={bug.name}
          className="w-full aspect-[4/3] object-cover rounded-xl"
          draggable={false}
        />
        <div
          className="flex flex-wrap gap-1 justify-center mt-1"
          draggable={false}
        >
          {bug.tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="text-[10px] select-none"
              draggable={false}
            >
              {t}
            </Badge>
          ))}
        </div>
        <h2
          className="text-xl font-semibold text-center select-none"
          draggable={false}
        >
          {bug.name}
        </h2>
        <p
          className="text-center text-sm italic line-clamp-2 select-none"
          draggable={false}
        >
          “{bug.pickupLine}”
        </p>
        <RadarPlot stats={bug.stats} />
      </CardContent>
    </Card>
  )
}

export default BugCard
