/* eslint-disable no-undef */
process.env.ENVIRONMENT = 'test';
// NPM IMPORTS //
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

// MODEL IMPORTS //
const User = require('../models/User');
const Game = require('../models/Game');

chai.use(chaiHttp);
const should = chai.should
const expect = chai.expect

describe('Games', () => {
    beforeEach((done) => { //Before each test we empty the database
        Game.deleteMany({}, (err) => {
            let game = new Game({
                name: "Super Mario 64",
                description: "Some Game",
                year: 1996,
                platform: "5dddfd081c9d44000031878b",
                coverart: "coverart.jpg"
            })
            game.save().then((game) => {
                let user = new User({
                    name: "TestUser",
                    email: "TestUser@testing.com",
                    password: "123456",
                    recoveryQuestion1ID: "5dddfc601c9d44000031877b",
                    recoveryQuestion2ID: "5dddfc891c9d44000031877f",
                    recoveryQuestion1Answer: "Some Answer",
                    recoveryQuestion2Answer: "Some Answer",
                    tags: ["tag1", "tag2"],
                    inreviewqueue: false,
                })

                user.save().then(() => {
                    done();
                })
            })
        });
    })

    describe("/GET search", () => {
        it("Should find all relevantly named games", (done) => {
            chai.request(server)
                .get('/api/games/search/super')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        })
    })

    describe('/POST Submit', () => {
        it('All fields are required', (done) => {
            chai.request(server)
                .post('/api/games/submit')
                .send({
                    name: "",
                    coverart: "",
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
                    responseData.should.have.property("name").eql("Name field is required.")
                    responseData.should.have.property("coverart").eql("Cover Art field is required.")
                    responseData.should.have.property("year").eql("Year field is required.")
                    responseData.should.have.property("platform").eql("Platform field is required.")
                    responseData.should.have.property("description").eql("Description must be at least 250 characters.")
                    done();
                });
        });


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

        it("Description must be at least 250 characters", (done) => {
            chai.request(server)
                .post('/api/games/submit')
                .send({
                    name: "",
                    coverart: "",
                    year: "",
                    platform: "",
                    // 249 chars
                    description: "dsfvbjdshfbjshdbfjhdsbfjhdsbfjhsbfjsbdffbsdjhbfjsbdfjsbdfjbsdjhfbsdjhfbfjhbdsjhfbdjhsbfjhdsbfjhdsbjhfbdsjhfbjdshbfjhdsbfjhsbdsjhfbsdjhfbsjdhbfjshdbfjhdsbfjkhbsdfkjhbsdjlhfbsdkljbfkjsdbfjlsdbfljdbsfldsblfbhsldfbldsjkbflbhjdslsfdblsbfljshbdflfbhjfbjfj",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("description").eql("Description must be at least 250 characters.")
                    done();
                });
        })

        it("Game name must not belong to an existing game", (done) => {
            chai.request(server)
                .post('/api/games/submit')
                .send({
                    name: "Super Mario 64",
                    coverart: "https://www.mobygames.com/images/covers/l/6126-super-mario-64-nintendo-64-front-cover.jpg",
                    year: "1996",
                    platform: "5dddfd081c9d44000031878b",
                    description: "dsfvbjdshfbjshdbfjhdsbfjhdsbfjhsbfjsbdffbsdjhbfjsbdfjsbdfjbsdjhfbsdjhfbfjhbdsjhfbdjhsbfjhdsbfjhdsbjhfbdsjhfbjdshbfjhdsbfjhsbdsjhfbsdjhfbsjdhbfjshdbfjhdsbfjkhbsdfkjhbsdjlhfbsdkljbfkjsdbfjlsdbfljdbsfldsblfbhsldfbldsjkbflbhjdslsfdblsbfljshbdflfbhjfbjfjty",
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("name").eql("A game with this name already exists.")
                    done();
                });
        })

        it("Successfully inserts a new game record", (done) => {
            chai.request(server)
                .post('/api/games/submit')
                .send({
                    name: "Super Not Mario 64",
                    coverart: "https://www.mobygames.com/images/covers/l/6126-super-mario-64-nintendo-64-front-cover.jpg",
                    year: "1996",
                    platform: "5dddfd081c9d44000031878b",
                    description: "dsfvbjdshfbjshdbfjhdsbfjhdsbfjhsbfjsbdffbsdjhbfjsbdfjsbdfjbsdjhfbsdjhfbfjhbdsjhfbdjhsbfjhdsbfjhdsbjhfbdsjhfbjdshbfjhdsbfjhsbdsjhfbsdjhfbsjdhbfjshdbfjhdsbfjkhbsdfkjhbsdjlhfbsdkljbfkjsdbfjlsdbfljdbsfldsblfbhsldfbldsjkbflbhjdslsfdblsbfljshbdflfbhjfbjfjty",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('string').eql("Success!");
                    done();
                });
        })
    });

    describe("/POST approveSubmission", () => {
        it("Successfully approves a game submission", (done) => {
            Game.findOne({
                name: "Super Mario 64"
            })
                .then(game => {
                    chai.request(server)
                        .post('/api/games/approveSubmission')
                        .send({
                            gameID: game._id
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object')
                            res.body.gameName.should.be.a('string').eql("Super Mario 64")

                            Game.findOne({
                                name: "Super Mario 64"
                            })
                                .then(game => {
                                    game.inreviewqueue.should.eql(false)
                                    done();
                                })
                        });
                })
        })
    })

    describe("/POST rejectSubmission", () => {
        it("Successfully rejects a game submission", (done) => {
            Game.findOne({
                name: "Super Mario 64"
            })
                .then(game => {
                    chai.request(server)
                        .post('/api/games/rejectSubmission')
                        .send({
                            gameID: game._id
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('string').eql("Success")


                            Game.findOne({
                                name: "Super Mario 64"
                            })
                                .then(game => {
                                    (!game).should.eql(true)
                                    done();
                                })
                        });
                })
        })
    })

    describe("/POST loadGamePageData", () => {
        it("Game name must exist", (done) => {
            chai.request(server)
                .post('/api/games/loadGamePageData')
                .send({
                    game: "NotARealGame"
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("message").eql("Failed to find game.")
                    done()
                });
        })

        it("Successfully loads game page data", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/loadGamePageData')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            }
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property("game")
                            res.body.should.have.property("gamePlayed")
                            res.body.should.have.property("gameInCollection")
                            res.body.should.have.property("gameInWishlist")
                            done()
                        });
                })
        })
    })

    describe("/POST toggleGamePlayed", () => {
        it("Game name must exist", (done) => {
            chai.request(server)
                .post('/api/games/toggleGamePlayed')
                .send({
                    game: "NotARealGame"
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("message").eql("Failed to find game.")
                    done()
                });
        })

        it("Successfully toggles state from played to not played", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGamePlayed')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            },
                            played: true,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(false);
                            done()
                        });
                })
        })

        it("Successfully toggles state from not played to played", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGamePlayed')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            }
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            done()
                        });
                })
        })


    })

    describe("/POST toggleGameInCollection", () => {
        it("Game name must exist", (done) => {
            chai.request(server)
                .post('/api/games/toggleGameInCollection')
                .send({
                    game: "NotARealGame"
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("message").eql("Failed to find game.")
                    done()
                });
        })

        it("Successfully toggles state from in collection to not in collection", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGameInCollection')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            },
                            inCollection: true,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(false);
                            done()
                        });
                })
        })

        it("Successfully toggles state from not in collection to in collection", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGameInCollection')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            }
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            done()
                        });
                })
        })
    })

    describe("/POST toggleGameInWishlist", () => {
        it("Game name must exist", (done) => {
            chai.request(server)
                .post('/api/games/toggleGameInWishlist')
                .send({
                    game: "NotARealGame"
                })
                .end((err, res) => {
                    let responseData = JSON.parse(err.response.error.text)
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    err.should.have.property("response")
                    err.response.should.have.property("error")
                    responseData.should.have.property("message").eql("Failed to find game.")
                    done()
                });
        })

        it("Successfully toggles state from in wishlist to not in wishlist", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGameInWishlist')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            },
                            inWishlist: true,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(false);
                            done()
                        });
                })
        })

        it("Successfully toggles state from not in wishlist to in wishlist", (done) => {
            User.findOne({
                name: "TestUser"
            })
                .then(user => {
                    chai.request(server)
                        .post('/api/games/toggleGameInWishlist')
                        .send({
                            game: "Super Mario 64",
                            user: {
                                id: user._id
                            }
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('boolean').eql(true);
                            done()
                        });
                })
        })


    })
})