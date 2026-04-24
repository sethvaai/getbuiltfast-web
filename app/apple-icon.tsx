import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="128" height="128" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 4 L8 18 L14 18 L12 28 L24 12 L17 12 L18 4 Z" fill="#00D4FF" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
