import { motion } from "framer-motion";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { useEffect, useState } from "react";
import { Player, type GameState } from "../../module_bindings";
import type { Identity } from "spacetimedb";

type VoteResultsViewProps = {
  gameState: GameState;

  assignRoles: () => void;
  setPrompt(): void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  kick: (player: Player) => void;
  resetVotes: () => void;
  setPrompt: () => void;
};

type RoundResult = {
  eliminatedPlayer?: VoteResult;
  tiedPlayers?: VoteResult[];

  eliminatedIsTraitor?: boolean;
};

type VoteResult = {
  identity: Identity;
  playerName: string;
  votesReceived: number;
};

export default function VoteResultsView({
  gameState,

  changeState,
  resetVotes,
  kick,
  setPrompt,
}: VoteResultsViewProps) {
  const [stage, setStage] = useState(0);
  const variants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 },
  };
  const results = determineResults(gameState);
  const texts = buildNarrative(gameState, results);
  const totalStages = texts.length;

  useEffect(() => {
    if (stage >= totalStages) {
      // Reset votes for next round
      if (results.eliminatedPlayer) {
        const eliminated = gameState.players.find((p) =>
          p.identity.isEqual(results.eliminatedPlayer!.identity)
        );

        if (eliminated) {
          kick(eliminated);
        }
      }

      resetVotes();
      setPrompt();

      if (results.eliminatedIsTraitor) {
        changeState("game-over", "both-dimmed");
        return;
      }

      if (gameState.players.length - (results.eliminatedPlayer ? 1 : 0) < 3) {
        changeState("game-over", "both-dimmed");
        return;
      }

      // Game goes on!
      changeState("playing", "both-dimmed");
    }
  }, [stage, totalStages]);

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
function determineResults(gameState: GameState): RoundResult {
  const voteCountMap: { [playerId: string]: number } = {};

  gameState.votes.forEach((vote) => {
    const votedOnId = vote.votedOn.toHexString();
    if (voteCountMap[votedOnId]) {
      voteCountMap[votedOnId] += 1;
    } else {
      voteCountMap[votedOnId] = 1;
    }
  });

  const results: VoteResult[] = gameState.players.map((player) => ({
    identity: player.identity,
    playerName: player.name!,
    votesReceived: voteCountMap[player.identity.toHexString()] || 0,
  }));

  // Get single player with most votes
  // If tie, get all players with most votes
  const maxVotes = Math.max(...results.map((r) => r.votesReceived));
  const playersWithMostVotes = results.filter(
    (r) => r.votesReceived === maxVotes
  );

  // Check if single player received majority of votes
  const majorityThreshold = Math.floor(gameState.players.length / 2) + 1;
  const singleMajority =
    playersWithMostVotes.length === 1 &&
    playersWithMostVotes[0].votesReceived >= majorityThreshold;

  return {
    eliminatedPlayer: singleMajority ? playersWithMostVotes[0] : undefined,
    tiedPlayers: !singleMajority ? playersWithMostVotes : undefined,
    eliminatedIsTraitor: singleMajority
      ? gameState.players.find(
          (p) =>
            p.identity.isEqual(playersWithMostVotes[0].identity) &&
            p.role === "traitor"
        ) !== undefined
      : undefined,
  };
}
function buildNarrative(gameState: GameState, result: RoundResult) {
  const texts = ["Stemmene er mottatt"];

  if (result.eliminatedPlayer) {
    texts.push(
      `${result.eliminatedPlayer.playerName} fikk flest stemmer og ble eliminert.`
    );
    const eliminatedIsTraitor = gameState.players.find(
      (p) =>
        p.identity.isEqual(result.eliminatedPlayer!.identity) &&
        p.role === "traitor"
    );

    texts.push(`${result.eliminatedPlayer.playerName} var`);

    if (!eliminatedIsTraitor) {
      texts.push("Lojal");
      texts.push(`RIP, ${result.eliminatedPlayer!.playerName} 😢`);
      texts.push(`Anyway, spillet går videre!`);
    }
  } else if (result.tiedPlayers) {
    const names = result.tiedPlayers.map((p) => p.playerName).join(" og ");
    texts.push(
      `Det ble uavgjort mellom ${names} med ${result.tiedPlayers[0].votesReceived} stemmer hver!`
    );
    texts.push(`Kjipt, spillet går videre!`);
  }

  return texts;
}
