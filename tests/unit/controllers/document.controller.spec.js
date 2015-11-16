"use strict";

describe('Unit Test Document Controller', function() {
  var $scope      = null,
      $httpBackend = null,
      DocService = null,
      params = null,
      controller  = null;
  
  // Set up Angular module
  beforeEach(function(){
    module('myApp');

    // Set up the mock http service responses
    inject(function(_$httpBackend_, _DocService_, $controller, $rootScope) {
      $httpBackend = _$httpBackend_;
      DocService = _DocService_;
      $scope = $rootScope.$new();

      controller = $controller('docController', { $scope : $scope }); 

      $httpBackend.whenGET(/\.html$/).respond(200);
    })
  });

  it('should create a document', function() {
    //console.log(controller);

    var params = {
      title : 'Hello World',
      content : 'This is a sample document'
    };

    $httpBackend.expectPOST('/api/documents').respond({
      title : 'Hello World',
      content : 'This is a sample document'
    });

    $scope.createDocument(params);
    $httpBackend.flush();
  });

  it('should get a document by ID', function() {
    var docID = "564214557c19bbe51c7e7e5d";

    $httpBackend.expectGET('/api/documents/' + docID).respond({
      "statusCode": 200,
      "status": "OK",
      "response": {
        title : 'Hello World',
        content : 'This is a sample document'
      }
    });

    DocService.getDocument(docID).success(function(response) {
      expect(response.statusCode).toEqual(200);
    });

    expect(DocService.getDocument).toBeDefined();
    $httpBackend.flush();
  });

  it('should update a document', function() {
    var docID = "564214557c19bbe51c7e7e5d";

    var params = {
      title : 'Steve',
      content : 'hello steve'
    };

    $httpBackend.expectPUT('/api/documents/' + docID).respond({
      "response": {
        "ok": 1,
        "nModified": 1,
        "n": 1
      }
    });

    $scope.updateDocument(params);

    DocService.updateDocument(docID, params).success(function(response) {
      expect(response.response.ok).toEqual(1);
    });

    expect($scope.updateDocument).toBeDefined();
    $httpBackend.flush();
  });

  it('should delete a document', function() {
    var docID = "564214557c19bbe51c7e7e5d";

    $httpBackend.expectDELETE('/api/documents/' + docID).respond({
      "response": {
        "ok": 1,
        "n": 1
      }
    });

    $scope.deleteDocument(docID);

    DocService.deleteDocument(docID).success(function(response) {
      expect(response.response.ok).toEqual(1);
    });

    expect($scope.deleteDocument).toBeDefined();
    $httpBackend.flush();
  });
});