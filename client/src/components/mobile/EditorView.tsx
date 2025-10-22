import { useState } from "react";
import type { FocusOnDevice } from "../../types/FocusOnDevice";
import { MagicButton } from "../ui/MagicButton";

type EditorViewProps = {
  changeName?: (name: string) => void;
  changeState: (state: string, focusOnDevice: FocusOnDevice) => void;
  addPrompt: (loyalText: string, traitorText: string) => void;
};

export default function EditorView({
  changeState,
  addPrompt,
}: EditorViewProps) {
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [traitorText, setTraitorText] = useState("");
  const [loyalText, setLoyalText] = useState("");

  return (
    <div className="min-h-screen flex w-full items-center">
      {!isCreatingPrompt && (
        <MagicButton
          label="Ny prompt"
          onClick={() => setIsCreatingPrompt(true)}
        />
      )}
      {isCreatingPrompt && (
        <form
          className="w-full max-w-sm mx-auto flex flex-col space-y-6"
          onReset={(e) => {
            e.preventDefault();

            setTraitorText("");
            setLoyalText("");

            setIsCreatingPrompt(false);
          }}
          onSubmit={(e) => {
            e.preventDefault();

            addPrompt(loyalText, traitorText);

            setTraitorText("");
            setLoyalText("");

            setIsCreatingPrompt(false);
          }}
        >
          <p className="text-center text-3xl text-gray-400">Ny prompt</p>
          <label className="text-center text-3xl w-full">
            Forræder tekst
            <input
              value={traitorText}
              type="text"
              className="border border-gray-600 bg-transparent rounded-md p-2 w-full"
              onChange={(e) => setTraitorText(e.target.value)}
            />
          </label>
          <label className="text-center text-3xl w-full">
            Lojal tekst
            <input
              value={loyalText}
              type="text"
              className="border border-gray-600 bg-transparent rounded-md p-2 w-full"
              onChange={(e) => setLoyalText(e.target.value)}
            />
          </label>
          <MagicButton type="submit" skin="positive" label="Lagre" />
          <MagicButton type="reset" skin="negative" label="Avbryt" />
        </form>
      )}

      <div className="absolute bottom-0 max-w-sm w-full items-center pb-24">
        <MagicButton
          label="Tilbake til lobby"
          skin="positive"
          onClick={() => changeState("lobby", "both")}
        />
      </div>
    </div>
  );
}
