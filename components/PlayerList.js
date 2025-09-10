import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export default function PlayerList({ players = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Players</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {players.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {players.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">Waiting for players...</div>
            <div className="text-sm">Players will appear here when they join</div>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {player.score} pts
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
