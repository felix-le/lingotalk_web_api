const request = require('supertest');
const app = require('./server');

// test GET /api/ping
function removeQuotes(str) {
  // convert JSON to string
  let newStr = JSON.stringify(str);
  return newStr.replace(/\"/g, '');
}

// Test Get /
describe('GET /', () => {
  // return 200 Ok and the response should be Welcome to the Perpetua - API, and the content type header should be json
  it('should return 200 OK and the response should be Welcome to the Perpetua - API, and the content type header should be json', async function () {
    // eslint-disable-line
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response._body).toEqual('Welcome to the Perpetua - API');
  });
});

// Test Get /api
describe('GET /api', () => {
  // return 200 Ok and the response should be Welcome to the Perpetua - API, and the content type header should be json
  it('should return 200 OK and the response should be Welcome to the Perpetua - API, and the content type header should be json', async function () {
    // eslint-disable-line
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response._body).toEqual(
      'There are two routes: /api/posts and /api/testServer - Please notice that the /api/posts route requires a tag parameter'
    );
  });
});

// Test Get /ping
describe('GET /api/ping', () => {
  it('should return 200 OK and the response should beTest the server successfully, and the content type header should be json', async function () {
    // eslint-disable-line
    try {
      const response = await request(app)
        .get('/api/ping')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Test the server successfully');
      expect(removeQuotes(response._body['data'])).toEqual('{success:true}');
    } catch (error) {
      const response = await request(app)
        .get('/api/ping')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Can not test the server');
    }
  });
});

// Test Get /posts without tag/tags parameter
describe('GET /api/posts', () => {
  it('should return 400  BAD REQUEST and the response should be The tag/tags parameter is required, and the content type header should be json', async function () {
    // eslint-disable-line
    try {
      const response = await request(app)
        .get('/api/posts')
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual(
        'The tags parameter is required'
      );
    } catch (error) {
      const response = await request(app)
        .get('/api/post')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with tags=tech parameter  sortBy = id, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return a.id - b.id;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with multiple tags=tech parameter, sortBy = id, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech,history')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      // the arrangtion of the objects in the array should be sorted by the id field
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return a.id - b.id;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with tags=tech parameter  sortBy = likes, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech&sortBy=likes')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return a.likes - b.likes;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with multiple tags=tech parameter, sortBy = likes, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech,history&sortBy=likes')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      // the arrangtion of the objects in the array should be sorted by the id field
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return a.id - b.id;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with tags=tech parameter  sortBy = invalid, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech&sortBy=invalid')
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('sortBy parameter is invalid');
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with multiple tags=tech parameter, sortBy = invalid, direction = asc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech,history&sortBy=invalid')
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('sortBy parameter is invalid');
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with tags=tech parameter  sortBy = likes, direction = desc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech&sortBy=likes&direction=desc')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return b.likes - a.likes;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});

// Test Default Get /posts with multiple tags=tech parameter, sortBy = likes, direction = desc
describe('GET /api/posts?tags=tech', () => {
  it('response 200 OK and the response should be Get all Posts successfully, and the content type header should be json. posts should be an array of objects', async function () {
    try {
      const response = await request(app)
        .get('/api/posts?tags=tech,history&sortBy=likes&direction=desc')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response._body['message']).toEqual('Get all Posts successfully');
      // response._body['data']['posts'] is an array of objects
      expect(Array.isArray(response._body['data']['posts'])).toBe(true);
      // the arrangtion of the objects in the array should be sorted by the id field
      let sortedArray = response._body['data']['posts'].sort((a, b) => {
        return b.id - a.id;
      });
      expect(sortedArray).toEqual(response._body['data']['posts']);
    } catch (error) {
      const response = await request(app)
        .get('/api/posts?tags=tech')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
      expect(response._body['message']).toEqual('Internal server error');
    }
  });
});
