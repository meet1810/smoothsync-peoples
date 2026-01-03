import { useState } from "react";
import styles from "@/styles/sidebar.module.css";

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            id: "dashboard",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            label: "Dashboard",
        },
        {
            id: "employees",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            label: "Employees",
            badge: "124",
        },
        {
            id: "attendance",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            label: "Attendance",
        },
        {
            id: "payroll",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            label: "Payroll",
        },
        {
            id: "leaves",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            label: "Leaves",
            badge: "8",
        },
        {
            id: "reports",
            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            label: "Reports",
        },
    ];

    return (
        <aside
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
        >
            <button
                className={styles.collapseBtn}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                        transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                    }}
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            </button>

            <div className={styles.menuSection}>
                <div className={styles.sectionTitle}>
                    {!isCollapsed && <span>MENU</span>}
                </div>
                <nav className={styles.menu}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`${styles.menuItem} ${activeItem === item.id ? styles.active : ""
                                }`}
                            onClick={() => setActiveItem(item.id)}
                            title={item.label}
                        >
                            <span className={styles.menuIcon}>{item.icon}</span>
                            {!isCollapsed && (
                                <>
                                    <span className={styles.menuLabel}>{item.label}</span>
                                    {item.badge && (
                                        <span className={styles.menuBadge}>{item.badge}</span>
                                    )}
                                </>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className={styles.bottomSection}>
                <button className={styles.menuItem} title="Settings">
                    <span className={styles.menuIcon}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m6-12h-6m-6 0H1m17.66 1.34l-4.24 4.24M10.58 13.42l-4.24 4.24M23 12h-6m-6 0H5m13.66 5.66l-4.24-4.24M10.58 10.58l-4.24-4.24" />
                        </svg>
                    </span>
                    {!isCollapsed && <span className={styles.menuLabel}>Settings</span>}
                </button>
            </div>
        </aside>
    );
}