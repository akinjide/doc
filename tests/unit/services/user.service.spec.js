"use strict";

describe('Unit Test User Service : Mocked HTTP Requests', function() {
  var $httpBackend = null,
      UserService = null;

  // Set up Angular module
  beforeEach(function(){
    module('myApp');

    // Set up the mock http service responses
    inject(function(_$httpBackend_, _UserService_) {
      UserService = _UserService_;
      $httpBackend = _$httpBackend_;

      $httpBackend.whenGET(/\.html$/).respond(200);
    })
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have UserService service be defined', function () {
    expect(UserService).toBeDefined();
    $httpBackend.flush();
  });

  it('should `POST` to create a user', function() {
    var params = {
      username : 'Steve',
      name : {
        first : 'Steve',
        last : 'Jobs'
      },
      email : 'stevejobs@apple.com',
      password : '12bbNX24CNBP'
    };

    $httpBackend.when('POST', '/api/users').respond(200, {
      "statusCode": 201,
      "status": "Created",
      "statusMessage": "user save successful"
    });

    $httpBackend.expectPOST('/api/users');
    UserService.createUser(params).success(function(response) {
      expect(response.statusCode).toEqual(201);
      expect(response.status).toEqual('Created');
      expect(response.statusMessage).toEqual('user save successful');
    });
    $httpBackend.flush();
  });

  it('should `POST` to login a user', function() {
    var param = {
      username : 'Steve',
      password : '12bbNX24CNBP'
    };

    $httpBackend.when('POST', '/api/users/login').respond(200, {
      "statusCode": 200,
      "status": "OK",
      "statusMessage": "login successful",
      "response": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3N1ZXIiOiJBa2luamlkZSIsInN1YmplY3QiOiJVc2VyIFRva2VuIiwiYXVkaWVuY2UiOnsiX2lkIjoiNTY0Mjc3NmJkZWU2OTA1MDQxNWQ3YTM4IiwidXNlcm5hbWUiOiJ0aXdhc2V4eSIsImVtYWlsIjoidGl3YUBnbWFpLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGkyQ1ZoQUZKamZvUWFicXJOTzhLNy5BbjBIQW5VZEQvQUpIZHBvSUNTSERtZ0RDNzMuUHNDIiwiX192IjowLCJuYW1lIjp7ImZpcnN0IjoiVGl3YSIsImxhc3QiOiJTYXZhZ2UifX0sImV4cGlyZXNJbiI6NDMyMDAsIm5iZiI6MTQ0NzQ1MDcwNzI5MiwiaWF0IjoxNDQ3NDUwNjY0MDkzfQ.ac9nZ9FH74foYgJ5bqjzQDVte1-6M6DGZgNvZbEjui4",
        "expires": "2015-11-13T21:38:27.292Z"
      }
    });

    $httpBackend.expectPOST('/api/users/login');
    UserService.userLogin(param).success(function(response) {
      expect(response.statusCode).toEqual(200);
      expect(response.status).toEqual('OK');
      expect(response.statusMessage).toEqual('login successful');
      expect(response.response.token).toBeDefined();
    });
    $httpBackend.flush();
  });

  it('should `POST` to logout a user', function() {
    $httpBackend.when('POST', '/api/users/logout').respond(200, {
      "statusCode": 200,
      "status": "OK",
      "statusMessage": "logout successful"
    });

    $httpBackend.expectPOST('/api/users/logout');
    UserService.userLogout().success(function(response) {
      expect(response.statusCode).toEqual(200);
      expect(response.status).toEqual('OK');
      expect(response.statusMessage).toEqual('logout successful');
    });
    $httpBackend.flush();
  });

  it('should `GET` users', function() {
    $httpBackend.when('GET', '/api/users').respond(200, {
      "response": [
          {
            "_id": "564214557c19bbe51c7e7e5d",
            "username": "zasletnu",
            "email": "nif@alakto.gov",
            "password": "$2a$10$s83qYj6DrH6wAEW.F3XRI.N4P1qDY97ncq2jv/vWTd8mpONzV1rWm",
            "__v": 0,
            "name": {
              "first": "Mollie",
              "last": "Boone"
            }
          },
          {
            "_id": "564214567c19bbe51c7e7e5f",
            "username": "tehliber",
            "email": "tetelzel@alihuwba.io",
            "password": "$2a$10$B/JrMSXCFiij14YGVzz2q.1yDpgT6z4rWhFGoWkkl2Al3gr3vUmUy",
            "__v": 0,
            "name": {
              "first": "Roger",
              "last": "Fisher"
            }
          },
          {
            "_id": "564219d07c19bbe51c7e7e60",
            "username": "najzeub",
            "email": "fa@uhrejir.net",
            "password": "$2a$10$PP1.ee8SLHr9rkyQxNeBbeiv.muNcC16TTrFm7ESjM3C44QsIor9G",
            "__v": 0,
            "name": {
              "first": "Eric",
              "last": "King"
            }
          }
        ]
    })
    $httpBackend.expectGET('/api/users');
    UserService.getUsers().success(function(response) {
      expect(response.response.length).toEqual(3);
      expect(response.response[0].username).toEqual('zasletnu');
      expect(response.response[1].username).toEqual('tehliber');
    });
    $httpBackend.flush();
  });

  it('should `GET` user by ID', function() {
    var userID = '564214557c19bbe51c7e7e5d';

    $httpBackend.when('GET', '/api/users/' + userID).respond(200, {
      "response": {
              "_id": "564214557c19bbe51c7e7e5d",
              "username": "zasletnu",
              "email": "nif@alakto.gov",
              "password": "$2a$10$s83qYj6DrH6wAEW.F3XRI.N4P1qDY97ncq2jv/vWTd8mpONzV1rWm",
              "__v": 0,
              "name": {
                "first": "Mollie",
                "last": "Boone"
              }
            }
    })
    $httpBackend.expectGET('/api/users/564214557c19bbe51c7e7e5d');
    UserService.getUser(userID).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Object));
      expect(response.response.email).toEqual('nif@alakto.gov');
      expect(response.response.username).toEqual('zasletnu');
    });
    $httpBackend.flush();
  });

  it('should `UPDATE` a user', function() {
    var userID = '564214557c19bbe51c7e7e5d';
    var params = {
      "username": "kayak",
      "email": "kayak@alakto.gov",
      "name": {
        "first": "ka",
        "last": "yak"
      }
    }

    $httpBackend.when('PUT', '/api/users/' + userID, params).respond(200, {
      "response": {
        "ok": 1,
        "nModified": 1,
        "n": 1
      }
    })
    $httpBackend.expectPUT('/api/users/564214557c19bbe51c7e7e5d');
    UserService.updateUser(userID, params).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Object));
      expect(response.response.nModified).toEqual(1);
      expect(response.response.ok).toEqual(1);
    });
    $httpBackend.flush();
  });

  it('should `DELETE` a user', function() {
    var userID = '564214557c19bbe51c7e7e5d';

    $httpBackend.when('DELETE', '/api/users/' + userID).respond(200, {
      "response": {
        "ok": 1,
        "n": 1
      }
    })
    $httpBackend.expectDELETE('/api/users/564214557c19bbe51c7e7e5d');
    UserService.deleteUser(userID).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Object));
      expect(response.response.ok).toEqual(1);
    });
    $httpBackend.flush();
  });

  it('should `GET` a user documents', function() {
    var userID = '564214557c19bbe51c7e7e5d';

    $httpBackend.when('GET', '/api/users/' + userID + '/documents').respond(200, {
      "response": [
          {
            "_id": "5645ef8ef94d3c6c01fd2dbf",
            "_ownerId": {
              "_id": "564214557c19bbe51c7e7e5d",
              "username": "tiwasexy",
              "email": "tiwa@gmai.com",
              "password": "$2a$10$i2CVhAFJjfoQabqrNO8K7.An0HAnUdD/AJHdpoICSHDmgDC73.PsC",
              "__v": 0,
              "name": {
                "first": "Tiwa",
                "last": "Savage"
              }
            },
            "title": "hello world",
            "content": "this is a sample document",
            "__v": 0,
            "lastModified": "2015-11-13T14:00:31.441Z",
            "dateCreated": "2015-11-13T14:00:31.441Z"
          },
          {
            "_id": "56460592af46452e11f7d988",
            "_ownerId": {
              "_id": "564214557c19bbe51c7e7e5d",
              "username": "tiwasexy",
              "email": "tiwa@gmai.com",
              "password": "$2a$10$i2CVhAFJjfoQabqrNO8K7.An0HAnUdD/AJHdpoICSHDmgDC73.PsC",
              "__v": 0,
              "name": {
                "first": "Tiwa",
                "last": "Savage"
              }
            },
            "title": "yes",
            "content": "sam",
            "__v": 0,
            "lastModified": "2015-11-13T15:37:58.606Z",
            "dateCreated": "2015-11-13T15:37:58.606Z"
          }
        ]
    })
    $httpBackend.expectGET('/api/users/564214557c19bbe51c7e7e5d/documents');
    UserService.getUserDocuments(userID).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Array));
      expect(response.response.length).toEqual(2);
      expect(response.response[0]._ownerId._id).toEqual(userID);
      expect(response.response[0].title).toEqual('hello world');
      expect(response.response[0].content).toEqual('this is a sample document');
    });
    $httpBackend.flush();
  });
});