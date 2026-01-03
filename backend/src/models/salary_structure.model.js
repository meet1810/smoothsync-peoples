module.exports = (sequelize, DataTypes) => {
    return sequelize.define("salary_structures", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        employee_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        base_wage: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        wage_type: {
            type: DataTypes.ENUM("FIXED"),
            defaultValue: "FIXED",
            allowNull: false,
        },
        working_days: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            allowNull: false,
        },
        break_time: {
            type: DataTypes.INTEGER, // in minutes
            defaultValue: 60,
            allowNull: false,
        },
        basic_component: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        hra_component: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        fixed_allowance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        other_allowances: {
            type: DataTypes.JSON, // To store flexible allowances like Travel, Performance etc.
            allowNull: true,
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
