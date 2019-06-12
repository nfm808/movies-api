const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

const header = { "Authorization": `Bearer b1b92824-8c99-11e9-bc42-526af7764f64` };

describe('GET /movie endpoint', () => {
  it('should return an array', () => {
    return request(app)
      .get('/movie')
      .set( header )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('array');
      });
  });

  it('should fail without auth headers', () => {
    return request(app)
      .get('/movie')
      .expect(401, '401: Unauthorized Request');
  });

  it('should fail with wrong auth headers', () => {
    return request(app)
      .get('/movie')
      .set( { "Authorization": "Bearer INVALID" } )
      .expect(401, '401: Unauthorized Request');
  });

  it('should filter results by genre', () => {
    return request(app)
      .get('/movie')
      .set(header)
      .query({ genre: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body.includes(mov => mov.genre !== 'Action')).to.be.false;
      });
  });

  it('should filter results by country', () => {
    return request(app)
      .get('/movie')
      .set(header)
      .query({ country: 'United_States' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body.filter(mov => mov["country"] === 'United States')).to.be.lengthOf.at.least(1);
      });
  });

  it('should filter results by average vote', ()=> {
    return request(app)
      .get('/movie')
      .set(header)
      .query({ avg_vote: 7 })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).to.be.an('array')
        expect(res.body).to.have.lengthOf.at.least(1)
        expect(res.body.includes(mov => mov["avg_vote"] <= '7')).to.be.false;
      });
  });

});

