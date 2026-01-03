const sequelize = require("../config/database");

const db = {};
db.Sequelize = require("sequelize");
db.sequelize = sequelize;

// Import all models
db.User = require("./user.model")(sequelize, db.Sequelize);
db.Company = require("./company.model")(sequelize, db.Sequelize);
db.Department = require("./department.model")(sequelize, db.Sequelize);
db.Employee = require("./employee.model")(sequelize, db.Sequelize);
db.Attendance = require("./attendance.model")(sequelize, db.Sequelize);
db.LeaveRequest = require("./leave_request.model")(sequelize, db.Sequelize);
db.AdvanceSalary = require("./advance_salary.model")(sequelize, db.Sequelize);
db.Holiday = require("./holiday.model")(sequelize, db.Sequelize);
db.BankDetail = require("./bank_detail.model")(sequelize, db.Sequelize);
db.SalaryStructure = require("./salary_structure.model")(sequelize, db.Sequelize);

// ==========================================
// Define Associations
// ==========================================

// 1. Company Associations
db.Company.hasMany(db.Department, { foreignKey: "company_id" });
db.Department.belongsTo(db.Company, { foreignKey: "company_id" });

db.Company.hasMany(db.Employee, { foreignKey: "company_id" });
db.Employee.belongsTo(db.Company, { foreignKey: "company_id" });

db.Company.hasMany(db.Holiday, { foreignKey: "company_id" });
db.Holiday.belongsTo(db.Company, { foreignKey: "company_id" });

// 2. Department Associations
db.Department.hasMany(db.Employee, { foreignKey: "department_id" });
db.Employee.belongsTo(db.Department, { foreignKey: "department_id" });

// Department Head (One-to-One mostly, but loosely defined as FK on Dept)
db.Employee.hasOne(db.Department, { foreignKey: "department_head_id", as: "HeadOfDepartment" });
db.Department.belongsTo(db.Employee, { foreignKey: "department_head_id", as: "Head" });

// Manager Association (Employee to Employee)
db.Employee.belongsTo(db.Employee, { foreignKey: "reporting_manager_id", as: "Manager" });
db.Employee.hasMany(db.Employee, { foreignKey: "reporting_manager_id", as: "Reportees" });

// 3. Employee & User Associations
db.User.hasOne(db.Employee, { foreignKey: "user_id" });
db.Employee.belongsTo(db.User, { foreignKey: "user_id" });
db.User.belongsTo(db.Company, { foreignKey: "company_id" });

// 4. Attendance
db.Employee.hasMany(db.Attendance, { foreignKey: "employee_id" });
db.Attendance.belongsTo(db.Employee, { foreignKey: "employee_id" });

// 5. Leave Request
db.Employee.hasMany(db.LeaveRequest, { foreignKey: "employee_id" });
db.LeaveRequest.belongsTo(db.Employee, { foreignKey: "employee_id" });

// Approval/Rejection Relations for Leave
db.User.hasMany(db.LeaveRequest, { foreignKey: "approved_by", as: "ApprovedLeaves" });
db.LeaveRequest.belongsTo(db.User, { foreignKey: "approved_by", as: "Approver" });

db.User.hasMany(db.LeaveRequest, { foreignKey: "rejected_by", as: "RejectedLeaves" });
db.LeaveRequest.belongsTo(db.User, { foreignKey: "rejected_by", as: "Rejector" });

// 6. Advance Salary
db.Employee.hasMany(db.AdvanceSalary, { foreignKey: "employee_id" });
db.AdvanceSalary.belongsTo(db.Employee, { foreignKey: "employee_id" });

// Approval/Rejection Relations for Advance Salary
db.User.hasMany(db.AdvanceSalary, { foreignKey: "approved_by", as: "ApprovedAdvances" });
db.AdvanceSalary.belongsTo(db.User, { foreignKey: "approved_by", as: "Approver" });

db.User.hasMany(db.AdvanceSalary, { foreignKey: "rejected_by", as: "RejectedAdvances" });
db.AdvanceSalary.belongsTo(db.User, { foreignKey: "rejected_by", as: "Rejector" });

// 7. Audit Trails (Created/Updated By) - Optional / Can be useful
// We can add these if strictly needed for navigation, but usually just storing ID is enough.
// Adding a few key ones:
db.User.hasMany(db.Company, { foreignKey: "created_by", as: "CreatedCompanies" });
db.Company.belongsTo(db.User, { foreignKey: "created_by", as: "Creator" });

// 8. Bank Details
db.Employee.hasOne(db.BankDetail, { foreignKey: "employee_id" });
db.BankDetail.belongsTo(db.Employee, { foreignKey: "employee_id" });

// 9. Salary Structure
db.Employee.hasOne(db.SalaryStructure, { foreignKey: "employee_id" });
db.SalaryStructure.belongsTo(db.Employee, { foreignKey: "employee_id" });

module.exports = db;
