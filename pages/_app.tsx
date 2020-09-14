import { useEffect } from "react";
import "../styles/global.css";
import { AppProps } from "next/app";
import ReactGA from "react-ga";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ReactGA.initialize("UA-177931764-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  return <Component {...pageProps} />;
}
