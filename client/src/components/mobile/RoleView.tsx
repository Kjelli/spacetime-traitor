import { motion } from "framer-motion";
import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import VIPView from "./VipView";

export type RoleViewProps = {
  player: Player;
  gameState: GameState | undefined;

  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function RoleView({
  player,
  gameState,
  changeState,
}: RoleViewProps) {
  const isTraitor = player.role === "traitor";
  return (
    <div className="min-h-screen flex items-center text-gray-400">
      <div className="h-full center-items flex flex-col space-y-4 text-center w-full">
        <p>Du er</p>
        <motion.div
          key="role-label"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={{
            hidden: { opacity: 0, scale: 1, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 1.2, y: 0 },
          }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <p
            className={`text-5xl ${isTraitor ? "text-red-700" : "text-green-700"}`}
          >
            {isTraitor ? "Forræder" : "Lojal"}
          </p>
        </motion.div>
      </div>
      {player.isVip && (
        <VIPView
          player={player}
          gameState={gameState}
          changeState={changeState}
        />
      )}
    </div>
  );
}
