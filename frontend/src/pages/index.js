import Head from "next/head";
import LoginForm from "@/components/auth/LoginForm";


export default function Home() {
  return (
    <>
      <Head>
        <title>SmoothSync Peoples</title>
        <meta name="description" content="SmoothSync Peoples" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm/>
    </>
  );
}
