import { Card, CardContent } from "./ui/card"

export default function PinBadge({ pin }) {
  return (
    <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="text-sm font-medium opacity-90 mb-2">Game PIN</div>
        <div className="text-4xl font-bold tracking-wider">{pin}</div>
        <div className="text-sm opacity-90 mt-2">Share this PIN with players</div>
      </CardContent>
    </Card>
  )
}
