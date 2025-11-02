"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";

interface XPNotificationProps {
  xp: number;
  levelUp?: boolean;
  newLevel?: number;
  newRank?: string;
  onComplete?: () => void;
}

export function XPNotification({
  xp,
  levelUp = false,
  newLevel,
  newRank,
  onComplete,
}: XPNotificationProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -50 }}
        transition={{ duration: 0.5 }}
        className="fixed top-20 right-4 z-50 pointer-events-none"
        onAnimationComplete={() => {
          setTimeout(() => {
            onComplete?.();
          }, 3000);
        }}
      >
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl p-6 min-w-[300px] border-2 border-white/20">
          {levelUp ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center space-y-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Sparkles className="h-12 w-12 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold">NIVEAU SUPÉRIEUR !</h3>
              <div className="space-y-1">
                <p className="text-xl font-semibold">Niveau {newLevel}</p>
                {newRank && (
                  <p className="text-sm opacity-90">Rang: {newRank}</p>
                )}
              </div>
              <div className="pt-2 border-t border-white/20">
                <p className="text-sm">+{xp} XP gagnés !</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-2"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <TrendingUp className="h-10 w-10 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-bold">+{xp} XP</h3>
              <p className="text-sm opacity-90">Continuez comme ça !</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

