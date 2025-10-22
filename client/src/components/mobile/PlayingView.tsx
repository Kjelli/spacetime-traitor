import { useState } from "react";
import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import VIPView from "./VIPView";
import { MagicButton } from "../ui/MagicButton";

type PlayingViewProps = {
  player: Player;
  gameState: GameState | undefined;

  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  castVote: (votedFor: Player) => void;
};
export default function PlayingView({
  player,
  gameState,

  changeState,
  castVote,
}: PlayingViewProps) {
  const [isVoting, setIsVoting] = useState(false);

  const myVote = gameState?.votes.find((vote) =>
    vote.voter.isEqual(player.identity)
  );
  const hasVoted = myVote !== undefined;

  const votedFor =
    myVote !== undefined
      ? gameState?.players.find((player) =>
          player.identity.isEqual(myVote?.votedOn)
        )
      : undefined;

  const isTraitor = player.role === "traitor";
  return (
    <div className="min-h-screen flex w-full items-center text-gray-400">
      <div className="w-full space-y-4">
        {hasVoted && (
          <>
            <p className="text-center text-3xl w-full">
              Du har stemt på {" " + votedFor?.name}.
            </p>
            <p className="text-2xl">Traff du?</p>
          </>
        )}
        {!hasVoted && (
          <>
            {!isVoting && (
              <>
                <p className="text-center text-3xl w-full">
                  Hint:{" "}
                  {isTraitor
                    ? (gameState?.prompt?.traitorText ?? "Blend inn")
                    : gameState?.prompt?.loyalText}
                </p>
                <MagicButton
                  label="Stem"
                  skin="positive"
                  onClick={() => setIsVoting(true)}
                />
              </>
            )}

            {isVoting && (
              <>
                <p className="text-center text-3xl w-full">
                  Hvem tror du er forræder?
                </p>
                <div className="flex flex-wrap gap-4 overflow-y-auto">
                  {gameState?.players
                    .filter((p) => !p.identity.isEqual(player.identity))
                    .map((p) => (
                      <MagicButton
                        key={p.identity.toHexString()}
                        label={p.name}
                        skin="positive"
                        onClick={() => {
                          setIsVoting(false);
                          castVote(p);
                        }}
                      />
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* VIP panel */}
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
