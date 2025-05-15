import request from 'supertest';
import express from 'express';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import router from '../routes/phrases.js';

describe('/phrases routes', () => {
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
    testApp.use('/phrases', router);
  });

  describe('POST /phrases', () => {
    it('should create a new phrase', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [{ idphrase: 1 }] });
      const payload = {
        phrasefrancais: 'Bonjour, comment ça va ?',
        phrasepatois:  "Bonjhor c'man to qui va ?",
        cheminaudio:   '/audio/phrase1.mp3',
        iddiscussion:  '1',
      };

      const res = await request(testApp)
        .post('/phrases')
        .send(payload);

      expect(res.status).toBe(201);
      // Seule la clé idphrase est renvoyée
      expect(res.body).toEqual({ idphrase: 1 });  
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO phrase'),
        [
          payload.phrasefrancais,
          payload.phrasepatois,
          payload.cheminaudio,
          payload.iddiscussion
        ]
      );
    });
  });

  describe('GET /phrases', () => {
    it('should return all phrases', async () => {
      const rows = [
        {
          idphrase: 1,
          phrasefrancais: 'Bonjour, comment ça va ?',
          phrasepatois:   "Bonjhor c'man to qui va ?",
          cheminaudio:    'audio/bonjhor_cman_to_qui_va.mp3',
          iddiscussion:   '1'
        },
        {
          idphrase: 2,
          phrasefrancais: 'Ça va bien et toi ?',
          phrasepatois:   'Y va et ta ?',
          cheminaudio:    'audio/y_va_et_ta.mp3',
          iddiscussion:   '1'
        }
      ];
      fakeDb.query.mockResolvedValueOnce({ rows });

      const res = await request(testApp).get('/phrases');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining(
          'SELECT idphrase, phrasefrancais, phrasepatois, cheminaudio, iddiscussion FROM phrase ORDER BY iddiscussion, idphrase'
        )
      );
    });
  });

  describe('GET /phrases/:idphrase', () => {
    it('should return a phrase by id', async () => {
      const row = {
        idphrase: 1,
        phrasefrancais: 'Bonjour, comment ça va ?',
        phrasepatois:   "Bonjhor c'man to qui va ?",
        cheminaudio:    'audio/bonjhor_cman_to_qui_va.mp3',
        iddiscussion:   '1'
      };
      fakeDb.query.mockResolvedValueOnce({ rows: [row] });

      const res = await request(testApp).get('/phrases/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(row);
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE idphrase ='),
        ['1']
      );
    });

    it('should return 404 when phrase not found', async () => {
      fakeDb.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(testApp).get('/phrases/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Phrase not found' });
    });
  });

  describe('PUT /phrases/:idphrase', () => {
    it('should update a phrase', async () => {
      fakeDb.query.mockResolvedValueOnce({});
      const update = {
        phrasefrancais: 'Salut !',
        phrasepatois:   'Salût !',
        cheminaudio:    'audio/salut.mp3',
        iddiscussion:   '2'
      };

      const res = await request(testApp)
        .put('/phrases/1')
        .send(update);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Phrase updated successfully' });
      expect(fakeDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE phrase SET'),
        [
          update.phrasefrancais,
          update.phrasepatois,
          update.cheminaudio,
          update.iddiscussion,
          '1'
        ]
      );
    });
  });

  describe('DELETE /phrases/:idphrase', () => {
    it('should delete progress and the phrase', async () => {
      // On ne mocke qu'une seule fois car la route ne fait qu'un appel
      fakeDb.query.mockResolvedValueOnce({});

      const res = await request(testApp).delete('/phrases/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Phrase deleted successfully' });
      // Vérifie qu'on a bien appelé DELETE phrase
      expect(fakeDb.query).toHaveBeenCalledWith(
        'DELETE FROM phrase WHERE idphrase = $1',
        ['1']
      );
    });
  });
});
