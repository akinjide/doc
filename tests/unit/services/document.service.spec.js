"use strict";

describe('Unit Test User Service : Mocked HTTP Requests', function() {
  var $httpBackend = null,
      DocService = null;

  // Set up Angular module
  beforeEach(function(){
    module('myApp');

    // Set up the mock http service responses
    inject(function(_$httpBackend_, _DocService_) {
      DocService = _DocService_;
      $httpBackend = _$httpBackend_;

      $httpBackend.whenGET(/\.html$/).respond(200);
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have DocService service be defined', function () {
    expect(DocService).toBeDefined();
    $httpBackend.flush();
  });

  it('should `POST` to create a document', function() {
    var params = {
      title : 'Hello World',
      content : 'This is a sample document'
    };

    $httpBackend.when('POST', '/api/documents').respond(200, {
      "statusCode": 201,
      "status": "Created",
      "statusMessage": "document save successful",
    });

    $httpBackend.expectPOST('/api/documents');
    DocService.createDocument(params).success(function(response) {
      expect(response.statusCode).toEqual(201);
      expect(response.status).toEqual('Created');
      expect(response.statusMessage).toEqual('document save successful');
    });
    $httpBackend.flush();
  });

  it('should `GET` documents', function() {
    $httpBackend.when('GET', '/api/documents').respond(200, {
      "response": [
          {
            "_id": "5644bde6054f4dbaa5d6cf8b",
            "_ownerId": "5644bdcc054f4dbaa5d6cf89",
            "title": "sadfsd",
            "content": "adssdg",
            "__v": 0,
            "lastModified": "2015-11-12T16:19:45.955Z",
            "dateCreated": "2015-11-12T16:19:45.955Z"
          },
          {
            "_id": "5645ef8ef94d3c6c01fd2dbf",
            "_ownerId": "5642776bdee69050415d7a38",
            "title": "hello world",
            "content": "this is a sample document",
            "__v": 0,
            "lastModified": "2015-11-13T14:00:31.441Z",
            "dateCreated": "2015-11-13T14:00:31.441Z"
          }
        ]
    });

    $httpBackend.expectGET('/api/documents');
    DocService.getDocuments().success(function(response) {
      expect(response.response[1].title).toEqual('hello world');
      expect(response.response[1].content).toEqual('this is a sample document');
      expect(response.response.length).toEqual(2);
    });
    $httpBackend.flush();
  });

  it('should `GET` document by ID', function() {
    var docID = '5644bde6054f4dbaa5d6cf8b';

    $httpBackend.when('GET', '/api/documents/' + docID).respond(200, {
      "response": {
            "_id": "5644bde6054f4dbaa5d6cf8b",
            "_ownerId": "5644bdcc054f4dbaa5d6cf89",
            "title": "sadfsd",
            "content": "adssdg",
            "__v": 0,
            "lastModified": "2015-11-12T16:19:45.955Z",
            "dateCreated": "2015-11-12T16:19:45.955Z"
          }
    });

    $httpBackend.expectGET('/api/documents/5644bde6054f4dbaa5d6cf8b');
    DocService.getDocument(docID).success(function(response) {
      expect(response.response.title).toEqual('sadfsd');
      expect(response.response.content).toEqual('adssdg');
    });
    $httpBackend.flush();
  });

  it('should `UPDATE` a document', function() {
    var docID = '5644bde6054f4dbaa5d6cf8b';
    var params = {
      "title": "Vimeo",
      "content": "this is a sample document 2"
    };

    $httpBackend.when('PUT', '/api/documents/' + docID, params).respond(200, {
      "response": {
        "ok": 1,
        "nModified": 1,
        "n": 1
      }
    });
    $httpBackend.expectPUT('/api/documents/5644bde6054f4dbaa5d6cf8b');
    DocService.updateDocument(docID, params).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Object));
      expect(response.response.nModified).toEqual(1);
      expect(response.response.ok).toEqual(1);
    });
    $httpBackend.flush();
  });

  it('should `DELETE` a document', function() {
    var docID = '5644bde6054f4dbaa5d6cf8b';

    $httpBackend.when('DELETE', '/api/documents/' + docID).respond(200, {
      "response": {
        "ok": 1,
        "n": 1
      }
    });
    $httpBackend.expectDELETE('/api/documents/5644bde6054f4dbaa5d6cf8b');
    DocService.deleteDocument(docID).success(function(response) {
      expect(response.response).toEqual(jasmine.any(Object));
      expect(response.response.ok).toEqual(1);
    });
    $httpBackend.flush();
  });
});