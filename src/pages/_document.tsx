import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="apple-touch-icon" href="/icon.png"></link> */}
        <meta name="theme-color" content="rgba(53, 142, 144, 1)" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
