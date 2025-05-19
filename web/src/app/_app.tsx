// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import '@/styles/globals.css';

// Add the Remix icon CSS in _document.tsx or here
import 'remixicon/fonts/remixicon.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CharityConnect - Nonprofit Management Platform</title>
        <meta name="description" content="A comprehensive charity management platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;