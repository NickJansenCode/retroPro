const express = require('express');
const router = express.Router();
const reportSubmissionValidation = require('../../validation/reportSubmission');
const ReportCategory = require("../../models/ReportCategory")
const User = require("../../models/User")
const UserReport = require("../../models/UserReport")

router.get('/getCategories', (req, res) => {
    ReportCategory.find({})
        .then(categories => {
            return res.status(200).json(categories)
        })
});

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

router.post("/dismissReport", (req, res) => {
    UserReport.findById(req.body.reportID)
        .then(report => {
            report.pending = false
            report.save().then(() => {
                return res.json(200)
            })
        })
})

module.exports = router;
