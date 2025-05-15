import request from 'supertest';
import express from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import router from '../routes/discussions.js';

describe('/discussions routes', () => {
  let testApp;
  let fakeDb;

  beforeEach(() => {
    testApp = express();
    testApp.use(express.json());
    fakeDb = { query: jest.fn() };
    testApp.use((req, res, next) => {
      req.db = fakeDb;
      next();
    });
    testApp.use('/discussions', router);
  });

  describe('POST /discussions', () => {
      it('should create a new discussion', async () => {
        fakeDb.query.mockResolvedValueOnce({ rows: [{ iddiscussion: 1 }] });
  
        const payload = { nomdiscussion: 'Test' };
        const res = await request(testApp)
          .post('/discussions')
          .send(payload);
  
        expect(res.status).toBe(201);
  
        expect(res.body).toEqual({
          discussion: { iddiscussion: 1 },
          message: 'Discussion created successfully'
        });
        expect(fakeDb.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO discussion'),
          [payload.nomdiscussion]
        );
      });
    });

  describe('GET /discussions', () => {
    it('should return all discussions', async () => {
      const rows = [
        { iddiscussion: 1, nomdiscussion: 'Accueil Maison' },
        { iddiscussion: 2, nomdiscussion: 'Dire au revoir' }
      ];
      fakeDb.query.mockResolvedValueOnce({ rows });

      const res = await request(testApp).get('/discussions');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT iddiscussion, nomdiscussion FROM discussion ORDER BY iddiscussion')
      );
    });
  });

  describe('GET /discussions/:iddiscussion', () => {
    it('should return a specific discussion', async () => {
      const row = [{ iddiscussion: 1, nomdiscussion: 'Accueil Maison' }];
      fakeDb.query.mockResolvedValueOnce({ rows :[row] });

      const res = await request(testApp).get('/discussions/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(row);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE iddiscussion ='),
        ['1']
      );
    });

    it('should return 404 if discussion not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(testApp).get('/discussions/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Discussion not found' });
    });
  });

  describe('PUT /discussions/:iddiscussion', () => {
    it('should update a discussion', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [{ iddiscussion: 1 }] });
      const update = { nomdiscussion: 'Updated Discussion' };

      const res = await request(testApp)
        .put('/discussions/1')
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Discussion updated successfully',
        discussion: { iddiscussion: 1 }
      });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE discussion SET nomdiscussion ='),
        [update.nomdiscussion, '1']
      );
    });

    it('should return 404 if discussion not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(testApp)
        .put('/discussions/999')
        .send({ nomdiscussion: 'Updated Discussion' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Discussion not found' });
    });
  });

  describe('DELETE /discussions/:iddiscussion', () => {
    it('should delete a discussion', async () => {
      fakeDb.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(testApp).delete('/discussions/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Discussion deleted successfully' });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM discussion WHERE iddiscussion ='),
        ['1']
      );
    });
  });
})