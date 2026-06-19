import net from 'net';

const host = process.env.MYSQL_HOST ?? '127.0.0.1';
const port = Number(process.env.MYSQL_PORT ?? 3306);

const connected = await new Promise((resolve) => {
  const socket = net.createConnection({ host, port });
  socket.setTimeout(3000);
  socket.on('connect', () => { socket.destroy(); resolve(true); });
  socket.on('timeout', () => { socket.destroy(); resolve(false); });
  socket.on('error', () => resolve(false));
});

if (!connected) {
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

console.log('MySQL is reachable on %s:%s', host, port);
