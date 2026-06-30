import { spawn, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import net from 'net';

const host = process.env.MYSQL_HOST ?? '127.0.0.1';
const port = Number(process.env.MYSQL_PORT ?? 3306);
const user = process.env.MYSQL_USER ?? 'root';
const password = process.env.MYSQL_PASSWORD ?? '';

const tcpOk = await new Promise((resolve) => {
  const socket = net.createConnection({ host, port });
  socket.setTimeout(3000);
  socket.on('connect', () => { socket.destroy(); resolve(true); });
  socket.on('timeout', () => { socket.destroy(); resolve(false); });
  socket.on('error', () => resolve(false));
});

if (!tcpOk) {
  console.error('');
  console.error('MySQL is not running on %s:%s.', host, port);
  console.error('');
  console.error('Start it first:');
  console.error('  1. Open XAMPP Control Panel');
  console.error('  2. Click Start next to MySQL');
  console.error('  3. Run npm start again');
  console.error('');
  console.error('Or run: C:\\xampp\\mysql_start.bat');
  console.error('');
  process.exit(1);
}

const mysqlBin = [
  process.env.MYSQL_BIN,
  'C:\\xampp\\mysql\\bin\\mysql.exe',
  'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
].find((p) => p && existsSync(p));

if (!mysqlBin) {
  console.log('MySQL port is open on %s:%s (TCP only — install mysql client for full check)', host, port);
  process.exit(0);
}

const baseArgs = [`-h${host}`, `-P${String(port)}`, `-u${user}`, '--connect-timeout=5'];
if (password) baseArgs.push(`-p${password}`);

const probe = spawnSync(mysqlBin, [...baseArgs, '-e', 'SELECT 1'], {
  encoding: 'utf8',
  timeout: 10000,
  windowsHide: true,
});

if (probe.status === 0) {
  const dbName = process.env.MYSQL_DATABASE ?? 'scribecount_email';
  const createDb = spawnSync(
    mysqlBin,
    [...baseArgs, '-e', `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`],
    { encoding: 'utf8', timeout: 10000, windowsHide: true }
  );
  if (createDb.status !== 0) {
    console.error('Could not create database', dbName + ':', createDb.stderr?.trim() || createDb.stdout?.trim());
    process.exit(1);
  }
  console.log('MySQL is ready on %s:%s (database: %s)', host, port, dbName);
  process.exit(0);
}

console.error('');
console.error('MySQL port %s:%s is open but the server is not responding to queries.', host, port);
console.error('');
console.error('This usually means MySQL is stuck. Fix it:');
console.error('  1. Open XAMPP Control Panel');
console.error('  2. Click Stop on MySQL, wait a few seconds');
console.error('  3. Click Start on MySQL again');
console.error('  4. Run npm start again');
console.error('');
if (probe.stderr?.trim()) {
  console.error('MySQL client said:', probe.stderr.trim());
}
process.exit(1);
