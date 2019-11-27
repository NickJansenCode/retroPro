/* eslint-disable no-undef */
process.env.ENVIRONMENT = 'test';
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

chai.use(chaiHttp);
const should = chai.should()
const expect = chai.expect()

describe('Games', () => {
    beforeEach((done) => { //Before each test we empty the database
        Game.deleteMany({}, (err) => {
            done();
        });
    })


    describe('/POST Submit', () => {
        it('Cover Art must be an image URL', (done) => {
            chai.request(server)
                .post('/api/games/submit')
                .send({
                    name: "",
                    coverart: "notanimageurl",
                    year: "",
                    platform: "",
                    description: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("coverart").eql("Cover Art field must be an image URL.")
                    done();
                });
        });
    });
})