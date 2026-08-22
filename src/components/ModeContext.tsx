"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type UserMode = "personal" | "business";

interface ModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "personal",
  setMode: () => {},
  toggleMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<UserMode>("personal");

  useEffect(() => {
    const saved = localStorage.getItem("fintell_user_mode") as UserMode;
    if (saved === "personal" || saved === "business") {
      setModeState(saved);
    }
  }, []);

  const setMode = (newMode: UserMode) => {
    setModeState(newMode);
    localStorage.setItem("fintell_user_mode", newMode);
  };

  const toggleMode = () => {
    const nextMode = mode === "personal" ? "business" : "personal";
    setMode(nextMode);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useUserMode() {
  return useContext(ModeContext);
}
