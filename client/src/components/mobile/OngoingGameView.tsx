export default function OngoingGameView() {
  return (
    <div className="min-h-screen w-screen flex items-center text-gray-400 bg-black">
      <div className="max-w-sm w-full m-auto space-y-8">
        <p>Du er ikke med i spillet</p>
        <p className="text-2xl">Vent til runden er over før du kan bli med</p>
      </div>
    </div>
  );
}
