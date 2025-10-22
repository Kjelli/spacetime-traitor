import { motion } from "framer-motion";
import type { Player, GameState, Prompt } from "../../module_bindings";
import QRCodeCanvas from "../ui/QrCode";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import ViewResolver from "./ViewResolver";

type DesktopScreenProps = {
  players: Player[];
  prompts: Prompt[];
  gameState: GameState | undefined;

  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  assignRoles: () => void;
  setPrompt: () => void;
  resetVotes: () => void;
  kick: (player: Player) => void;
};

const host = import.meta.env.VITE_SPACETIME_MODULE_HOST;
const port = import.meta.env.VITE_WEB_PORT;
const route = `http://${host}:${port}`;

export default function DesktopScreen({
  players,
  gameState,
  prompts,

  ...props
}: DesktopScreenProps) {
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  const isFocusedOnDesktop =
    gameState?.currentFocus === "desktop" ||
    gameState?.currentFocus === "desktop-dimmed" ||
    gameState?.currentFocus === "both" ||
    gameState?.currentFocus === "both-dimmed" ||
    !gameState;

  const isFocusedOnDesktopDimmed =
    gameState?.currentFocus === "desktop-dimmed" ||
    gameState?.currentFocus === "both-dimmed";

  const isInLobby =
    gameState?.state === "lobby" || gameState?.state === "starting";

  return (
    <>
      <div
        className={`absolute z-10 pointer-events-none bg-black w-screen min-h-screen h-screen overflow-x-hidden overflow-y-hidden
          ${isFocusedOnDesktop ? "hidden" : "opacity-50"}`}
      ></div>
      <div
        className={`flex justify-around items-start relative text-white text-center text-3xl min-w-screen w-screen min-h-screen h-screen overflow-x-hidden overflow-y-hidden  bg-gradient-to-br 
          ${isFocusedOnDesktop && !isFocusedOnDesktopDimmed ? "from-gray-950 to-purple-950" : "from-black to-black"}`}
      >
        {/* Main Content */}
        <div className="p-16 h-full w-full">
          <ViewResolver
            prompts={prompts}
            players={players}
            gameState={gameState}
            {...props}
          />
        </div>

        {/* QR Code to join */}
        {isInLobby && (
          <motion.div
            key="qr-code-left"
            className="absolute left-20 bottom-1/2 translate-y-1/2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <QRCodeCanvas value={route} />
          </motion.div>
        )}
        {isInLobby && (
          <motion.div
            key="qr-code-right"
            className="absolute right-20 bottom-1/2 translate-y-1/2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ delay: 1.0, duration: 1.5, ease: "easeInOut" }}
          >
            <QRCodeCanvas value={route} />
          </motion.div>
        )}

        {/* Debug state stuff */}
        <pre className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gray-500 text-sm">
          {gameState && (
            <>
              {gameState?.game} | {gameState?.state}
            </>
          )}
          {!gameState && <>Ingen spill aktiv</>}
        </pre>
      </div>
    </>
  );
}
