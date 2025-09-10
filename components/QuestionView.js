"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function QuestionView({ question, roomId, playerToken, hasAnswered, currentIndex, onAnswerSubmitted }) {
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submitAnswer = async (choice) => {
    if (hasAnswered || submitting) return

    setSubmitting(true)
    setSelectedChoice(choice)

    try {
      const response = await fetch(`/api/rooms/${roomId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerToken,
          qIndex: currentIndex || 0,
          choice,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }

      // Trigger immediate state refresh
      if (onAnswerSubmitted) {
        setTimeout(onAnswerSubmitted, 500)
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
      setSelectedChoice(null)
    } finally {
      setSubmitting(false)
    }
  }

  if (!question) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading question...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-blue-600">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasAnswered ? (
          <div className="text-center py-8">
            <div className="text-lg font-bold text-green-600 mb-2">Answer Submitted!</div>
            <div className="text-gray-600">Waiting for other players...</div>
            {selectedChoice !== null && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-700">
                  You selected: <strong>{String.fromCharCode(65 + selectedChoice)}</strong>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => submitAnswer(index)}
                disabled={submitting}
                variant="outline"
                className={`p-4 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300 transition-colors ${
                  selectedChoice === index ? "bg-blue-100 border-blue-400" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
