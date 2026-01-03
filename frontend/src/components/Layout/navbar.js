// import { useState } from "react";
// import { FiUsers, FiCalendar, FiClock, FiSearch, FiBell } from "react-icons/fi";
// import styles from "@/styles/Navbar.module.css";

// export default function Navbar() {
//     const [activeTab, setActiveTab] = useState("employees");

//     const tabs = [
//         { id: "employees", label: "Employees", icon: FiUsers },
//         { id: "attendance", label: "Attendance", icon: FiCalendar },
//         { id: "timeoff", label: "Time Off", icon: FiClock },
//     ];

//     return (
//         <nav className={styles.navbar}>
//             <div className={styles.leftSection}>
//                 {/* <div className={styles.logo}>Company Logo</div>

//                 <div className={styles.tabs}>
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.id}
//                             className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""
//                                 }`}
//                             onClick={() => setActiveTab(tab.id)}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div> */}
//             </div>

//             <div className={styles.rightSection}>
//                 {/* <button className={styles.iconButton}>
//                     <FiSearch size={20} />
//                 </button> */}

//                 <button className={styles.iconButton}>
//                     <FiBell size={20} />
//                     <span className={styles.badge}>2</span>
//                 </button>

//                 <div className={styles.userProfile}>
//                     <div className={styles.userAvatar} />
//                 </div>
//             </div>
//         </nav>
//     );
// }


import { FiBell } from "react-icons/fi";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarSpacer}></div>

            <div className={styles.rightSection}>
                <button className={styles.iconButton}>
                    <FiBell size={20} />
                    <span className={styles.badge}>2</span>
                </button>

                <div className={styles.userProfile}>
                    <div className={styles.userAvatar} />
                </div>
            </div>
        </nav>
    );
}