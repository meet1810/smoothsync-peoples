const db = require("../models");
const Attendance = db.Attendance;
const Employee = db.Employee;
const moment = require("moment"); // Ensure moment is available or use native Date

exports.checkIn = async (req, res) => {
    try {
        const userId = req.userId; // from auth middleware
        // Find employee associated with user
        const employee = await Employee.findOne({ where: { user_id: userId } });
        if (!employee) {
            return res.status(404).json({ statusCode: 404, status: "error", message: "Employee profile not found" });
        }

        const today = new Date().toISOString().split('T')[0];

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({
            where: {
                employee_id: employee.id,
                date: today
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ statusCode: 400, status: "error", message: "Already checked in for today" });
        }

        const attendance = await Attendance.create({
            employee_id: employee.id,
            date: today,
            check_in: new Date().toLocaleTimeString('en-GB') // HH:MM:SS format
        });

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Checked in successfully",
            data: attendance
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

exports.checkOut = async (req, res) => {
    try {
        const userId = req.userId;
        const employee = await Employee.findOne({ where: { user_id: userId } });

        if (!employee) {
            return res.status(404).json({ statusCode: 404, status: "error", message: "Employee profile not found" });
        }

        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({
            where: {
                employee_id: employee.id,
                date: today
            }
        });

        if (!attendance) {
            return res.status(400).json({ statusCode: 400, status: "error", message: "No check-in record found for today" });
        }

        if (attendance.check_out) {
            return res.status(400).json({ statusCode: 400, status: "error", message: "Already checked out" });
        }

        attendance.check_out = new Date().toLocaleTimeString('en-GB');
        // Determine status based on hours worked? For now, we update check_out.
        // We can also set status to PRESENT if a check-out happens.
        attendance.status = "PRESENT";

        await attendance.save();

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Checked out successfully",
            data: attendance
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

exports.getAttendance = async (req, res) => {
    try {
        const userId = req.userId;
        const employee = await Employee.findOne({ where: { user_id: userId } });
        if (!employee) {
            return res.status(404).json({ statusCode: 404, status: "error", message: "Employee profile not found" });
        }

        const today = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({
            where: {
                employee_id: employee.id,
                date: today
            }
        });

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Attendance status retrieved",
            data: attendance || { status: 'ABSENT', message: 'Not checked in' }
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal Server Error",
            data: error.message
        });
    }
}
