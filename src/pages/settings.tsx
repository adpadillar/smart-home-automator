import type { NextPage } from "next";
import Head from "next/head";

interface SettingsPageProps {
  children?: React.ReactNode;
}

const SettingsPage: NextPage<SettingsPageProps> = () => {
  return (
    <div className="px-4 py-2">
      <Head>
        <title>Configuración - Smart Home Automator</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>This is a page</h1>
    </div>
  );
};

export default SettingsPage;
