/* eslint-disable no-undef */
// NPM IMPORTS //
const mongoose = require("mongoose")
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

// MODEL IMPORTS //
const User = require('../models/User');
const Role = require("../models/Role")
const List = require("../models/List");
// eslint-disable-next-line no-unused-vars
const Game = require('../models/Game');
// eslint-disable-next-line no-unused-vars
const ProfileComment = require("../models/ProfileComment")
const PasswordRecovery = require('../models/PasswordRecovery');
const GameComment = require("../models/GameComment")
const Review = require("../models/Review")
const UserReport = require("../models/UserReport")
const Friendship = require("../models/Friendship")


// During the test the env variable is set to test. //
process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
const should = chai.should()
const expect = chai.expect()

describe('Users', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     // Book.remove({}, (err) => {
    //     //     done();
    //     // });
})


describe('/POST Register', () => {
    it('Email address must be a valid email address', (done) => {
        chai.request(server)
            .post('/api/users/register')
            .send({
                name: "",
                email: "invalidemailformat",
                password: "",
                password2: "",
                recoveryQuestion1ID: "",
                recoveryQuestion2ID: "",
                recoveryQuestion1Answer: "",
                recoveryQuestion2Answer: "",
            })
            .end((err, res) => {
                let responseData = JSON.parse(err.response.error.text)
                res.should.have.status(400);
                res.body.should.be.a('object');
                err.should.have.property("response")
                err.response.should.have.property("error")
                responseData.should.have.property("email").eql("Email format is invalid.")
                done();
            });
    });

    it('Password must be at least 6 characters', (done) => {
        chai.request(server)
            .post('/api/users/register')
            .send({
                name: "",
                email: "",
                password: "12345",
                password2: "",
                recoveryQuestion1ID: "",
                recoveryQuestion2ID: "",
                recoveryQuestion1Answer: "",
                recoveryQuestion2Answer: "",
            })
            .end((err, res) => {
                let responseData = JSON.parse(err.response.error.text)
                res.should.have.status(400);
                res.body.should.be.a('object');
                err.should.have.property("response")
                err.response.should.have.property("error")
                responseData.should.have.property("password").eql("Password must be at least 6 characters.")
                done();
            });
    });

    it('Passwords must match', (done) => {
        chai.request(server)
            .post('/api/users/register')
            .send({
                name: "",
                email: "",
                password: "123456",
                password2: "1234567",
                recoveryQuestion1ID: "",
                recoveryQuestion2ID: "",
                recoveryQuestion1Answer: "",
                recoveryQuestion2Answer: "",
            })
            .end((err, res) => {
                let responseData = JSON.parse(err.response.error.text)
                res.should.have.status(400);
                res.body.should.be.a('object');
                err.should.have.property("response")
                err.response.should.have.property("error")
                responseData.should.have.property("password2").eql("Passwords must match.")
                done();
            });
    });
});