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
const RecoveryQuestion = require("../models/RecoveryQuestion")
const GameComment = require("../models/GameComment")
const Review = require("../models/Review")
const UserReport = require("../models/UserReport")
const Friendship = require("../models/Friendship")


chai.use(chaiHttp);
const should = chai.should()
const expect = chai.expect

describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
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

                user.save().then(() => {
                    done();
                })

            });
        })
    })


    describe('/POST Register', () => {

        it('All fields are required', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    name: "",
                    email: "",
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

                    responseData.should.have.property("name").eql("Name field is required.")
                    responseData.should.have.property("email").eql("Email field is required.")
                    responseData.should.have.property("password").eql("Password must be at least 6 characters.")
                    responseData.should.have.property("password2").eql("Password confirmation field is required.")
                    responseData.should.have.property("recoveryQuestion1ID").eql("Password recovery question is required.")
                    responseData.should.have.property("recoveryQuestion2ID").eql("Password recovery question is required.")
                    responseData.should.have.property("recoveryQuestion1Answer").eql("Answer is required.")
                    responseData.should.have.property("recoveryQuestion2Answer").eql("Answer is required.")
                    done();
                });
        })

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

        it('Recovery questions must not match', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    name: "",
                    email: "",
                    password: "",
                    password2: "",
                    recoveryQuestion1ID: "1234",
                    recoveryQuestion2ID: "1234",
                    recoveryQuestion1Answer: "",
                    recoveryQuestion2Answer: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("recoveryQuestion2ID").eql("Recovery questions must not match.")
                    done();
                });
        })

        it('Doesn\'t allow you to register a user who\'s name already exists', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    name: "TestUser",
                    email: "uniqueemail@email.com",
                    password: "123456",
                    password2: "123456",
                    recoveryQuestion1ID: "someid",
                    recoveryQuestion2ID: "someid2",
                    recoveryQuestion1Answer: "Some Answer",
                    recoveryQuestion2Answer: "Some Answer",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("name").eql("Name already exists.")

                    done();
                });
        })

        it('Doesn\'t allow you to register a user who\'s email already exists', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    name: "UniqueName",
                    email: "TestUser@testing.com",
                    password: "123456",
                    password2: "123456",
                    recoveryQuestion1ID: "someid",
                    recoveryQuestion2ID: "someid2",
                    recoveryQuestion1Answer: "Some Answer",
                    recoveryQuestion2Answer: "Some Answer",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("email").eql("Email already exists.")

                    done();
                });
        })

        it('Successfully creates User account on proper input', (done) => {
            chai.request(server)
                .post('/api/users/register')
                .send({
                    name: "UniqueName",
                    email: "uniqueemail@email.com",
                    password: "123456",
                    password2: "123456",
                    recoveryQuestion1ID: "5dddfc601c9d44000031877b",
                    recoveryQuestion2ID: "5dddfc891c9d44000031877f",
                    recoveryQuestion1Answer: "Some Answer",
                    recoveryQuestion2Answer: "Some Answer",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    User.findOne({
                        name: "UniqueName"
                    })
                        .then(user => {
                            user.should.be.a('object')
                            user.should.have.property("id")
                            done();
                        })


                });
        })
    })

    describe('/POST updatePassword', () => {
        it('Email address must belong to an existing user', (done) => {
            chai.request(server)
                .post('/api/users/updatePassword')
                .send({
                    email: "NotTestUser@testing.com",
                    password: "newpassword",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('string');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.eql("User not found.")
                    done();
                });
        })

        it("Successfully updates the user's password on proper input", (done) => {
            User.findOne({
                email: "TestUser@testing.com",
            })
                .then(({ password }) => {
                    let originalPassword = password
                    chai.request(server)
                        .post('/api/users/updatePassword')
                        .send({
                            email: "TestUser@testing.com",
                            password: "newpassword",
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('string');

                            User.findOne({
                                name: "TestUser"
                            })
                                .then(user => {
                                    user.should.be.a('object')
                                    user.should.have.property("id")
                                    expect(user.password).to.not.equal(originalPassword)
                                    done();
                                })
                        });
                })
        })
    })

    describe("/POST updateUser", () => {
        it('Successfully updates the user\'s profile settings', (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(originalUser => {
                    chai.request(server)
                        .post('/api/users/updateUser')
                        .send({
                            userId: originalUser._id,
                            profilePictureURL: "somenewprofilepicture.jpg",
                            about: "New About Section",
                            headerImageURL: "newheaderpicture.jpg"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            User.findOne({
                                email: res.res.body.user.email
                            })
                                .then(newUser => {
                                    newUser.should.be.a("object")
                                    newUser.should.have.property("id")
                                    expect(newUser.about).to.not.equal(originalUser.about)
                                    expect(newUser.profilepicture).to.not.equal(originalUser.profilepicture)
                                    done();
                                })


                        });
                })

        })
    })

    describe("/POST saveSettings", () => {

        it("Successfully updates the user\'s privacy setting", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(originalUser => {
                    chai.request(server)
                        .post('/api/users/saveSettings')
                        .send({
                            userID: originalUser._id,
                            privateAccount: true
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            User.findOne({
                                email: "TestUser@testing.com"
                            })
                                .then(newUser => {
                                    newUser.should.be.a("object")
                                    newUser.should.have.property("id")
                                    expect(newUser.private).to.not.equal(originalUser.private)
                                    done();
                                })


                        });
                })
        })
    });

    describe("/POST addTag", () => {
        it("Successfully adds the tag", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(originalUser => {
                    chai.request(server)
                        .post('/api/users/addTag')
                        .send({
                            userID: originalUser._id,
                            tag: "somenewtag"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            User.findOne({
                                email: "TestUser@testing.com"
                            })
                                .then(newUser => {
                                    newUser.should.be.a("object")
                                    newUser.should.have.property("id")
                                    expect(newUser.tags).to.not.equal(originalUser.tags)
                                    done();
                                })


                        });
                })
        })
    })

    describe("/POST removeTag", () => {
        it("Successfully removes the tag", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(originalUser => {
                    chai.request(server)
                        .post('/api/users/addTag')
                        .send({
                            userID: originalUser._id,
                            tag: "tag1"
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            User.findOne({
                                email: "TestUser@testing.com"
                            })
                                .then(newUser => {
                                    newUser.should.be.a("object")
                                    newUser.should.have.property("id")
                                    expect(newUser.tags).to.not.equal(originalUser.tags)
                                    done();
                                })


                        });
                })
        })
    })

    describe("/POST getByName", () => {
        it("Name must belong to a user", (done) => {
            chai.request(server)
                .post('/api/users/getByName')
                .send({
                    name: "notarealuserf"
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.message.should.eql("Failed to find user.")
                    done()

                });
        })

        it("Successfully returns user information", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/users/getByName')
                        .send({
                            name: "TestUser",
                            authID: user._id
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done()

                        });
                })

        })
    })

    describe("/POST promoteUser", (done) => {
        it("Name field is required", (done) => {
            chai.request(server)
                .post('/api/users/promoteUser')
                .send({
                    name: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("promoteName").eql("User name field is required.")
                    done();
                });
        })

        it("Name must belong to a user", (done) => {
            chai.request(server)
                .post('/api/users/promoteUser')
                .send({
                    name: "notarealuser",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("promoteName").eql("User with name notarealuser does not exist")
                    done();
                });
        })

        it("Successfully updates the user's admin status", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(originalUser => {
                    chai.request(server)
                        .post('/api/users/promoteUser')
                        .send({
                            name: originalUser.name,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('string').eql("Success");

                            User.findOne({
                                email: originalUser.email
                            })
                                .then(newUser => {
                                    expect(newUser.role).to.not.equal(originalUser.role)
                                    done();
                                })
                        });
                })
        })
    })

    describe("/POST banUser", () => {
        it("Name field is required", (done) => {
            chai.request(server)
                .post('/api/users/banUser')
                .send({
                    name: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("banRemoveName").eql("User name field is required.")
                    done();
                });
        })

        it("Name must belong to a user", (done) => {
            chai.request(server)
                .post('/api/users/banUser')
                .send({
                    name: "notarealuser",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("banRemoveName").eql("User with name notarealuser does not exist")
                    done();
                });
        })

        it("User must not already be banned", (done) => {
            User.findOne({
                email: "TestUser@testing.com"
            })
                .then(user => {
                    user.isbanned = true
                    user.save()
                        .then(bannedUser => {
                            chai.request(server)
                                .post('/api/users/banUser')
                                .send({
                                    name: bannedUser.name,
                                })
                                .end((err, res) => {
                                    let responseData = JSON.parse(err.response.error.text)
                                    res.should.have.status(400);
                                    res.body.should.be.a('object');
                                    err.should.have.property("response")
                                    err.response.should.have.property("error")
                                    responseData.should.have.property("banRemoveName").eql("User with name TestUser is already banned")
                                    done();
                                });
                        })
                })
        })

        it("Successfully bans a user", (done) => {
            chai.request(server)
                .post('/api/users/banUser')
                .send({
                    name: "TestUser",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').eql("Success");
                    User.findOne({
                        email: "TestUser@testing.com"
                    })
                        .then(user => {
                            expect(user.isbanned).to.equal(true)
                        })
                    done();
                });
        })
    })

    describe("/POST deleteUser", () => {
        it("Name field is required", (done) => {
            chai.request(server)
                .post('/api/users/deleteUser')
                .send({
                    name: "",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")

                    responseData.should.have.property("banRemoveName").eql("User name field is required.")
                    done();
                });
        })

        it("Name must belong to a user", (done) => {
            chai.request(server)
                .post('/api/users/deleteUser')
                .send({
                    name: "notarealuser",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("banRemoveName").eql("User with name notarealuser does not exist")
                    done();
                });
        })

        it("Successfully deletes a user", (done) => {
            chai.request(server)
                .post('/api/users/deleteUser')
                .send({
                    name: "TestUser",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').eql("Success");
                    User.findOne({
                        email: "TestUser@testing.com"
                    })
                        .then(user => {
                            expect(!user).to.equal(true)
                        })
                    done();
                });
        })
    })
})



