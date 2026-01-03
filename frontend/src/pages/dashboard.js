import Head from "next/head"
import Dashboard from "@/components/Dashboard/dashboard";

export default function About() {
    return (
        <>
            <Head>
                <title>Smoothsync People</title>
                <meta name="description" content="Smoothsync People" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Dashboard />
        </>
    );
}
