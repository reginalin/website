import { useEffect } from 'react'
import '../styles/global.css'
import { AppProps } from 'next/app'
import ReactGA from 'react-ga'

const GOOGLE_ANALYTICS_ID = 'UA-177931764-1'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID)
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
  return <Component {...pageProps} />
}
