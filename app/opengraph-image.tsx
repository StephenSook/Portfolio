import { ImageResponse } from "next/og";

export const alt = "Stephen Sookra — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamic OG card. Replaced with generated brand art in Milestone 4 if desired. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#05070a",
          color: "#eaf2f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8dff5a",
          }}
        >
          Software Engineer // AI + Full-Stack
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, marginTop: 16, lineHeight: 1 }}>
          STEPHEN SOOKRA
        </div>
        <div style={{ fontSize: 30, marginTop: 28, color: "#8fa0aa" }}>
          7 top-3 finishes across 6 events. Building intelligent systems that matter.
        </div>
      </div>
    ),
    { ...size }
  );
}
