import { z } from 'zod';

const envSchema = z.object({
  // Auth microservice URL (the authorization-service)
  AUTH_API_URL: z.string().url().default('http://localhost:5000'),

  // Workshop PostgreSQL database
  DATABASE_URL: z.string().min(1),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Session cookie signing secret
  SESSION_SECRET: z.string().min(32),

  // Cloudinary (optional for now)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;

export type Env = typeof env;
