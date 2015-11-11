// // load dotenv library
// require('dotenv').load();

// var jwt    = require('jsonwebtoken'),
//     config = require('../../server/config/config'),
//     frisby = require('frisby'),

//     // Load Chance
//     Chance = require('chance'),

//     // Instantiate Chance so it can be used
//     chance = new Chance();

// describe('Document Management System : Document Route', function() {  
// // POST /documents/ `should create a new document instance`
//   var user = {
//     username : 'kayak',
//     name : {
//       first : 'Kaneki',
//       last  : 'Kun'
//     },
//     email    : 'kaneki@kun.com',
//     password : '83jgjfgJGwe'
//   };

//   UserID = user.id;
//   token = jwt.sign(user, config.secret);

//   frisby.create('POST')
//     .post('http://localhost:3000/api/users', user)
//     .expectStatus(200)
//     .toss()

//   frisby.create('POST /api/documents `should create a new user instance`')
//     .post('http://localhost:3000/api/documents', {
//       _ownerId: UserID,
//       title: chance.sentence({words: 5}),
//       content: chance.paragraph({sentences: 1})
//     })
//     .expectStatus(200)
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectJSON({
//       "statusCode" : 201,
//       "status" : "Created",
//       "statusMessage" : "document save successful"
//     })
//     .expectJSONTypes('response', {
//        title    : String,
//        content : String
//     })
//     .toss()
// // END

// // GET /documents/ `should find all documents`
//   frisby.create('POST')
//     .post('http://localhost:3000/api/documents', {
//       _ownerId: UserID,
//       title: chance.sentence({words: 5}),
//       content: chance.paragraph({sentences: 1})
//     })
//     .expectStatus(200)
//     .toss()
//   frisby.create('GET /documents/ `should find all documents`')
//     .get('http://localhost:3000/api/documents')
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectStatus(200)
//     .expectJSON({
//       "statusCode" : 200,
//       "status" : 'OK'
//     })
//     .toss() 
// // END

// // GET /documents/<id> `should find a document`
//   frisby.create('POST')
//     .post('http://localhost:3000/api/documents', {
//       _ownerId: UserID,
//       title: chance.sentence({words: 5}),
//       content: chance.paragraph({sentences: 1})
//     })
//     .expectStatus(200)
//     .toss()
//   frisby.create('GET')
//     .get('http://localhost:3000/api/documents')
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectStatus(200)
//     .expectJSON({
//       "statusCode" : 200,
//       "status" : 'OK'
//     })
//     .afterJSON(function(json){
//      // Second test, run after first is completed
//      frisby.create('GET /documents/<id> `should find a document`')
//        .get('http://localhost:3000/api/documents/' + json.response[0]._id)
//        .addHeader('x-access-token', token)
//        .inspectJSON()
//        .expectStatus(200)
//        .expectJSON({
//          "statusCode" : 200,
//          "status" : "OK",
//        })
//        .toss() 
//     })
//     .toss() 
// // END

// // PUT /documents/<id> `should update user attributes`
//   frisby.create('GET')
//     .get('http://localhost:3000/api/documents')
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectStatus(200)
//     .expectJSON({
//       "statusCode" : 200,
//       "status" : 'OK'
//     })
//     .afterJSON(function(json){
//      // Second test, run after first is completed
//      frisby.create('PUT /documents/<id> `should update user attributes`')
//        .put('http://localhost:3000/api/documents/' + json.response[1]._id, {
//          title: chance.sentence({words: 5}),
//          content: chance.paragraph({sentences: 1})
//        }, {json: true})
//        .addHeader('x-access-token', token)
//        .inspectJSON()
//        .expectStatus(200)
//        .expectJSON({
//           "statusCode" : 200,
//           "status" : "OK",
//           "statusMessage" : "document update successful",
//        })
//        .toss() 
//     })
//     .toss() 
// // END

// // GET /users/<id>/documents `should find all documents accessible to the user`
//   frisby.create('GET')
//     .get('http://localhost:3000/api/users')
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectStatus(200)
//     .expectJSON({
//       "statusCode" : 200,
//       "status" : 'OK'
//     })
//     .afterJSON(function(json){
//      // Second test, run after first is completed
//      frisby.create('GET /users/<id>/documents `should find all documents accessible to the user`')
//        .get('http://localhost:3000/api/users/' + json.response[0]._id + '/documents')
//        .addHeader('x-access-token', token)
//        .inspectJSON()
//        .expectStatus(200)
//        .expectJSON({
//          "statusCode": 200,
//          "statusMessage": "OK",
//        })
//        .toss() 
//     })
//     .toss()
// // END

// // DELETE /documents/<id> `should delete documnent`
//   frisby.create('GET')
//     .get('http://localhost:3000/api/documents')
//     .addHeader('x-access-token', token)
//     .inspectJSON()
//     .expectStatus(200)
//     .expectJSON({
//       "statusCode" : 200,
//       "status" : 'OK'
//     })
//     .afterJSON(function(json){
//      // Second test, run after first is completed
//      frisby.create('DELETE /documents/<id> `should find a document`')
//        .delete('http://localhost:3000/api/documents/' + json.response[0]._id)
//        .addHeader('x-access-token', token)
//        .inspectJSON()
//        .expectStatus(200)
//        .expectJSON({
//          "status": "OK",
//          "statusMessage": "document delete successful",
//          response: {
//           "ok": 1,
//           "n": 1
//          }
//        })
//        .toss() 
//     })
//     .toss() 
// // END
// });