import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from 'recoil';

 function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}


export default App;
