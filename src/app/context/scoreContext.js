"use client"
const { createContext, useState } = require("react");

export const scoreContext = createContext();

export const ScoreProvider = ({ children }) => {
    const [tetriesScore,setTeterisScore] = useState(0);
    const [startState,setStartState] = useState(false);
  return <scoreContext.Provider value={{tetriesScore,setTeterisScore,startState,setStartState}}>{children}</scoreContext.Provider>;
};
