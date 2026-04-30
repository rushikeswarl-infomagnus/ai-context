import { Router } from 'express';
import { z } from 'zod';
import { db } from '@acme/db';
import { ok, err } from '@acme/utils';
import type { Result } from '@acme/utils';
import type { Post } from '@acme/db';

export const postRouter = Router();

const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  authorId: z.string().cuid(),
});

postRouter.get('/', async (_req, res) => {
  const posts = await db.post.findMany({ include: { author: true } });
  res.json({ success: true, data: posts });
});

postRouter.post('/', async (req, res) => {
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.message });
    return;
  }

  const result: Result<Post> = await db.post
    .create({ data: parsed.data })
    .then((post) => ok(post))
    .catch((e: unknown) => err(e instanceof Error ? e.message : 'Unknown error'));

  if (!result.ok) {
    res.status(500).json({ success: false, error: result.error });
    return;
  }

  res.status(201).json({ success: true, data: result.data });
});
