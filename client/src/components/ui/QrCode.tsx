import { useEffect, useRef } from "react";
import QRCode from "qrcode";

type QRCodeProps = {
  value: string; // text or URL to encode
  size?: number; // optional pixel size
};

const wifi = import.meta.env.VITE_WIFI || "Set wifi in .env";
const password = import.meta.env.VITE_PASSWORD || "Set password in .env";

export default function QRCodeCanvas({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  }, [value, size]);

  return (
    <div className="flex flex-col items-center bg-white rounded-2xl">
      <p className="text-4xl text-black cta-animation">👇 Bli med! 👇</p>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="p-4 rounded-md"
      />
      <p className="text-2xl p-1 text-black text-left">
        🛜 {wifi}
        <br />
        🔑 {password}
      </p>
    </div>
  );
}
