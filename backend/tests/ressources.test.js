import request from 'supertest';
import express from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import router from '../routes/ressources.js';

describe('/ressources routes', () => {
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
    testApp.use('/ressources', router);
  });

  describe('POST /ressources', () => {
    it('should create a new resource', async () => {
      fakeDb.query.mockResolvedValueOnce({ 
        rows: [{ 
          idressource: 1, 
          nomressource: 'Test Resource', 
          typeressource: 'document', 
          contenu: 'Test content', 
          cheminimage: '/images/test.jpg', 
          cheminaudio: '/audio/test.mp3' 
        }] 
      });

      const payload = { 
        nomressource: 'Test Resource', 
        typeressource: 'document', 
        contenu: 'Test content', 
        cheminimage: '/images/test.jpg', 
        cheminaudio: '/audio/test.mp3' 
      };
      
      const res = await request(testApp)
        .post('/ressources')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: 'Resource created successfully',
        ressource: { 
          idressource: 1, 
          nomressource: 'Test Resource', 
          typeressource: 'document', 
          contenu: 'Test content', 
          cheminimage: '/images/test.jpg', 
          cheminaudio: '/audio/test.mp3' 
        }
      });
      
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO ressource'),
        [payload.nomressource, payload.typeressource, payload.contenu, payload.cheminimage, payload.cheminaudio]
      );
    });

    it('should return 400 if resource creation fails', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const payload = { 
        nomressource: 'Test Resource', 
        typeressource: 'document', 
        contenu: 'Test content', 
        cheminimage: '/images/test.jpg', 
        cheminaudio: '/audio/test.mp3' 
      };
      
      const res = await request(testApp)
        .post('/ressources')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Failed to create resource' });
    });
  });

  describe('GET /ressources', () => {
    it('should return all resources', async () => {
      const rows = [
        { 
          idressource: 1, 
          nomressource: 'Documentation', 
          typeressource: 'pdf', 
          contenu: 'API documentation', 
          cheminimage: '/images/doc.jpg', 
          cheminaudio: null 
        },
        { 
          idressource: 2, 
          nomressource: 'Tutorial', 
          typeressource: 'video', 
          contenu: 'Getting started guide', 
          cheminimage: '/images/tutorial.jpg', 
          cheminaudio: '/audio/tutorial.mp3' 
        }
      ];
      fakeDb.query.mockResolvedValueOnce({ rows });

      const res = await request(testApp).get('/ressources');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT idressource, nomressource, typeressource, contenu, cheminimage, cheminaudio FROM ressource ORDER BY idressource')
      );
    });

    it('should return 404 if no resources found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(testApp).get('/ressources');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'No resources found' });
    });
  });

  describe('GET /ressources/:idressource', () => {
    it('should return a specific resource', async () => {
      const row = { 
        idressource: 1, 
        nomressource: 'Documentation', 
        typeressource: 'pdf', 
        contenu: 'API documentation', 
        cheminimage: '/images/doc.jpg', 
        cheminaudio: null 
      };
      fakeDb.query.mockResolvedValueOnce({ rows: [row] });

      const res = await request(testApp).get('/ressources/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(row);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE idressource ='),
        ['1']
      );
    });

    it('should return 404 if resource not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(testApp).get('/ressources/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Resource not found' });
    });
  });

  describe('PUT /ressources/:idressource', () => {
    it('should update a resource', async () => {
      fakeDb.query.mockResolvedValueOnce({ 
        rowCount: 1,
        rows: [{ 
          idressource: 1, 
          nomressource: 'Updated Resource', 
          typeressource: 'updated-type',
          contenu: 'Updated content',
          cheminimage: '/images/updated.jpg',
          cheminaudio: '/audio/updated.mp3'
        }] 
      });
      
      const update = { 
        nomressource: 'Updated Resource', 
        typeressource: 'updated-type',
        contenu: 'Updated content',
        cheminimage: '/images/updated.jpg',
        cheminaudio: '/audio/updated.mp3'
      };

      const res = await request(testApp)
        .put('/ressources/1')
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Resource updated successfully',
        ressource: { 
          idressource: 1, 
          nomressource: 'Updated Resource', 
          typeressource: 'updated-type',
          contenu: 'Updated content',
          cheminimage: '/images/updated.jpg',
          cheminaudio: '/audio/updated.mp3'
        }
      });
      
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE ressource SET nomressource = $1, typeressource = $2, contenu = $3, cheminimage = $4, cheminaudio = $5'),
        [update.nomressource, update.typeressource, update.contenu, update.cheminimage, update.cheminaudio, '1']
      );
    });

    it('should return 404 if resource not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rowCount: 0 });

      const update = { 
        nomressource: 'Updated Resource', 
        typeressource: 'updated-type',
        contenu: 'Updated content',
        cheminimage: '/images/updated.jpg',
        cheminaudio: '/audio/updated.mp3'
      };

      const res = await request(testApp)
        .put('/ressources/999')
        .send(update);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Resource not found' });
    });
  });

  describe('DELETE /ressources/:idressource', () => {
    it('should delete a resource', async () => {
      fakeDb.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(testApp).delete('/ressources/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Resource deleted successfully' });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM ressource WHERE idressource ='),
        ['1']
      );
    });

    it('should return 404 if resource not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(testApp).delete('/ressources/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Resource not found' });
    });
  });
});