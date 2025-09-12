export function calculateGameProgress(currentIndex, phase, totalQuestions) {
  if (phase === "end") return 100
  if (phase === "lobby") return 0

  const questionProgress = currentIndex / totalQuestions
  const phaseBonus = phase === "reveal" ? 0.5 / totalQuestions : 0

  return Math.min(100, (questionProgress + phaseBonus) * 100)
}

export function validateGameTransition(currentPhase, targetPhase) {
  const validTransitions = {
    lobby: ["question"],
    question: ["reveal", "end"],
    reveal: ["question", "end"],
    end: [],
  }

  return validTransitions[currentPhase]?.includes(targetPhase) || false
}

export function generateGameStats(players, currentQuestionIndex, correctIndex) {
  const totalPlayers = players.length
  const answeredPlayers = players.filter((p) => p.answered[currentQuestionIndex] !== undefined)
  const correctAnswers = players.filter((p) => p.answered[currentQuestionIndex] === correctIndex)

  return {
    totalPlayers,
    totalAnswered: answeredPlayers.length,
    correctAnswers: correctAnswers.length,
    accuracy: answeredPlayers.length > 0 ? Math.round((correctAnswers.length / answeredPlayers.length) * 100) : 0,
    participationRate: Math.round((answeredPlayers.length / totalPlayers) * 100),
  }
}
