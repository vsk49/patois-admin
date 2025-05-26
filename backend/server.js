import pkg from 'pg';
import express, { json, urlencoded } from 'express';
import { static as serveStatic } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import createError from 'http-errors';
import { authenticateToken } from './authapi/auth.js';
import motsRouter from './routes/mots.js';
import phrasesRouter from './routes/phrases.js';
import discussionsRouter from './routes/discussions.js';
import ressourcesRouter from './routes/ressources.js';
import utilisateursRouter from './routes/utilisateurs.js';
import logger from 'morgan';
import cors from 'cors';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;

// Configure your PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://patoissav:2_T%3FkFAea59_RWwH@localhost:5432/Patois'
});

const server = express();

server.use(cors())
server.use(logger('dev'));
server.use(json());
server.use(express.json());
server.use(urlencoded({ extended: false }));

// Attach db client to each request
server.use((req, res, next) => {
  req.db = pool;
  next();
});

// Mount mots router
server.use('/mots', authenticateToken, motsRouter);

// Mount phrases router
server.use('/phrases', authenticateToken, phrasesRouter);

// Mount discussions router
server.use('/discussions', authenticateToken, discussionsRouter);

// Mount ressources router
server.use('/ressources', authenticateToken, ressourcesRouter);

// Mount utilisateurs router
server.use('/utilisateurs', (req, res, next) => {
  if (req.path === '/auth') return next(); // Allow /auth without token
  authenticateToken(req, res, next);
}, utilisateursRouter);

// Serve Vue frontend static files
server.use(serveStatic(join(__dirname, '../frontend/dist')));

// catch 404 and forward to error handler
server.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Middleware pour injecter une fausse db pour les tests (remplaçable)
server.use((req, res, next) => {
  req.db = { query: async () => ({ rows: [] }) }; // par défaut, à remplacer dans les tests
  next();
});

server.use('/mots', motsRouter);

export default server;
