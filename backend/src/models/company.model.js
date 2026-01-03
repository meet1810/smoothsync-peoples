module.exports = (sequelize, DataTypes) => {
    return sequelize.define("companies", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company_code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        working_hours_per_day: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 9,
        },
        working_days_per_week: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "UTC",
        },
        company_logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
    });
};
