"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { XPNotification } from "./XPNotification";

interface XPAnimationProps {
  xp: number;
  totalXP: number;
  currentLevel: number;
  currentRank: string;
  onComplete?: () => void;
}

export function XPAnimation({
  xp,
  totalXP,
  currentLevel,
  currentRank,
  onComplete,
}: XPAnimationProps) {
  const [showNotification, setShowNotification] = useState(true);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [newRank, setNewRank] = useState("");

  useEffect(() => {
    // Calculer le nouveau niveau
    const newTotalXP = totalXP + xp;
    const calculatedLevel = Math.floor(Math.sqrt(newTotalXP / 100)) + 1;
    const ranks = ["Débutant", "Motivé", "Discipliné", "Expert", "Maître", "Légende", "Immortel"];
    const calculatedRank =
      calculatedLevel < 5
        ? ranks[0]
        : calculatedLevel < 10
        ? ranks[1]
        : calculatedLevel < 20
        ? ranks[2]
        : calculatedLevel < 35
        ? ranks[3]
        : calculatedLevel < 50
        ? ranks[4]
        : calculatedLevel < 75
        ? ranks[5]
        : ranks[6];

    if (calculatedLevel > currentLevel) {
      setLevelUp(true);
      setNewLevel(calculatedLevel);
      setNewRank(calculatedRank);
      
      // Jouer un son (si disponible)
      // playLevelUpSound();
    }
  }, [xp, totalXP, currentLevel, currentRank]);

  if (!showNotification) return null;

  return (
    <XPNotification
      xp={xp}
      levelUp={levelUp}
      newLevel={newLevel}
      newRank={newRank}
      onComplete={() => {
        setShowNotification(false);
        onComplete?.();
      }}
    />
  );
}

