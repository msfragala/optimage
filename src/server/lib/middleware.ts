import { VercelRequest, VercelResponse } from '@vercel/node';

export function catchError(
  fn: (req: VercelRequest, res: VercelResponse) => void
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await fn(req, res);
    } catch (error: any) {
      console.error(error);
      const status = error?.status ?? 500;
      res.status(status).json({ error });
    }
  };
}
