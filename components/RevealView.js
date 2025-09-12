import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

export default function RevealView({ question, correctIndex, yourChoice, tallies }) {
  if (!question) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading results...</div>
        </CardContent>
      </Card>
    )
  }

  const wasCorrect = yourChoice === correctIndex

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-blue-600">{question.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Your Result */}
        <div
          className={`p-4 rounded-lg text-center ${
            wasCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="text-lg font-bold">{wasCorrect ? "🎉 Correct!" : "❌ Incorrect"}</div>
          <div className="text-sm mt-1">
            {yourChoice !== undefined ? `You chose: ${String.fromCharCode(65 + yourChoice)}` : "You did not answer"}
          </div>
        </div>

        {/* Answer Options with Results */}
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isCorrect = index === correctIndex
            const votes = tallies ? tallies[index] : 0
            const wasYourChoice = yourChoice === index

            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${
                  isCorrect
                    ? "bg-green-100 border-green-400 text-green-800"
                    : wasYourChoice
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : wasYourChoice
                            ? "bg-red-500 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                    {isCorrect && <span className="text-green-600 font-bold">✓ Correct</span>}
                  </div>
                  <Badge variant="secondary" className="bg-white">
                    {votes} votes
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center text-gray-600 text-sm mt-4">Waiting for host to continue...</div>
      </CardContent>
    </Card>
  )
}
