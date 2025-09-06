import React from 'react';
import { getHighScores } from '../hooks/useTetris';

function HighScores() {
  const highScores = getHighScores().slice(0, 10);
  
 

  return (
    <div className="">
      {/* <h2>High Scores</h2>
      <ol className="high-scores-list">
        {highScores.map((score: number, index: number) => (
          <li key={index} className="high-score-item">
            {score}
          </li>
        ))}
      </ol> */}
    </div>
  );
}

export default HighScores;
