"use client";
import React, { useState, useEffect } from "react";
import FlappyBird from "../components/FlappyBird";
import App from "../tetris/App";
import { useTetris } from "../tetris/hooks/useTetris";

const Page = () => {
  const { board, startGame, isPlaying, score, upcomingBlocks } = useTetris();

  return (
    <div className="flex justify-around overflow-hidden items-center h-screen w-screen bg-gray-900 relative">
      {/* Random Circle */}
      {/* Left side area for random circles */}
      {/* <div id="left-side" className="w-1/4 h-full relative"></div> */}

      {/* Center area with Flappy Bird game */}
      <div className="flex justify-center items-center overflow-hidden">
        <FlappyBird />
      </div>

      {/* Right side area for random circles */}
      <div id="right-side" className="w-1/2 h-full relative overflow-hidden">
        {/* <Tetris /> */}
        <App />
      </div>
    </div>
  );
};

export default Page;
