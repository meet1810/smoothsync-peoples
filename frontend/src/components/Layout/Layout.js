
import styles from "../../styles/Layout.module.css";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
