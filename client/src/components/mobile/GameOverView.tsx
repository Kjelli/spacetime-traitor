import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import VIPView from "./VIPView";

export type GameOverViewProps = {
  player: Player;
  gameState: GameState | undefined;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function GameOverView({
  player,
  gameState,
  changeState,
}: GameOverViewProps) {
  const isTraitorInGame = gameState?.players.find(
    (player) => player.role === "traitor"
  );

  const isTraitor = gameState?.players.find(
    (p) => p.identity.isEqual(player.identity) && p.role === "traitor"
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-16 text-gray-400">
      <p className="text-center w-full">
        {isTraitorInGame && !isTraitor ? "Du tapte!" : "Du vant!"}
      </p>
      <p className="text-8xl">{isTraitorInGame && !isTraitor ? "😢" : "🥳"}</p>
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
