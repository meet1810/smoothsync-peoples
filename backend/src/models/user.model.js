module.exports = (sequelize, DataTypes) => {
    return sequelize.define("users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("ADMIN", "HR", "EMPLOYEE"),
            defaultValue: "EMPLOYEE",
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });
};
