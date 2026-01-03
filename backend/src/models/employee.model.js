module.exports = (sequelize, DataTypes) => {
    return sequelize.define("employees", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        company_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        department_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        employee_code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        join_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        is_department_head: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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
