import Head from "next/head";
import Navbar from "@/pages/Component/Layout/navbar";
import Dashboard from "@/pages/Component/Dashboard/dashboard";
import styles from "@/styles/Home.module.css";
import Sidebar from "./Component/Layout/sidebar";

export default function Home() {
  return (
    <>
      <Head>
        <title>HRMS Dashboard - Employee Management</title>
        <meta
          name="description"
          content="Premium HRMS Dashboard with iOS Liquid Glass Design"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.appContainer}>
        <Navbar />
        <div className={styles.mainLayout}>
          <Sidebar />
          <main className={styles.mainContent}>
            <Dashboard />
          </main>
        </div>
      </div>
    </>
  );
}