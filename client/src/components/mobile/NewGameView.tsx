import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { MagicButton } from "../ui/MagicButton";

export type NewGameViewProps = {
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function NewGameView({ changeState }: NewGameViewProps) {
  return (
    <div className="min-h-screen w-screen flex items-center text-gray-400 bg-black">
      <div className="max-w-sm w-full m-auto space-y-8">
        <MagicButton
          skin="positive"
          label="Start nytt spill"
          onClick={() => changeState("lobby", "both")}
        />
      </div>
    </div>
  );
}
