// import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }


import { useRouter } from "next/router";
import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ❌ routes where layout should NOT appear
  const noLayoutRoutes = ["/auth/login", "/auth/register"];

  const isNoLayout = noLayoutRoutes.includes(router.pathname);

  return isNoLayout ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
