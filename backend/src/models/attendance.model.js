module.exports = (sequelize, DataTypes) => {
    return sequelize.define("attendances", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        employee_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        check_in: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        check_out: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("PRESENT", "ABSENT", "HALF_DAY", "LEAVE"),
            defaultValue: "ABSENT",
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
