const db = require("../models");
const SalaryStructure = db.SalaryStructure;
const Employee = db.Employee;
const { validationResult } = require('express-validator');

// Helper to calculate components based on wage
const calculateComponents = (wage) => {
    const wageAmount = parseFloat(wage);
    const basic = wageAmount * 0.50;
    const hra = basic * 0.50; // 50% of Basic
    // Professional Tax is fixed at 200 (as per Excalidraw)
    // PF is 12% of Basic usually, but requirements said "Employee Contribution 12%, Employer 12%"
    // These are deductions/contributions, not part of the wage breakdown structure per se, 
    // but the breakdown usually sums up to the CTC/Gross.
    // Let's assume the 'Wage' input is the Gross Salary.

    // Fixed Allowance = Residual
    // Wage = Basic + HRA + Fixed Allowance
    const fixedAllowance = wageAmount - (basic + hra);

    return {
        basic_component: basic.toFixed(2),
        hra_component: hra.toFixed(2),
        fixed_allowance: fixedAllowance > 0 ? fixedAllowance.toFixed(2) : 0
    };
};

exports.upsertSalaryStructure = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            status: "error",
            message: "Validation Error",
            data: errors.array()
        });
    }

    try {
        const { employee_id } = req.params;
        const { base_wage, wage_type, working_days, break_time } = req.body;

        if (!base_wage) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Base wage is required"
            });
        }

        const components = calculateComponents(base_wage);

        // Check if structure exists
        let salaryStructure = await SalaryStructure.findOne({ where: { employee_id } });

        if (salaryStructure) {
            // Update
            salaryStructure.base_wage = base_wage;
            salaryStructure.wage_type = wage_type || "FIXED";
            salaryStructure.working_days = working_days || 5;
            salaryStructure.break_time = break_time || 60;
            salaryStructure.basic_component = components.basic_component;
            salaryStructure.hra_component = components.hra_component;
            salaryStructure.fixed_allowance = components.fixed_allowance;
            salaryStructure.updated_by = req.userId; // Assuming req.user is set by auth middleware
            await salaryStructure.save();
        } else {
            // Create
            salaryStructure = await SalaryStructure.create({
                employee_id,
                base_wage,
                wage_type: wage_type || "FIXED",
                working_days: working_days || 5,
                break_time: break_time || 60,
                ...components,
                created_by: req.userId
            });
        }

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Salary structure updated successfully",
            data: salaryStructure
        });

    } catch (error) {
        console.error("Error upserting salary structure:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
};

exports.getSalaryStructure = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const salaryStructure = await SalaryStructure.findOne({
            where: { employee_id },
            include: [{ model: Employee, attributes: ['first_name', 'last_name', 'employee_code'] }]
        });

        if (!salaryStructure) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Salary structure not found"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Salary structure retrieved successfully",
            data: salaryStructure
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
};
