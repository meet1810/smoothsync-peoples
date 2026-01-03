const app = require("./app");
const db = require("./models");

const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connected (No Auto-Sync).");

        // await db.sequelize.sync(); // Auto-sync disabled per request
        // console.log("✅ Database synced.");
    } catch (err) {
        console.error("❌ Database Connection Failed (PostgreSQL might be down):", err.message);
        console.log("⚠️ Server starting anyway to allow API Panel access.");
    }

    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
        console.log(`🔧 API Panel: http://localhost:${process.env.PORT}/panel/login`);
    });
};

startServer();
