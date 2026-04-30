import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './routes/users';
import { postRouter } from './routes/posts';
import { envSchema } from './env';

const env = envSchema.parse(process.env);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(env.PORT, () => {
  console.log(`API server running on port ${env.PORT}`);
});
