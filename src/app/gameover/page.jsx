"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GameOverPage() {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    saveData();
  }, [score]);

  const saveData = async () => {
    const saved = JSON.parse(localStorage.getItem("flappyGameSave")) || {};
    const savedFullname = localStorage.getItem("fullname") || "";
    const savedUsername = localStorage.getItem("username") || "";
    const savedScore = localStorage.getItem(savedUsername) || 0;
    setUsername(savedUsername);
    setScore(saved.circleScore + saved.flappyScore);
    let repsoneT = Math.min(
      10,
      Math.floor((saved.circleScore + saved.flappyScore) / 5)
    );
    setResponseTime(repsoneT);
    if (score != 0) {
      const data = await fetch("/api/users", {
        method: "post",
        body: JSON.stringify({
          fullname: savedFullname,
          username: savedUsername,
          score: score,
          response_time: repsoneT,
        }),
      });
    }
  };
  const handlePlayAgain = async () => {
    // Redirect to start page
    router.push("/start");
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#30c0df" }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/BG.png')" }}
      />

      {/* Ground Element */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 bg-cover bg-repeat-x"
        style={{
          backgroundImage: "url('/img/ground.png')",
          backgroundSize: "auto 100%",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* Game Over Sprite */}
          <div className="mb-8">
            <img
              src="/img/go.png"
              alt="Game Over"
              className="mx-auto"
              style={{ maxWidth: "200px", height: "auto" }}
            />
          </div>

          {/* Score Display */}
          <div className="bg-white bg-opacity-90 rounded-lg p-6 mb-8 shadow-lg">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              Final Score
            </div>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {score}
            </div>
            <div className="text-lg text-gray-600">
              Player: <span className="font-semibold">{username}</span>
            </div>
          </div>

          {/* Play Again Button */}
          <button
            onClick={handlePlayAgain}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
