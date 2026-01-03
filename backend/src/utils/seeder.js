const bcrypt = require("bcrypt");
const db = require("../models");
const logger = require("../config/logger");

const seedDatabase = async () => {
    const stats = { users: 0, companies: 0, departments: 0 };

    try {
        logger.info("Starting database seeding...");

        // 1. Parallel: Create Super Admin & HR Users
        const adminEmail = "admin@smoothsync.com";
        const hrEmail = "hr@smoothsync.com";
        const passwordHash = await bcrypt.hash("admin123", 10); // Reuse hash for speed since it's demo data

        const [admin, hr] = await Promise.all([
            (async () => {
                let u = await db.User.findOne({ where: { email: adminEmail } });
                if (!u) {
                    u = await db.User.create({
                        first_name: "Super",
                        last_name: "Admin",
                        email: adminEmail,
                        password: passwordHash,
                        role: "ADMIN",
                        is_active: true,
                    });
                    stats.users++;
                    logger.info("✅ Super Admin user created.");
                }
                return u;
            })(),
            (async () => {
                let u = await db.User.findOne({ where: { email: hrEmail } });
                if (!u) {
                    u = await db.User.create({
                        first_name: "Human",
                        last_name: "Resource",
                        email: hrEmail,
                        password: passwordHash,
                        role: "HR",
                        is_active: true,
                    });
                    stats.users++;
                    logger.info("✅ HR user created.");
                }
                return u;
            })()
        ]);

        // 2. Create Demo Company (Depends on Admin)
        const companyCode = "DEMO";
        let company = await db.Company.findOne({ where: { company_code: companyCode } });

        if (!company) {
            company = await db.Company.create({
                name: "Demo Company",
                company_code: companyCode,
                working_hours_per_day: 9,
                working_days_per_week: 5,
                timezone: "Asia/Kolkata",
                created_by: admin.id,
            });
            stats.companies++;
            logger.info("✅ Demo Company created.");
        }

        // 3. Parallel: Create Departments (Depends on Company & HR)
        const depts = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"];

        await Promise.all(depts.map(async (d) => {
            const exists = await db.Department.findOne({ where: { name: d, company_id: company.id } });
            if (!exists) {
                await db.Department.create({
                    name: d,
                    company_id: company.id,
                    created_by: hr.id // HR creates departments
                });
                stats.departments++;
            }
        }));
        logger.info(`✅ ${stats.departments} Departments created.`);

        const msg = `Seeding Complete! Created: ${stats.users} Users, ${stats.companies} Company, ${stats.departments} Departments.`;
        logger.info(msg);
        return { success: true, message: msg };

    } catch (error) {
        logger.error("Seeding failed: " + error.message);
        throw error;
    }
};

module.exports = seedDatabase;
