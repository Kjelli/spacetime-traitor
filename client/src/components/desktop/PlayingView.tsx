import type { GameState } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";

export type PlayingViewProps = {
  gameState: GameState | undefined;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function PlayingView({
  gameState,
  changeState,
}: PlayingViewProps) {
  if (gameState?.votes.length === gameState?.players.length) {
    changeState("vote-results", "desktop-dimmed");
  }

  return (
    <div className="min-h-screen flex items-center">
      <div className="w-full space-y-16">
        <div className="w-full flex flex-wrap gap-8 justify-center">
          {gameState?.players.map((player) => (
            <div
              className={
                gameState.votes.find((vote) =>
                  vote.voter.isEqual(player.identity)
                )
                  ? "text-red-400"
                  : "text-gray-500"
              }
              key={player.identity.toHexString()}
            >
              {player.name}
            </div>
          ))}
        </div>
        <p>Hvem er forræderen?</p>
        <p className="text-5xl">
          {gameState?.votes.length} av {gameState?.players.length} har stemt
        </p>
      </div>
    </div>
  );
}
