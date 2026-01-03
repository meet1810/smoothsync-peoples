module.exports = (sequelize, DataTypes) => {
    return sequelize.define("leave_requests", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        employee_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        leave_type: {
            type: DataTypes.ENUM("PAID", "SICK", "UNPAID"),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
            defaultValue: "PENDING",
        },
        approved_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        rejected_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        action_at: {
            type: DataTypes.DATE,
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
