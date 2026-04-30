import { Router } from 'express';
import { z } from 'zod';
import { db } from '@acme/db';
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';
import type { User } from '@acme/db';

export const userRouter = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
});

userRouter.get('/', async (_req, res) => {
  const users = await db.user.findMany();
  res.json({ success: true, data: users });
});

userRouter.post('/', async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }

  const result: Result<User> = await db.user
    .create({ data: parsed.data })
    .then((user) => ok(user))
    .catch((e: unknown) => err(e instanceof Error ? e.message : 'Unknown error'));

  if (!result.ok) {
    res.status(500).json({ success: false, error: result.error });
    return;
  }

  res.status(201).json({ success: true, data: result.data });
});
