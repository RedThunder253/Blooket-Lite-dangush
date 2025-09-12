import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Blooket Lite</CardTitle>
          <CardDescription>Educational Quiz Game for Students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/host" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Host a Game</Button>
          </Link>
          <Link href="/join" className="block">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              Join a Game
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
