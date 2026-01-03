import { useState } from "react";
import {
    FiPlus,
    FiSearch,
    FiUsers,
    FiUserPlus,
    FiCheckCircle,
    FiClock,
} from "react-icons/fi";
import styles from "@/styles/Dashboard.module.css";

export default function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic employee data
    const employees = [
        {
            id: 1,
            name: "Dhaval Siddhapura",
            initials: "DS",
            role: "Senior Developer",
            status: "active",
            color: "#6ec1ff"
        },
        {
            id: 2,
            name: "Hitarth Thombre",
            initials: "HT",
            role: "UI/UX Designer",
            status: "active",
            color: "#b9f27c"
        },
        {
            id: 3,
            name: "Sarah Mitchell",
            initials: "SM",
            role: "Product Manager",
            status: "away",
            color: "#f5b24a"
        },
        {
            id: 4,
            name: "James Rodriguez",
            initials: "JR",
            role: "Backend Developer",
            status: "active",
            color: "#ff6b6b"
        },
        {
            id: 5,
            name: "Emily Chen",
            initials: "EC",
            role: "Data Analyst",
            status: "active",
            color: "#a78bfa"
        },
        {
            id: 6,
            name: "Michael Park",
            initials: "MP",
            role: "DevOps Engineer",
            status: "offline",
            color: "#6f7682"
        },
        {
            id: 7,
            name: "Olivia Martinez",
            initials: "OM",
            role: "Frontend Developer",
            status: "active",
            color: "#f472b6"
        },
        {
            id: 8,
            name: "David Kim",
            initials: "DK",
            role: "Marketing Lead",
            status: "away",
            color: "#fb923c"
        },
        {
            id: 9,
            name: "Sophie Turner",
            initials: "ST",
            role: "HR Manager",
            status: "active",
            color: "#34d399"
        },
        {
            id: 10,
            name: "Alex Johnson",
            initials: "AJ",
            role: "QA Engineer",
            status: "active",
            color: "#60a5fa"
        },
        {
            id: 11,
            name: "Isabella Garcia",
            initials: "IG",
            role: "Content Writer",
            status: "offline",
            color: "#c084fc"
        },
        {
            id: 12,
            name: "Ryan Thompson",
            initials: "RT",
            role: "Sales Executive",
            status: "active",
            color: "#fbbf24"
        },
    ];

    const stats = [
        {
            id: 1,
            label: "Total Employees",
            value: employees.length.toString(),
            change: "+12 this month",
            icon: FiUsers,
            color: "#6ec1ff",
        },
        {
            id: 2,
            label: "Present Today",
            value: employees.filter(e => e.status === "active").length.toString(),
            change: "97.3% attendance",
            icon: FiCheckCircle,
            color: "#32d74b",
        },
        {
            id: 3,
            label: "New Hires",
            value: "8",
            change: "This month",
            icon: FiUserPlus,
            color: "#b9f27c",
        },
        {
            id: 4,
            label: "On Leave",
            value: employees.filter(e => e.status === "away").length.toString(),
            change: "2 pending approval",
            icon: FiClock,
            color: "#f5b24a",
        },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusText = (status) => {
        switch (status) {
            case "active": return "Active";
            case "away": return "On Leave";
            case "offline": return "Offline";
            default: return "Unknown";
        }
    };

    return (
        <div className={styles.dashboard}>
            {/* Header */}
            {/* <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.newButton}>
                        <FiPlus size={18} />
                        <span>NEW</span>
                    </button>
                </div>

                <div className={styles.headerCenter}>
                    <h1 className={styles.pageTitle}>Dhaval Siddhapura</h1>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.searchBar}>
                        <FiSearch size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>
            </div> */}

            {/* Stats Cards */}
            {/* <div className={styles.statsGrid}>
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.id} className={styles.statCard}>
                            <div className={styles.statIcon} style={{ color: stat.color }}>
                                <Icon size={26} />
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>{stat.label}</p>
                                <h3 className={styles.statValue}>{stat.value}</h3>
                                <p className={styles.statChange}>{stat.change}</p>
                            </div>
                        </div>
                    );
                })}
            </div> */}

            {/* Employee Grid */}
            <div className={styles.employeeSection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Employees</h3>
                    <span className={styles.employeeCount}>
                        {filteredEmployees.length} of {employees.length}
                    </span>
                </div>
                <div className={styles.employeeGrid}>
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className={styles.employeeCard}>
                            <div
                                className={styles.employeeAvatar}
                                style={{ background: `linear-gradient(135deg, ${emp.color} 0%, ${emp.color}dd 100%)` }}
                            >
                                {emp.initials}
                            </div>
                            <div className={styles.employeeInfo}>
                                <p className={styles.employeeName}>{emp.name}</p>
                                <p className={styles.employeeRole}>{emp.role}</p>
                                <div className={styles.employeeStatus}>
                                    <span className={`${styles.statusDot} ${styles[emp.status]}`} />
                                    <span style={{ color: 'rgba(230, 234, 240, 0.5)' }}>
                                        {getStatusText(emp.status)}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.checkbox} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}