import type { Prompt } from "../../module_bindings";

export type EditorViewProps = {
  prompts: Prompt[];
};

export default function EditorView({ prompts }: EditorViewProps) {
  return (
    <div className="min-h-screen flex flex-wrap items-center gap-2 text-xl">
      <h1 className="w-full text-center text-3xl">Editor</h1>
      {prompts.map((prompt) => (
        <div
          key={prompt.id}
          className="border border-white rounded-md px-4 py-2"
        >
          <p className="text-red-300 wrap-anywhere max-w-64">
            {prompt.traitorText}
          </p>
          <p className="text-green-300 wrap-anywhere max-w-64">
            {prompt.loyalText}
          </p>
        </div>
      ))}
    </div>
  );
}
