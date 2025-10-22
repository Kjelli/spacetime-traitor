import { AnimatePresence } from "framer-motion";
import { GameState, type Player } from "../../module_bindings";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import ViewResolver from "./ViewResolver";
import SvgIcon from "../ui/icons/SvgIcon";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type MobileInputProps = {
  player: Player;
  players: Player[];
  gameState: GameState | undefined;

  join: () => void;
  leave: () => void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  changeName: (name: string) => void;
  addPrompt: (traitorText: string, loyalText: string) => void;
  castVote: (votedFor: Player) => void;
};

export default function MobileInput({
  player,
  gameState,
  ...props
}: MobileInputProps) {
  const isFocusedOnMobile =
    gameState?.currentFocus === "mobile" ||
    gameState?.currentFocus === "mobile-dimmed" ||
    gameState?.currentFocus === "both" ||
    gameState?.currentFocus === "both-dimmed" ||
    !gameState;

  const isFocusedOnMobileDimmed =
    gameState?.currentFocus === "mobile-dimmed" ||
    gameState?.currentFocus === "both-dimmed";

  const fullScreenHandle = useFullScreenHandle();

  return (
    <FullScreen handle={fullScreenHandle}>
      <button
        className="absolute cursor-pointer w-12 h-12 top-0.5 right-0.5 mr-4 mt-4 border border-gray-400 hover:border-white hover:text-white rounded-md"
        onClick={() =>
          fullScreenHandle.active
            ? fullScreenHandle.exit()
            : fullScreenHandle.enter()
        }
      >
        <SvgIcon
          type={fullScreenHandle.active ? "CollapseArrows" : "ExpandArrows"}
          className="text-gray-400 hover:text-white"
        />
      </button>
      <div
        className={`absolute z-10 pointer-events-none bg-black w-screen min-h-screen h-screen overflow-x-hidden overflow-y-hidden
          ${isFocusedOnMobile ? "hidden" : "opacity-50"}`}
      ></div>
      <div
        className={`flex justify-around text-white text-3xl text-center w-screen min-h-screen h-screen overflow-x-hidden overflow-y-hidden bg-gradient-to-br from-black 
          ${
            !isFocusedOnMobile || isFocusedOnMobileDimmed
              ? "to-gray-950"
              : player?.isVip === true
                ? " to-yellow-900"
                : " to-purple-900"
          }`}
      >
        <div className="min-w-sm">
          <AnimatePresence mode="wait">
            <ViewResolver player={player} gameState={gameState} {...props} />
          </AnimatePresence>
        </div>
      </div>
    </FullScreen>
  );
}
