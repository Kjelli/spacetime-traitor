import { motion } from "framer-motion";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { useEffect, useState } from "react";
import { type GameState } from "../../module_bindings";

type IntroViewProps = {
  gameState: GameState;

  assignRoles: () => void;
  setPrompt(): void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

const texts = [
  "De lojale får nå et hint for å finne hverandre",
  "Forræderen må skjule sin identitet og lure de lojale",
  "Lykke til",
];

export default function IntroView({
  setPrompt,
  assignRoles,
  changeState,
}: IntroViewProps) {
  const [stage, setStage] = useState(0);
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const totalStages = texts.length;

  useEffect(() => {
    if (stage >= totalStages) {
      changeState("roles", "both-dimmed");
    }
  }, [changeState, stage, totalStages]);

  useEffect(() => {
    assignRoles();
    setPrompt();
  }, [assignRoles, setPrompt]);

  return (
    <>
      {stage % 2 === 0 && (
        <motion.div
          key="1"
          initial="hidden"
          className="min-h-screen flex items-center"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onAnimationComplete={() =>
            setTimeout(() => setStage((prev) => prev + 1), 2000)
          }
        >
          <p className="w-full">{texts[stage]}</p>
        </motion.div>
      )}

      {stage % 2 === 1 && (
        <motion.div
          key="2"
          initial="hidden"
          className="min-h-screen flex items-center"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onAnimationComplete={() =>
            setTimeout(() => setStage((prev) => prev + 1), 2000)
          }
        >
          <p className="w-full">{texts[stage]}</p>
        </motion.div>
      )}
    </>
  );
}
