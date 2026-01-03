import { useRouter } from "next/router";
import "@/styles/globals.css";
import Layout from "@/components/Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ public routes
  const publicRoutes = ["/", "/auth/register"];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const verifyUser = async () => {
      const storedUser = localStorage.getItem("userData");

      // ✅ Public routes → no auth needed
      if (isPublicRoute) {
        setAuthChecked(true);
        return;
      }

      // ❌ Protected route without login
      if (!storedUser) {
        router.replace("/");
        return;
      }

      const user = JSON.parse(storedUser);

      if (!user?.token) {
        localStorage.clear();
        router.replace("/");
        return;
      }

      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        // ✅ token valid
        setAuthChecked(true);
      } catch (error) {
        localStorage.clear();
        router.replace("/");
      }
    };

    verifyUser();
  }, [router.pathname]);

  // ⏳ wait till auth check
  if (!authChecked) return null;

  return isPublicRoute ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
