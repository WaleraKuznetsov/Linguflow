import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'linguflow.db');

try {
  const db = new Database(dbPath);
  const schema = readFileSync(join(__dirname, '..', 'data', 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('✅ База данных успешно инициализирована:', dbPath);
  db.close();
} catch (error) {
  console.error('❌ Ошибка инициализации БД:', error.message);
  process.exit(1);
}
