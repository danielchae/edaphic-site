import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "#12332A",
          color: "#B2E67A",
          fontSize: 56,
          fontFamily: "Inter, ui-sans-serif, system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "2px solid #0a0a0a",
            }}
          />
          <div style={{ fontWeight: 600, color: "#B2E67A" }}>Edaphic</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#B2E67A" }}>
          of, produced by, or influenced by the soil. AI-native venture studio.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


