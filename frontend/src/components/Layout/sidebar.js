import { useState } from "react";
import styles from "@/styles/sidebar.module.css";
import Image from "next/image";
import logo from "../../../public/smoothsync_people_logo_v.png";


export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("dashboard");
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            id: "dashboard",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            label: "Dashboard",
        },
        {
            id: "employee",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            label: "Employee",
        },
        {
            id: "attendance",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            label: "Payroll",
        },
        {
            id: "leave",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            label: "Leave",
        },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className={styles.mobileMenuBtn}
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isOpen ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                </svg>
            </button>

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                {/* Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <Image
                            src={logo}
                            alt="Company Logo"
                            width={32}
                            height={32}
                            priority
                        />
                    </div>
                    <span className={styles.logoText}>Company</span>
                </div>

                {/* Menu */}
                <div className={styles.menuSection}>
                    <nav className={styles.menu}>
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.menuItem} ${activeItem === item.id ? styles.active : ""}`}
                                onClick={() => {
                                    setActiveItem(item.id);
                                    setIsOpen(false);
                                }}
                                title={item.label}
                            >
                                <span className={styles.menuIcon}>{item.icon}</span>
                                <span className={styles.menuLabel}>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
        </>
    );
}