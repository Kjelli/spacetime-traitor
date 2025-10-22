import { motion } from "framer-motion";
import { Player, Prompt, type GameState } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import LobbyView from "./LobbyView";
import IntroView from "./IntroView";
import LoadingView from "../LoadingView";
import RoleView from "./RoleView";
import PlayingView from "./PlayingView.tsx";
import EditorView from "./EditorView.tsx";
import VoteResultsView from "./VoteResultsView.tsx";
import GameOverView from "./GameOverView.tsx";

type ViewResolverProps = {
  players: Player[];
  prompts: Prompt[];
  gameState: GameState | undefined;

  setPrompt: () => void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  assignRoles: () => void;
  resetVotes: () => void;
  kick: (player: Player) => void;
};

export default function ViewResolver({
  gameState,
  prompts,

  ...props
}: ViewResolverProps) {
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };

  switch (gameState?.state) {
    case undefined:
      return <p>Ingen spill aktiv</p>;
    case "admin":
      return <EditorView prompts={prompts} {...props} />;
    case "lobby":
    case "starting":
      return (
        <motion.div
          key="lobby-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <LobbyView gameState={gameState} {...props} />
        </motion.div>
      );
    case "intro":
      return (
        <motion.div
          key="intro-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <IntroView gameState={gameState} {...props} />
        </motion.div>
      );

    case "roles":
      return (
        <motion.div
          key="roles-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <RoleView {...props} />
        </motion.div>
      );

    case "playing":
      return (
        <motion.div
          key="playing-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <PlayingView gameState={gameState} {...props} />
        </motion.div>
      );
    case "vote-results":
      return (
        <motion.div
          key="vote-results-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <VoteResultsView gameState={gameState} {...props} />
        </motion.div>
      );
    case "game-over":
      return (
        <motion.div
          key="game-over-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <GameOverView gameState={gameState} {...props} />
        </motion.div>
      );
    default:
      return <LoadingView />;
  }
}
