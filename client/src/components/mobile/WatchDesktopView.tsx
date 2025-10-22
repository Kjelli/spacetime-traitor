import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import VIPView from "./VIPView";

export type WatchDesktopViewProps = {
  player: Player;
  gameState: GameState | undefined;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function WatchDesktopView({
  player,
  gameState,
  changeState,
}: WatchDesktopViewProps) {
  return (
    <div className="min-h-screen flex items-center text-gray-400">
      <p className="text-center text-3xl w-full">Følg med på skjermen</p>
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
