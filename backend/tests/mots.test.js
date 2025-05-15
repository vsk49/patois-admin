import request from 'supertest';
import express from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import router from '../routes/mots.js';

describe('/mots routes', () => {
  let testApp;
  let fakeDb;

  beforeEach(() => {
    testApp = express();
    testApp.use(express.json());

    // Middleware pour injecter la fausse BDD
    fakeDb = { query: jest.fn() };
    testApp.use((req, res, next) => {
      req.db = fakeDb;
      next();
    });

    testApp.use('/mots', router);
  });

  describe('POST /mots', () => {
    it('should create a new word', async () => {
      const newWord = {
        motfrancais: 'le pain',
        motpatois: 'on pan',
        cheminimage: '/img/le_pain.png',
        cheminaudio: '/audio/on_pan.mp3',
      };
      fakeDb.query.mockResolvedValueOnce({ rows: [{ idmot: 1 }] });

      const res = await request(testApp)
        .post('/mots')
        .send(newWord);

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ idmot: 1, ...newWord });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO mot'),
        [newWord.motfrancais, newWord.motpatois, newWord.cheminimage, newWord.cheminaudio]
      );
    });
  });

  describe('GET /mots', () => {
    it('should return all words', async () => {
      const rows = [
        { idmot: 1, motfrancais: 'le pain', motpatois: 'on pan', cheminimage: '', cheminaudio: '' },
        { idmot: 2, motfrancais: 'pull',  motpatois: 'o triko', cheminimage: '', cheminaudio: '' },
      ];
      fakeDb.query.mockResolvedValueOnce({ rows });

      const res = await request(testApp).get('/mots');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT idmot, motfrancais, motpatois, cheminimage, cheminaudio FROM mot ORDER BY idmot')
      );
    });
  });


  describe('GET /mots/:idmot', () => {
    it('should return a single word when found', async () => {
      const row = { idmot: 1, motfrancais: 'le pain', motpatois: 'on pan', cheminimage: '', cheminaudio: '' };
      fakeDb.query.mockResolvedValueOnce({ rows: [row] });

      const res = await request(testApp).get('/mots/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(row);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE idmot ='),
        ['1']
      );
    });

    it('should return 404 when not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(testApp).get('/mots/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Word not found' });
    });
  });

  describe('PUT /mots/:idmot', () => {
    it('should update a word', async () => {
      fakeDb.query.mockResolvedValueOnce({});  // update
      const update = {
        motfrancais: 'le pain',
        motpatois: 'on pan',
        cheminimage: '/img/le_pain.png',
        cheminaudio: '/audio/on_pan.mp3',
      };

      const res = await request(testApp)
        .put('/mots/1')
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Word updated successfully' });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE mot SET'),
        [update.motfrancais, update.motpatois, update.cheminimage, update.cheminaudio, '1']
      );
    });
  });

  describe('DELETE /mots/:idmot', () => {
    it('should delete related progress then the word', async () => {
      fakeDb.query
        .mockResolvedValueOnce({})  // DELETE user_mot_progres
        .mockResolvedValueOnce({}); // DELETE mot

      const res = await request(testApp).delete('/mots/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Word deleted successfully' });
      expect(fakeDb.query).toHaveBeenNthCalledWith(
        1,
        'DELETE FROM user_mot_progres WHERE idmot = $1',
        ['1']
      );
      expect(fakeDb.query).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM mot WHERE idmot = $1',
        ['1']
      );
    });
  });
});
