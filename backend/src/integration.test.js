import request from 'supertest';
import app from './app';

describe('Server', () => {
  describe('/api/retros', () => {
    it('responds with retros in JSON format', async () => {
      const response = await request(app)
        .get('/api/retros')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.retros.length).toBeGreaterThan(0);
    });
  });

  describe('/api/retros/retro-id', () => {
    it('responds with retros in JSON format', async () => {
      const response = await request(app)
        .get('/api/retros/my-retro')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body.name).toEqual('My Retro');
    });

    it('responds HTTP Not Found for unknown IDs', async () => {
      await request(app)
        .get('/api/retros/nope')
        .expect(404);
    });
  });

  describe('Static content', () => {
    it('responds with index.html for root requests', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/);

      expect(response.text).toContain('<title>Example Static Resource</title>');
    });

    it('responds with index.html for all unknown requests', async () => {
      const response = await request(app)
        .get('/foobar')
        .expect(200)
        .expect('Content-Type', /text\/html/);

      expect(response.text).toContain('<title>Example Static Resource</title>');
    });
  });
});
