import React from 'react';
import { default as HTMLHead } from "next/head"; // Meta
/**
 * Meta HTML Head
 * @returns {ReactElement} HTML Head component
 */
function Head() {
  return (
    <HTMLHead>
      {/* Primary Meta Tags */}
      <title>Loot</title>
      <meta name="title" content="Loot" />
      <meta
        name="description"
        content="Traveler Loot is randomized character generated and stored on chain."
      />

      {/* OG + Faceook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="#" />
      <meta property="og:title" content="Traveler Loot" />
      <meta
        property="og:description"
        content="Traveler Loot is randomized character generated and stored on chain."
      />
      <meta property="og:image" content="#" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="#" />
      <meta property="twitter:title" content="Traveler Loot" />
      <meta
        property="twitter:description"
        content="Loot is randomized adventurer gear generated and stored on chain."
      />
      <meta property="twitter:image" content="https://lootproject.com/meta.png" />

      {/* Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <link rel = "stylesheet" href = "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
    </HTMLHead>
  );
}
export default Head;