// load dotenv library
require('dotenv').load();

var frisby = require('frisby'),
    config = require('../../server/config/config'),
    jwt    = require('jsonwebtoken'),

    // Load Chance
    Chance = require('chance'),

    // Instantiate Chance so it can be used
    chance = new Chance();

describe('Document Management System : User Route', function() {
// POST /api/users `should create a new user instance`
  var user = {
    username : 'naddacvek',
    name : {
      first : 'Essie',
      last  : 'Foster'
    },
    email    : 'ufezen@ragok.com',
    password : 'U)bo5uwgSp'
  };

  frisby.create('POST /api/users `should create a new user instance`')
    .post('http://localhost:3000/api/users', user)
    .expectJSONTypes('response', {
       username : String,
       name : {
        first : String,
        last  : String
      },
       email    : String,
       password : String
     })
    .expectJSON({
      "statusCode" : 201,
      "status" : "Created",
      "statusMessage" : "user save successful"
    })
    .toss()
// END

// POST /api/users/login `should log a user in`
  frisby.create('POST /api/users/login `should log a user in`')
    .post('http://localhost:3000/api/users/login', {
      username : 'naddacvek',
      password : 'U)bo5uwgSp'
    })
    .expectStatus(200)
    .expectJSON({
      "status" : "OK",
      "statusMessage" : "login successful",
      response: {
        user : {
          username : 'naddacvek',
          name : {
            first : 'Essie',
            last  : 'Foster'
          },
          email   : 'ufezen@ragok.com'
        }
      }
    })
    .toss()
// END

// POST /api/users/logout `should log a user out`
  frisby.create('POST /api/users/logout `should log a user out`')
    .post('http://localhost:3000/api/users/login', {
      username : 'naddacvek',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('POST`')
        .post('http://localhost:3000/api/users/logout', {
          username : 'naddacvek',
          password : 'U)bo5uwgSp'
        })
        .addHeader('x-access-token', token)
        .expectJSON({
          "status" : "OK",
          "statusCode" : 200,
          "statusMessage" : "logout successful",
        })
        .toss()
    })
    .toss()
// END

// GET /api/users `should find all users`
  var user2 = {
    username : 'narutosama',
    name : {
      first : 'Narutokun',
      last  : 'Uzumaki'
    },
    email    : 'narutokun@ragok.com',
    password : '90732FHFG3'
  };

  frisby.create('GET /api/users `should find all users`')
    .post('http://localhost:3000/api/users', {
      username : chance.word({syllables: 3}),
      name : {
        first : chance.first(),
        last  : chance.last()
      },
      email    : chance.email(),
      password : chance.string({length: 10})
    })
    .expectStatus(200)
    .toss()
  frisby.create('POST')
    .post('http://localhost:3000/api/users', user2)
    .toss()
  frisby.create('POST')
    .post('http://localhost:3000/api/users/login', {
      username : 'naddacvek',
      password : 'U)bo5uwgSp'
    })
    .afterJSON(function(json){
      var token = json.response.token;

      frisby.create('GET')
       .get('http://localhost:3000/api/users')
       .addHeader('x-access-token', token)
       .expectJSON({
         "statusCode" : 200,
         "status" : 'OK'
       })
      .toss()
    })
    .toss()
// END 
 
// GET /users/<id> `should find a user`
  frisby.create('POST')
    .post('http://localhost:3000/api/users', {
      username : chance.word({syllables: 3}),
      name : {
        first : chance.first(),
        last  : chance.last()
      },
      email    : chance.email(),
      password : chance.string({length: 10})
    })
    .expectStatus(200)
    .toss()
  frisby.create('POST')
    .post('http://localhost:3000/api/users/login', {
      username : 'narutosama',
      password : '90732FHFG3'
    })
    .afterJSON(function(json){
      var token = json.response.token;

      frisby.create('GET /api/users `should find a users`')
         .get('http://localhost:3000/api/users')
         .addHeader('x-access-token', token)
         .expectJSON({
           "statusCode" : 200,
           "status" : 'OK'
         })
         .afterJSON(function(json){
           frisby.create('GET')
              .get('http://localhost:3000/api/users/' + json.response[0]._id)
              .addHeader('x-access-token', token)
              .expectStatus(200)
              .expectJSON({
                "status" : "OK",
                "statusCode" : 200
              })
              .expectJSONTypes({
                response: {
                  username : String,
                  name : {
                    first : String,
                    last  : String
                  },
                  email   : String
                }
              })
            .toss()
         })
      .toss()
    })
    .toss()
// END

// PUT /users/<id> `should update user attributes`
  frisby.create('PUT /users/<id> `should update user attributes`')
    .post('http://localhost:3000/api/users/login', {
      username : 'narutosama',
      password : '90732FHFG3'
    })
    .afterJSON(function(json){
      var token = json.response.token;

      frisby.create('GET')
         .get('http://localhost:3000/api/users')
         .addHeader('x-access-token', token)
         .expectJSON({
           "statusCode" : 200,
           "status" : 'OK'
         })
         .afterJSON(function(json){
           frisby.create('PUT')
              .put('http://localhost:3000/api/users/' + json.response[1]._id, {
                username : chance.word({syllables: 3}),
                name : {
                  first : chance.first(),
                  last  : chance.last()
                },
                email   : chance.email()
              })
              .addHeader('x-access-token', token)
              .expectJSON({
                "status" : "OK",
                "statusCode" : 200,
                "statusMessage" : "user update successful",
                response: {
                  "ok": 1,
                  "nModified": 1,
                  "n": 1
                }
              })
              .toss()
         })
      .toss()
    })
    .toss()
// END

// DELETE /users/<id> `should delete user`
  frisby.create('DELETE /users/<id> `should delete user`')
    .post('http://localhost:3000/api/users/login', {
      username : 'narutosama',
      password : '90732FHFG3'
    })
    .afterJSON(function(json) {
      var token = json.response.token;

      frisby.create('GET')
         .get('http://localhost:3000/api/users')
         .addHeader('x-access-token', token)
         .expectJSON({
           "statusCode" : 200,
           "status" : 'OK'
         })
         .afterJSON(function(json){
           frisby.create('DELETE')
              .delete('http://localhost:3000/api/users/' + json.response[2]._id)
              .addHeader('x-access-token', token)
              .expectJSON({
                "status" : "OK",
                "statusCode" : 200,
                "statusMessage" : "user delete successful",
                response: {
                 "ok": 1,
                 "n": 1
                }
              })
              .toss()
         })
      .toss()
    })
  .toss()
// END
});