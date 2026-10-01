import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';
import { defaultContent } from '../src/defaultContent.js';

const config = { jwtSecret: 's', adminPassword: 'pw', corsOrigins: [], clientDist: '/nonexistent' };
const make = () => createApp({ db: openDb(':memory:'), config });
const login = async (app) => (await request(app).post('/api/auth/login').send({ password: 'pw' })).body.token;

test('serves seeded content', async () => {
  const res = await request(make()).get('/api/content');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, defaultContent);
});

test('contact form stores a message and admin can read it', async () => {
  const app = make();
  const post = await request(app).post('/api/contact').send({ name: 'Sam', email: 'sam@example.com', message: 'Hi!' });
  assert.equal(post.status, 201);
  assert.equal((await request(app).get('/api/messages')).status, 401);
  const token = await login(app);
  const list = await request(app).get('/api/messages').set('Authorization', `Bearer ${token}`);
  assert.equal(list.body.length, 1);
  assert.equal(list.body[0].name, 'Sam');
  assert.equal(list.body[0].isRead, false);
  const patch = await request(app).patch(`/api/messages/${list.body[0].id}`).set('Authorization', `Bearer ${token}`).send({});
  assert.equal(patch.body.isRead, true);
  const del = await request(app).delete(`/api/messages/${list.body[0].id}`).set('Authorization', `Bearer ${token}`);
  assert.equal(del.status, 204);
});

test('contact form validates input and ignores honeypot', async () => {
  const app = make();
  const bad = await request(app).post('/api/contact').send({ name: '', email: 'nope', message: '' });
  assert.equal(bad.status, 400);
  const bot = await request(app).post('/api/contact').send({ name: 'Bot', email: 'b@x.com', message: 'spam', website: 'http://spam' });
  assert.equal(bot.status, 201);
  const token = await login(app);
  const list = await request(app).get('/api/messages').set('Authorization', `Bearer ${token}`);
  assert.equal(list.body.length, 0);
});

test('login rejects wrong password', async () => {
  const res = await request(make()).post('/api/auth/login').send({ password: 'wrong' });
  assert.equal(res.status, 401);
});

test('admin can update content; invalid content is rejected', async () => {
  const app = make();
  const token = await login(app);
  const auth = { Authorization: `Bearer ${token}` };
  assert.equal((await request(app).put('/api/content').send(defaultContent)).status, 401);
  const updated = structuredClone(defaultContent);
  updated.hero.tagline = 'New tagline';
  assert.equal((await request(app).put('/api/content').set(auth).send(updated)).status, 200);
  assert.equal((await request(app).get('/api/content')).body.hero.tagline, 'New tagline');
  assert.equal((await request(app).put('/api/content').set(auth).send({ hero: {} })).status, 400);
});
