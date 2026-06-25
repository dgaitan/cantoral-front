import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo/site";

// A single, constant branded share card. Because this file lives at the app
// root, Next applies it as og:image / twitter:image for every route.
// NOTE: ImageResponse renders via satori, which only supports inline styles —
// this is the sanctioned exception to the project's no-inline-styles rule.

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: "#0a1d2b",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(222,196,46,0.18), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#dec42e",
            fontWeight: 700,
          }}
        >
          Biblioteca de Música Católica
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 104,
            lineHeight: 1.05,
            fontWeight: 700,
            color: "#faf7f1",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 38,
            color: "rgba(243,234,214,0.75)",
          }}
        >
          {SITE_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
