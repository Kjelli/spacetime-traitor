import { useEffect, useRef, useState } from "react";
import type { GameState, Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { MagicButton } from "../ui/MagicButton";
import SvgIcon from "../ui/icons/SvgIcon";

export type VIPViewProps = {
  initialOpen?: boolean;
  player: Player;
  gameState: GameState | undefined;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function VIPView({
  initialOpen = false,
  gameState,
  changeState,
}: VIPViewProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (isOpen) {
      detailsRef.current?.setAttribute("open", "true");
    } else {
      detailsRef.current?.removeAttribute("open");
    }
  }, [isOpen]);

  return (
    <div className="absolute z-1 bottom-0 max-w-sm w-full items-center space-y-4 pb-24">
      <hr className="border border-white opacity-50" />
      <details
        className="w-full space-y-4"
        ref={detailsRef}
        onClick={(e) => e.preventDefault()}
      >
        <summary
          className="flex justify-between w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SvgIcon
            type={isOpen ? "ChevronDown" : "ChevronUp"}
            className="w-8 h-8"
          />
          VIP
          <SvgIcon
            type={isOpen ? "ChevronDown" : "ChevronUp"}
            className="w-8 h-8"
          />
        </summary>
        {!gameState && (
          <MagicButton
            label="Nytt spill"
            skin="positive"
            onClick={() => changeState("lobby", "both")}
          />
        )}
        {gameState?.state === "lobby" && (
          <div className="space-y-4">
            <MagicButton
              disabled={gameState.players.length < 3}
              label="Start spillet"
              skin="positive"
              onClick={() => changeState("starting", "desktop")}
            />

            <MagicButton
              label="Rediger prompts"
              skin="neutral"
              onClick={() => changeState("admin", "both")}
            />
          </div>
        )}
        {["starting", "intro", "roles", "playing", "vote-results"].includes(
          gameState?.state || ""
        ) && (
          <MagicButton
            skin="negative"
            label="Avbryt spillet"
            onClick={() => changeState("lobby", "both")}
          />
        )}
      </details>
    </div>
  );
}
