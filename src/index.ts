import express, { json } from 'express';
import { makeExpressCallback } from '@/lib/express';
import { notFound } from '@/routes';

const app = express();

app.use(json());

app.use(makeExpressCallback(notFound));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
