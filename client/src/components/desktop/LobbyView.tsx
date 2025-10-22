import { AnimatePresence, motion } from "framer-motion";
import { type GameState } from "../../module_bindings";
import CountdownCircle from "../ui/CountdownCircle";
import type { FocusOnDevice } from "../../types/FocusOnDevice";

type LobbyViewProps = {
  gameState: GameState | undefined;

  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function LobbyView({ gameState, changeState }: LobbyViewProps) {
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 1.5 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const isInLobby = gameState?.state === "lobby";
  const isStarting = gameState?.state === "starting";
  return (
    <div className="py-12">
      <h1 className="text-5xl text-gray-400 text-center">
        {isInLobby && <span>Venter på spillere</span>}
        {isStarting && <span>Spillet starter</span>}
      </h1>

      <div className="mt-4 flex flex-col gap-y-2 justify-center items-center min-h-[calc(100vh-12rem)]">
        <p className="text-xl text-gray-400 text-center">Spillere</p>
        {gameState?.players.map((p) => (
          <motion.div
            key={`lobby-player-${p.identity.toHexString()}`}
            className="text-center"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {p.isVip && (
              <span className="text-xs relative -top-1 -left-1">⭐</span>
            )}
            {p.name}
          </motion.div>
        ))}
        <AnimatePresence mode="wait">
          {gameState?.state === "starting" && (
            <motion.div
              key="lobby-countdown"
              className="absolute left-1/2 top-3/4 -translate-x-1/2 -translate-y-1/2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.1, ease: "easeInOut" }}
            >
              <CountdownCircle
                duration={3}
                onComplete={() => changeState("intro", "desktop-dimmed")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
