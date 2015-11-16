"use strict";

describe('Unit Test User Controller', function() {
  var $scope      = null,
      $httpBackend = null,
      UserService = null,
      param = null,
      controller  = null;
  
  // Set up Angular module
  beforeEach(function(){
    module('myApp');

    // Set up the mock http service responses
    inject(function(_$httpBackend_, _UserService_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      UserService = _UserService_;
      $scope = $rootScope.$new();

      controller = $controller('userController', { $scope : $scope });
      $httpBackend.whenGET(/\.html$/).respond(200);
    })
  });

  it('should create a user', function() {

    var param = {
      username : 'Steve',
      name : {
        first : 'Steve',
        last : 'Jobs'
      },
      email : 'stevejobs@apple.com',
      password : '12bbNX24CNBP'
    };

    $httpBackend.expectPOST('/api/users').respond({
      username : 'Steve',
      name : {
        first : 'Steve',
        last : 'Jobs'
      },
      email : 'stevejobs@apple.com',
      password : '12bbNX24CNBP'
    });

    $scope.createUser(param);
    $httpBackend.flush();
  });

  it('should login a user', function() {
    var param = {
      username : 'Steve',
      password : '12bbNX24CNBP'
    };
  
    $httpBackend.expectPOST('/api/users/login', param).respond({});

    $scope.login(param);
    expect($scope.login).toBeDefined()
    $httpBackend.flush();
  });

  it('should get a user by ID', function() {
    var userID = "564214557c19bbe51c7e7e5d";

    $httpBackend.expectGET('/api/users/' + userID).respond({
      "statusCode": 200,
      "status": "OK",
      "response": {
        username : 'Steve',
        name : {
          first : 'Steve',
          last : 'Jobs'
        },
        email : 'stevejobs@apple.com',
        password : '12bbNX24CNBP'
      }
    });

    UserService.getUser(userID).success(function(response) {
      expect(response.statusCode).toEqual(200);
    });

    expect(UserService.getUser).toBeDefined();
    $httpBackend.flush();
  });

  it('should logout a user', function() {
    $httpBackend.expectPOST('/api/users/logout').respond({});

    $scope.logout();

    expect($scope.logout).toBeDefined()
    $httpBackend.flush();
  });

  it('should update a user', function() {
    var userID = "564214557c19bbe51c7e7e5d";
    var param = {
      username : 'Steve',
      name : {
        first : 'Steve',
        last : 'Jobs'
      },
      email : 'stevejobs@apple.com'
    };

    $httpBackend.expectPUT('/api/users/' + userID).respond({
      "response": {
        "ok": 1,
        "nModified": 1,
        "n": 1
      }
    });

    $scope.updateUser(param);

    UserService.updateUser(userID, param).success(function(response) {
      expect(response.response.ok).toEqual(1);
    });

    expect($scope.updateUser).toBeDefined();
    $httpBackend.flush();
  });

  it('should delete a user', function() {
    var userID = "564214557c19bbe51c7e7e5d";


    $httpBackend.expectDELETE('/api/users/' + userID).respond({
      "response": {
        "ok": 1,
        "n": 1
      }
    });

    $scope.deleteUser(userID);

    UserService.deleteUser(userID).success(function(response) {
      expect(response.response.ok).toEqual(1);
    });

    expect($scope.deleteUser).toBeDefined();
    $httpBackend.flush();
  });

  it('should get a user documents', function() {
    var userID = "564214557c19bbe51c7e7e5d";

    $httpBackend.expectGET('/api/users/' + userID + '/documents').respond({
      "response": {
        "ok": 1,
        "n": 1
      }
    });

    UserService.getUserDocuments(userID).success(function(response) {
      expect(response.response.ok).toEqual(1);
    });

    expect(UserService.getUserDocuments).toBeDefined();
    $httpBackend.flush();
  });
});