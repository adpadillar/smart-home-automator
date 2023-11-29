import { type AppType } from "next/app";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import NavigationBar from "~/components/Navigation";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen w-screen justify-center">
        <div className="flex w-full max-w-3xl flex-col">
          <nav className="px-4 py-2">
            <NavigationBar />
          </nav>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
