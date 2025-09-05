"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const [username, setUsername] = useState("");
  const [fullname, setFullName] = useState("");
  const router = useRouter();

  const handleStart = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (!fullname.trim()) return;

    // Save username in localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("fullname", fullname);
    // Clear score & timer for this player
    if (username) {
      localStorage.removeItem(username); // remove score
    }
    localStorage.setItem(
      "flappyGameSave",
      JSON.stringify({
        circleScore: 0,
        flappyScore: 0,
        endTime: Math.floor(Date.now() / 1000) + 300,
      })
    );
    // Redirect to game page
    router.push("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#30c0df" }}>
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
          backgroundSize: "auto 100%"
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleStart}
          className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-96 backdrop-blur-sm"
        >
          {/* Game Title */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Flappy Bird Game
            </h1>
            <p className="text-gray-600">Enter your details to start playing</p>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 placeholder:text-black border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Game
          </button>
          
          {/* Game Info */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <p>• Click circles for bonus points</p>
            <p>• Avoid pipes in Flappy Bird</p>
            <p>• 5 minutes to score as much as possible!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
