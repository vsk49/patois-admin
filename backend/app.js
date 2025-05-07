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

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

// Attach db client to each request
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Mount mots router
app.use('/mots', authenticateToken, motsRouter);

// Mount phrases router
app.use('/phrases', authenticateToken, phrasesRouter);

// Mount discussions router
app.use('/discussions', authenticateToken, discussionsRouter);

// Mount ressources router
app.use('/ressources', authenticateToken, ressourcesRouter);

// Mount utilisateurs router
app.use('/utilisateurs', (req, res, next) => {
  if (req.path === '/auth') return next(); // Allow /auth without token
  authenticateToken(req, res, next);
}, utilisateursRouter);

// Serve Vue frontend static files
app.use(serveStatic(join(__dirname, '../frontend/dist')));

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
