type MagicButtonProps = {
  disabled?: boolean;
  label?: string;
  skin?: "positive" | "negative" | "neutral";
  type?: "reset" | "button" | "submit";
  onClick?: () => void;
};

export function MagicButton({
  label,
  disabled = false,
  skin = "neutral",
  type = "button",
  onClick,
}: MagicButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type ?? "button"}
      className={`
        ${
          skin === "positive"
            ? "bg-purple-950 hover:bg-purple-900"
            : skin === "negative"
              ? "bg-red-700 hover:bg-red-600"
              : "bg-gray-500 hover:bg-gray-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        text-white h-16 w-full rounded-xl `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
