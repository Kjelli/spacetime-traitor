import { motion } from "framer-motion";
import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import LobbyView from "./LobbyView";
import PlayingView from "./PlayingView";
import LoadingView from "../LoadingView";
import NewGameView from "./NewGameView";
import WatchDesktopView from "./WatchDesktopView";
import RoleView from "./RoleView";
import OngoingGameView from "./OngoingGameView";
import EditorView from "./EditorView";
import GameOverView from "./GameOverView";

type ViewResolverProps = {
  player: Player;
  players: Player[];
  gameState: GameState | undefined;

  join: () => void;
  leave: () => void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  changeName: (name: string) => void;
  addPrompt: (loyalText: string, traitorText: string) => void;
  castVote: (votedFor: Player) => void;
};

export default function ViewResolver({
  player,
  gameState,

  addPrompt,

  ...props
}: ViewResolverProps) {
  const animationVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1 },
  };

  const hasJoined =
    gameState?.players &&
    gameState.players.find((p) => p.identity.isEqual(player.identity));

  if (!gameState?.state) {
    return <NewGameView changeState={props.changeState} />;
  }

  if (gameState.state === "admin") {
    if (!player.isVip) {
      return <LobbyView player={player} gameState={gameState} {...props} />;
    }
    return (
      <motion.div
        key="admin"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <EditorView addPrompt={addPrompt} {...props} />
      </motion.div>
    );
  }

  if (gameState.state === "lobby" || gameState.state === "starting") {
    return (
      <motion.div
        key="lobby"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <LobbyView player={player} gameState={gameState} {...props} />
      </motion.div>
    );
  }

  if (!hasJoined) {
    return <OngoingGameView />;
  }

  if (["intro", "vote-results"].includes(gameState.state)) {
    return (
      <motion.div
        key="intro"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <WatchDesktopView gameState={gameState} player={player} {...props} />
      </motion.div>
    );
  }

  if (gameState.state === "roles") {
    return (
      <motion.div
        key="roles"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <RoleView
          player={player}
          gameState={gameState}
          changeState={props.changeState}
        />
      </motion.div>
    );
  }

  if (gameState.state === "playing") {
    return (
      <motion.div
        key="playing"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <PlayingView player={player} gameState={gameState} {...props} />
      </motion.div>
    );
  }

  if (gameState.state === "game-over") {
    return (
      <motion.div
        key="game-over"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <GameOverView player={player} gameState={gameState} {...props} />
      </motion.div>
    );
  }

  return <LoadingView />;
}
