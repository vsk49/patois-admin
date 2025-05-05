import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { static as serveStatic } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

// Serve Vue frontend static files (adjust path if needed)
app.use(serveStatic(join(__dirname, '../frontend/dist')));

// catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  }
);

export default app;
