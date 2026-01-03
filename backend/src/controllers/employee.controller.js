const db = require("../models");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const fs = require("fs");

exports.createEmployee = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Validation Error",
                data: errors.array()
            });
        }

        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            department_id,
            designation, // Not in model explicitly? Maybe field 'role' in User or just descriptive? 
            // Checking model: Employee has department_id, User has role.
            // Let's assume designation is not stored or just part of profile if I missed a field.
            // Requirement said "Employee Profile". Let's stick to known fields.
            join_date,
            dob,
            gender,
            marital_status,
            nationality,
            // Extended Fields
            personal_email,
            present_address,
            permanent_address,
            about,
            skills,
            hobbies,
            profile_picture,
            reporting_manager_id,
            // Bank Details
            account_number,
            bank_name,
            ifsc_code,
            pan_number,
            uan_number
        } = req.body;

        const adminUser = req.user; // From authMiddleware

        // 1. Check Email
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ statusCode: 400, status: "error", message: "Email already exists" });
        }

        // 2. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "EMPLOYEE", // Default
            company_id: adminUser.company_id || adminUser.company.id, // Handle if company is object
            is_active: true
        }, { transaction: t });

        // 3. Create Employee
        // Generate Employee Code (Simple logic)
        const empCode = "EMP" + Math.floor(10000 + Math.random() * 90000);

        const newEmployee = await db.Employee.create({
            user_id: newUser.id,
            company_id: newUser.company_id,
            department_id, // Must be provided
            employee_code: empCode,
            first_name,
            last_name,
            phone,
            join_date: join_date || new Date(),
            dob,
            gender,
            marital_status,
            nationality,
            personal_email,
            present_address,
            permanent_address,
            about,
            skills: skills ? JSON.stringify(skills) : null,
            hobbies: hobbies ? JSON.stringify(hobbies) : null,
            profile_picture,
            reporting_manager_id,
            created_by: adminUser.id
        }, { transaction: t });

        // 4. Create Bank Details
        if (account_number) {
            await db.BankDetail.create({
                employee_id: newEmployee.id,
                account_number,
                bank_name,
                ifsc_code,
                pan_number,
                uan_number,
                created_by: adminUser.id
            }, { transaction: t });
        }

        await t.commit();

        return res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "Employee created successfully",
            data: {
                user: { id: newUser.id, email: newUser.email },
                employee: newEmployee
            }
        });

    } catch (error) {
        await t.rollback();
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Create Employee Error:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
};

exports.updateEmployee = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { id } = req.params; // Employee ID
        const updates = req.body;

        const employee = await db.Employee.findOne({ where: { id } });
        if (!employee) {
            return res.status(404).json({ statusCode: 404, status: "error", message: "Employee not found" });
        }

        // Update Employee Fields
        const employeeFields = [
            'first_name', 'last_name', 'phone', 'join_date', 'dob', 'gender',
            'marital_status', 'nationality', 'department_id',
            'personal_email', 'present_address', 'permanent_address', 'about',
            'skills', 'hobbies', 'profile_picture', 'reporting_manager_id'
        ];

        employeeFields.forEach(field => {
            if (updates[field] !== undefined) {
                if (field === 'skills' || field === 'hobbies') {
                    employee[field] = JSON.stringify(updates[field]);
                } else {
                    employee[field] = updates[field];
                }
            }
        });
        employee.updated_by = req.user.id;
        await employee.save({ transaction: t });

        // Update User Fields if needed (e.g. name change)
        if (updates.first_name || updates.last_name) {
            await db.User.update({
                first_name: updates.first_name || employee.first_name,
                last_name: updates.last_name || employee.last_name
            }, { where: { id: employee.user_id }, transaction: t });
        }

        // Update Bank Details
        // Check if exists
        let bankDetails = await db.BankDetail.findOne({ where: { employee_id: id } });
        if (updates.account_number || updates.bank_name) { // If bank details provided
            if (bankDetails) {
                // Update
                const bankFields = ['account_number', 'bank_name', 'ifsc_code', 'pan_number', 'uan_number'];
                bankFields.forEach(field => {
                    if (updates[field] !== undefined) bankDetails[field] = updates[field];
                });
                bankDetails.updated_by = req.user.id;
                await bankDetails.save({ transaction: t });
            } else {
                // Create
                await db.BankDetail.create({
                    employee_id: id,
                    account_number: updates.account_number,
                    bank_name: updates.bank_name,
                    ifsc_code: updates.ifsc_code,
                    pan_number: updates.pan_number,
                    uan_number: updates.uan_number,
                    created_by: req.user.id
                }, { transaction: t });
            }
        }

        await t.commit();

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Employee updated successfully"
        });

    } catch (error) {
        await t.rollback();
        console.error("Update Employee Error:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await db.Employee.findAll({
            include: [
                {
                    model: db.User,
                    attributes: ['email', 'role', 'is_active']
                },
                {
                    model: db.Department,
                    attributes: ['name']
                },
                {
                    model: db.Attendance,
                    required: false, // Left Join
                    where: {
                        date: new Date().toISOString().split('T')[0] // Only today's attendance
                    },
                    attributes: ['status', 'check_in', 'check_out']
                },
                {
                    model: db.Employee,
                    as: 'Manager',
                    attributes: ['first_name', 'last_name']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        // Format response
        const formattedEmployees = employees.map(emp => {
            // Determine status dot color logic
            // If attendance record exists -> PRESENT (Green), else ABSENT (Red)
            // Or use the status field directly. 
            const attendance = emp.attendances && emp.attendances.length > 0 ? emp.attendances[0] : null;
            const status = attendance ? attendance.status : 'ABSENT';

            return {
                id: emp.id,
                employee_code: emp.employee_code,
                name: `${emp.first_name} ${emp.last_name}`,
                email: emp.user ? emp.user.email : '',
                department: emp.department ? emp.department.name : '',
                manager: emp.Manager ? `${emp.Manager.first_name} ${emp.Manager.last_name}` : 'N/A',
                phone: emp.phone,
                profile_picture: emp.profile_picture,
                status: status, // PRESENT | ABSENT
                check_in: attendance ? attendance.check_in : null,
                check_out: attendance ? attendance.check_out : null,
            };
        });

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Employees retrieved successfully",
            data: formattedEmployees
        });

    } catch (error) {
        console.error("Get All Employees Error:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
};
