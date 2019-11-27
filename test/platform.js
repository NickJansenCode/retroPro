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


describe('Platforms', () => {
    beforeEach((done) => { //Before each test we empty the database
        done()
    })

    describe("/GET platforms", () => {
        it("Should return all platforms", (done) => {
            chai.request(server)
                .get('/api/platforms/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })

    })


})