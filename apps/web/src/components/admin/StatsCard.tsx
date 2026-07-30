import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-3 bg-accent/10 rounded-xl shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{title}</p>
          <p className="text-xl font-bold font-heading">{value}</p>
          {description && <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
