'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Follwe = mongoose.model('Follwe'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  follwe;

/**
 * Follwe routes tests
 */
describe('Follwe CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Follwe
    user.save(function () {
      follwe = {
        name: 'Follwe name'
      };

      done();
    });
  });

  it('should be able to save a Follwe if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Follwe
        agent.post('/api/follwes')
          .send(follwe)
          .expect(200)
          .end(function (follweSaveErr, follweSaveRes) {
            // Handle Follwe save error
            if (follweSaveErr) {
              return done(follweSaveErr);
            }

            // Get a list of Follwes
            agent.get('/api/follwes')
              .end(function (follwesGetErr, follwesGetRes) {
                // Handle Follwes save error
                if (follwesGetErr) {
                  return done(follwesGetErr);
                }

                // Get Follwes list
                var follwes = follwesGetRes.body;

                // Set assertions
                (follwes[0].user._id).should.equal(userId);
                (follwes[0].name).should.match('Follwe name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Follwe if not logged in', function (done) {
    agent.post('/api/follwes')
      .send(follwe)
      .expect(403)
      .end(function (follweSaveErr, follweSaveRes) {
        // Call the assertion callback
        done(follweSaveErr);
      });
  });

  it('should not be able to save an Follwe if no name is provided', function (done) {
    // Invalidate name field
    follwe.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Follwe
        agent.post('/api/follwes')
          .send(follwe)
          .expect(400)
          .end(function (follweSaveErr, follweSaveRes) {
            // Set message assertion
            (follweSaveRes.body.message).should.match('Please fill Follwe name');

            // Handle Follwe save error
            done(follweSaveErr);
          });
      });
  });

  it('should be able to update an Follwe if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Follwe
        agent.post('/api/follwes')
          .send(follwe)
          .expect(200)
          .end(function (follweSaveErr, follweSaveRes) {
            // Handle Follwe save error
            if (follweSaveErr) {
              return done(follweSaveErr);
            }

            // Update Follwe name
            follwe.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Follwe
            agent.put('/api/follwes/' + follweSaveRes.body._id)
              .send(follwe)
              .expect(200)
              .end(function (follweUpdateErr, follweUpdateRes) {
                // Handle Follwe update error
                if (follweUpdateErr) {
                  return done(follweUpdateErr);
                }

                // Set assertions
                (follweUpdateRes.body._id).should.equal(follweSaveRes.body._id);
                (follweUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Follwes if not signed in', function (done) {
    // Create new Follwe model instance
    var follweObj = new Follwe(follwe);

    // Save the follwe
    follweObj.save(function () {
      // Request Follwes
      request(app).get('/api/follwes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Follwe if not signed in', function (done) {
    // Create new Follwe model instance
    var follweObj = new Follwe(follwe);

    // Save the Follwe
    follweObj.save(function () {
      request(app).get('/api/follwes/' + follweObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', follwe.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Follwe with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/follwes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Follwe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Follwe which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Follwe
    request(app).get('/api/follwes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Follwe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Follwe if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Follwe
        agent.post('/api/follwes')
          .send(follwe)
          .expect(200)
          .end(function (follweSaveErr, follweSaveRes) {
            // Handle Follwe save error
            if (follweSaveErr) {
              return done(follweSaveErr);
            }

            // Delete an existing Follwe
            agent.delete('/api/follwes/' + follweSaveRes.body._id)
              .send(follwe)
              .expect(200)
              .end(function (follweDeleteErr, follweDeleteRes) {
                // Handle follwe error error
                if (follweDeleteErr) {
                  return done(follweDeleteErr);
                }

                // Set assertions
                (follweDeleteRes.body._id).should.equal(follweSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Follwe if not signed in', function (done) {
    // Set Follwe user
    follwe.user = user;

    // Create new Follwe model instance
    var follweObj = new Follwe(follwe);

    // Save the Follwe
    follweObj.save(function () {
      // Try deleting Follwe
      request(app).delete('/api/follwes/' + follweObj._id)
        .expect(403)
        .end(function (follweDeleteErr, follweDeleteRes) {
          // Set message assertion
          (follweDeleteRes.body.message).should.match('User is not authorized');

          // Handle Follwe error error
          done(follweDeleteErr);
        });

    });
  });

  it('should be able to get a single Follwe that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Follwe
          agent.post('/api/follwes')
            .send(follwe)
            .expect(200)
            .end(function (follweSaveErr, follweSaveRes) {
              // Handle Follwe save error
              if (follweSaveErr) {
                return done(follweSaveErr);
              }

              // Set assertions on new Follwe
              (follweSaveRes.body.name).should.equal(follwe.name);
              should.exist(follweSaveRes.body.user);
              should.equal(follweSaveRes.body.user._id, orphanId);

              // force the Follwe to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Follwe
                    agent.get('/api/follwes/' + follweSaveRes.body._id)
                      .expect(200)
                      .end(function (follweInfoErr, follweInfoRes) {
                        // Handle Follwe error
                        if (follweInfoErr) {
                          return done(follweInfoErr);
                        }

                        // Set assertions
                        (follweInfoRes.body._id).should.equal(follweSaveRes.body._id);
                        (follweInfoRes.body.name).should.equal(follwe.name);
                        should.equal(follweInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Follwe.remove().exec(done);
    });
  });
});
