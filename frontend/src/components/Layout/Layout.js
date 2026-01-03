import styles from "../../styles/Layout.module.css";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className={styles.appContainer}>
      {/* Video Background */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBg}
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-blue-geometric-shapes-slowly-moving-42431-large.mp4" type="video/mp4" />
      </video> */}

      <div className={styles.wrapper}>
        <Sidebar />
        <div className={styles.main}>
          <Navbar />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}