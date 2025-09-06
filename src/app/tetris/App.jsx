import Board from "./components/Board";
import UpcomingBlocks from "./components/UpcomingBlocks";
import HighScores from "./components/HighScores";
import { useTetris } from "./hooks/useTetris";
import "./index.css";
import { useContext, useEffect } from "react";
import { scoreContext } from "../context/scoreContext";
function App() {
  const {startState}=useContext(scoreContext);
  const { board, startGame, isPlaying, score, upcomingBlocks } = useTetris();
  useEffect(() => {
    const timer = setTimeout(() => {
      startGame();
    }, 2000);
    return () => clearTimeout(timer);
    }, []);
  return (
    <div className="app h-[70vh]">
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        {isPlaying ? (
          <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
        ) : (
          <>
            <button onClick={startGame}>Reset Game</button>
            <HighScores />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
