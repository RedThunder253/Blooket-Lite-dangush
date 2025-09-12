import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export default function Scoreboard({ scoreboard = [] }) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-purple-600">Final Results</CardTitle>
      </CardHeader>
      <CardContent>
        {scoreboard.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg">No scores available</div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mape each player in the scoreboard */}
            {scoreboard.map((player, index) => {
              // The first player is the winner
              // check if the index is 0, if it is, isWinner should be true
              const isWinner = index === 0
              const isPodium = index < 3

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isWinner
                      ? "bg-yellow-100 border-yellow-400"
                      : isPodium
                        // Show a blue color border if the player is on the podium
                        // Hint, if we want to change the background, we do bg-blue-500.
                        // Now how do we change the border?
                        ? "bg-blue-50 border-blue-500"
                        // Show a gray color border if the player is not on the podium
                        : "bg-gray-50 border-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          isWinner
                            ? "bg-yellow-500 text-white"
                            : isPodium
                              ? "bg-blue-500 text-white"
                              : "bg-gray-400 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{player.name}</div>
                        {isWinner && <div className="text-yellow-600 text-sm font-medium">🏆 Winner!</div>}
                      </div>
                    </div>
                    <Badge
                      variant={isWinner ? "default" : "secondary"}
                      className={`text-lg px-3 py-1 ${isWinner ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                    >
                      {player.score} pts
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-6 pt-4 border-t">
          <div className="text-gray-600">Thanks for playing Blooket Lite!</div>
        </div>
      </CardContent>
    </Card>
  )
}
