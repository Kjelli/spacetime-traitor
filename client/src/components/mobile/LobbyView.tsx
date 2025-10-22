import type { GameState, Player } from "../../module_bindings";
import { NameView } from "./NameView";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { MagicButton } from "../ui/MagicButton";
import VIPView from "./VIPView";

type LobbyViewProps = {
  player: Player;
  gameState: GameState | undefined;

  join: () => void;
  leave: () => void;
  changeName?: (name: string) => void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function LobbyView({
  player,
  gameState,

  join,
  leave,
  changeName,
  changeState,
}: LobbyViewProps) {
  const hasName = !!player.name;
  const isStarting = gameState?.state === "starting";
  const hasJoined =
    !!gameState?.players.length &&
    !!player.identity &&
    gameState.players.findIndex((joinedPlayer) =>
      joinedPlayer.identity.isEqual(player.identity)
    ) !== -1;

  return (
    <div className="min-h-screen w-full flex items-center">
      <div className="w-full space-y-6">
        <NameView
          name={player.name}
          changeName={(name) => {
            changeName?.(name);
          }}
        />

        {/* Lobby panel */}
        {hasName && (
          <>
            {hasJoined ? (
              <MagicButton
                disabled={isStarting}
                skin="negative"
                label="Forlat"
                onClick={leave}
              />
            ) : (
              <MagicButton
                disabled={isStarting}
                skin="positive"
                label="Jeg er klar"
                onClick={join}
              />
            )}
          </>
        )}

        {/* VIP panel */}
        {hasName && player.isVip && (
          <VIPView
            initialOpen={true}
            player={player}
            gameState={gameState}
            changeState={changeState}
          />
        )}
      </div>
    </div>
  );
}
