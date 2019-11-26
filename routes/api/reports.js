// NPM IMPORTS //
const express = require('express');

// VALIDATION IMPORTS //
const reportSubmissionValidation = require('../../validation/reportSubmission');

// MODEL IMPORTS //
const ReportCategory = require("../../models/ReportCategory")
const User = require("../../models/User")
const UserReport = require("../../models/UserReport")

/**
 * Express router to mount report related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/reports
 */
const router = express.Router();

/**
 * @route GET /api/reports/getCategories
 * @desc Route serving a GET request to retrieve all report category documents.
 * @returns Report Category documents. @see ReportCategory
 */
router.get('/getCategories', (req, res) => {
    ReportCategory.find({})
        .then(categories => {
            return res.status(200).json(categories)
        })
});

/**
 * @route GET /api/reports/getReport/:id
 * @desc Route serving a GET request to retrieve a report documents.
 * @returns A report document. @see UserReport
 */
router.get("/getReport/:id", (req, res) => {
    UserReport.findById(req.params.id)
        .populate("reporter")
        .populate("reported")
        .populate("reportCategory")
        .then(report => {
            if (report) {
                return res.status(200).json({
                    reportedName: report.reported.name,
                    reportedPicture: report.reported.profilepicture,
                    reporterName: report.reporter.name,
                    category: report.reportCategory.name,
                    timestamp: report.timestamp,
                    text: report.text
                })
            }
        })
})

/**
 * @route GET /api/reports/getActiveReports
 * @desc Route serving a GET request to retrieve all active user report documents.
 * @returns Report documents. @see UserReport
 */
router.get("/getActiveReports", (req, res) => {
    UserReport.find({ pending: true })
        .populate({
            path: "reporter",
            select: ["_id", "name", "profilepicture"]
        })
        .populate({
            path: "reported",
            select: ["_id", "name", "profilepicture"]
        })
        .populate("reportCategory")
        .then(reports => {
            return res.status(200).json(reports)
        })
})

/**
 * @route POST /api/reports/submitReport
 * @desc Route serving a POST request to create a report document.
 * @returns Boolean success.
 */
router.post("/submitReport", (req, res) => {
    const { errors, isValid } = reportSubmissionValidation(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({
        name: req.body.reported
    })
        .then(user => {
            if (!user) {
                return res.status(400).json({ name: 'User doesn\'t exist!.' })
            }

            const newReport = new UserReport({
                reporter: req.body.reporter,
                reported: user._id,
                reportCategory: req.body.category,
                timestamp: req.body.timestamp,
                text: req.body.text
            })

            newReport.save().then(() => {
                return res.status(200).json("Success")
            })
        })
})

/**
 * @route POST /api/reports/dismissReport
 * @desc Route serving a POST request to dismiss an active report.
 * @returns Boolean success.
 */
router.post("/dismissReport", (req, res) => {
    UserReport.findById(req.body.reportID)
        .then(report => {
            report.pending = false
            report.save().then(() => {
                return res.json(200)
            })
        })
})

// Export the router. //
module.exports = router;
