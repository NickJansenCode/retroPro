/* eslint-disable no-undef */
process.env.ENVIRONMENT = 'test';
// NPM IMPORTS //
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

// MODEL IMPORTS //
const User = require('../models/User');
const UserReport = require("../models/UserReport")
const PasswordRecovery = require('../models/PasswordRecovery');

chai.use(chaiHttp);
const should = chai.should
const expect = chai.expect

describe('Reports', () => {
    beforeEach((done) => { //Before each test we empty the database
        UserReport.deleteMany({}, (err) => {
            PasswordRecovery.deleteMany({}, (err) => {
                User.deleteMany({}, (err) => {
                    let user = new User({
                        name: "TestUser",
                        email: "TestUser@testing.com",
                        password: "123456",
                        recoveryQuestion1ID: "5dddfc601c9d44000031877b",
                        recoveryQuestion2ID: "5dddfc891c9d44000031877f",
                        recoveryQuestion1Answer: "Some Answer",
                        recoveryQuestion2Answer: "Some Answer",
                        tags: ["tag1", "tag2"]
                    })

                    user.save().then((userOne) => {

                        let user = new User({
                            name: "TestUser2",
                            email: "TestUser2@testing.com",
                            password: "123456",
                            recoveryQuestion1ID: "5dddfc601c9d44000031877b",
                            recoveryQuestion2ID: "5dddfc891c9d44000031877f",
                            recoveryQuestion1Answer: "Some Answer",
                            recoveryQuestion2Answer: "Some Answer",
                        })

                        user.save().then((userTwo) => {

                            let report = new UserReport({
                                reporter: userOne._id,
                                reported: userTwo._id,
                                reportCategory: "5dddfcd31c9d440000318785",
                                timestamp: new Date(),
                                text: "Rude Guy :(",
                            })

                            report.save().then(() => {
                                done();
                            })
                        })
                    })
                });
            })
        })
    })

    describe("/GET getCategories", () => {
        it("Successfully returns all existing report categories", (done) => {
            chai.request(server)
                .get('/api/reports/getCategories')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })
    })

    describe("/GET getReport", () => {
        it("Successfully returns the desired report details", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    UserReport.findOne({
                        reporter: user._id
                    })
                        .then(report => {
                            chai.request(server)
                                .get('/api/reports/getReport/' + report._id)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('object');
                                    done();
                                });
                        })
                })
        })
    })

    describe("/GET getActiveReports", () => {
        it("Successfully returns all active reports", (done) => {
            chai.request(server)
                .get('/api/reports/getActiveReports/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })
    })

    describe("/POST submitReport", () => {
        it("All fields are required", (done) => {
            chai.request(server)
                .post('/api/reports/submitReport')
                .send({
                    reported: "",
                    category: "",
                    text: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("name").eql("Name field is required.")
                    responseData.should.have.property("category").eql("Category field is required.")
                    responseData.should.have.property("text").eql("Report text field is required.")

                    done();
                });
        })

        it("User being reported must exist", (done) => {
            chai.request(server)
                .post('/api/reports/submitReport')
                .send({
                    reported: "notarealuser",
                    category: "somecategory",
                    text: "sometext",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("name").eql("User doesn't exist!.")

                    done();
                });
        })

        it("Successfully creates a user report", (done) => {
            User.find({})
                .then(users => {
                    chai.request(server)
                        .post('/api/reports/submitReport')
                        .send({
                            reporter: users[0]._id,
                            reported: "TestUser2",
                            category: "5dddfcd31c9d440000318785",
                            text: "Big Jerk",
                            timestamp: new Date()
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('string').eql("Success");
                            done();
                        });
                })
        })
    })

    describe("/POST dismissReport", () => {
        it("Successfully finds and dismisses an active user report", (done) => {
            UserReport.findOne({})
                .then(report => {
                    chai.request(server)
                        .post('/api/reports/dismissReport')
                        .send({
                            reportID: report._id
                        })
                        .end((err, res) => {
                            res.should.have.status(200);

                            UserReport.findOne({
                                _id: report._id
                            })
                                .then(report => {
                                    report.pending.should.eql(false)
                                    done();
                                })
                        });
                })
        })
    })



})