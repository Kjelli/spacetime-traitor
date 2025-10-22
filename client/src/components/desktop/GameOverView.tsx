import type { GameState } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import CountdownCircle from "../ui/CountdownCircle";

export type GameOverViewProps = {
  gameState: GameState | undefined;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function GameOverView({
  gameState,
  changeState,
}: GameOverViewProps) {
  const isTraitorInGame = gameState?.players.find(
    (player) => player.role === "traitor"
  );

  return (
    <div className="min-h-screen flex items-center">
      <div className="w-full flex flex-col justify-center space-y-16">
        <p className="text-5xl">
          {isTraitorInGame ? "De lojale har tapt!" : "De lojale vant!"}
        </p>
        <p>
          <span className="text-red-400">Forræderen</span> var
          {" " + gameState?.previousTraitor}!
        </p>
        <div className="mx-auto">
          <CountdownCircle
            duration={10}
            onComplete={() => changeState("lobby", "both")}
          />
        </div>
      </div>
    </div>
  );
}
