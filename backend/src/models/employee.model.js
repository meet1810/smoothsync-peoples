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
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
            allowNull: true,
        },
        marital_status: {
            type: DataTypes.ENUM("SINGLE", "MARRIED", "DIVORCED", "WIDOWED"),
            allowNull: true,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        personal_email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isEmail: true }
        },
        present_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        permanent_address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        about: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        skills: {
            type: DataTypes.JSON, // Stores array of strings
            allowNull: true,
        },
        hobbies: {
            type: DataTypes.JSON, // Stores array of strings
            allowNull: true,
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        reporting_manager_id: {
            type: DataTypes.UUID,
            allowNull: true,
            // references: { model: 'Employees', key: 'id' } // Self-referential FK handled in associations
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
