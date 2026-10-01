import { config } from './config.js';
import { openDb } from './db.js';
import { createApp } from './app.js';
import { createMailer } from './lib/mailer.js';

const db = openDb(config.dbPath);
const app = createApp({ db, config, notify: createMailer(config) });
app.listen(config.port, () => console.log(`Portfolio API listening on http://localhost:${config.port}`));
