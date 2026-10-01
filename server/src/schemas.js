import { z } from 'zod';

const str = (max = 2000) => z.string().trim().min(1).max(max);
const strList = (max = 50) => z.array(str()).max(max);

export const contentSchema = z.object({
  site: z.object({ name: str(100), email: z.string().email(), linkedin: z.string().url(), footer: str(200) }),
  hero: z.object({ overline: str(100), tagline: str(200), positioning: str(500) }),
  about: z.object({
    headline: str(200),
    paragraphs: strList(10),
    capabilities: strList(20),
    tools: strList(30),
    photoCaption: str(100),
    location: str(100),
  }),
  pillars: z
    .array(
      z.object({
        title: str(150),
        subtitle: str(200),
        paragraphs: strList(10),
        process: strList(10).optional(),
        tags: strList(10).optional(),
        stats: z.array(z.object({ stat: str(20), label: str(80) })).max(6).optional(),
        statNote: str(200).optional(),
        photoCaption: str(100),
        badge: str(200).optional(),
        pullquote: str(300).optional(),
      }),
    )
    .length(3),
  contact: z.object({ heading: str(200), script: str(200), body: str(600), closing: str(200) }),
});

export const contactSchema = z.object({
  name: str(100),
  email: z.string().trim().email().max(200),
  message: str(5000),
  // honeypot: real users never fill this in
  website: z.string().max(500).optional(),
});

export const loginSchema = z.object({ password: z.string().min(1).max(200) });
