import type { FocusOnDevice } from "../../types/FocusOnDevice";
import CountdownCircle from "../ui/CountdownCircle";

export type RoleViewProps = {
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
};

export default function RoleView({ changeState }: RoleViewProps) {
  return (
    <div className="min-h-screen flex items-center text-gray-400">
      <div className="min-h-screen flex w-full flex-col items-center justify-center space-y-8">
        <p>Se din rolle på telefonen</p>
        <CountdownCircle
          duration={10}
          color="red"
          onComplete={() => changeState("playing", "both-dimmed")}
        />
      </div>
    </div>
  );
}
