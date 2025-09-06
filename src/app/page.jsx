"use client";
import React, { useState, useEffect } from "react";
import FlappyBird from "./components/FlappyBird";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/start");
  }, []);

  return (
    <div className="flex justify-between items-center h-screen w-screen bg-gray-900 relative">
      {/* Random Circle */}

      {/* Left side area for random circles */}
      {/* <div id="left-side" className="w-1/4 h-full relative"></div> */}

      {/* Center area with Flappy Bird game */}
      <div className="flex justify-center items-center">
        {/* <FlappyBird /> */}
      </div>

      {/* Right side area for random circles */}
      <div id="right-side" className="w-1/4 h-full relative"></div>
    </div>
  );
};

export default Page;
