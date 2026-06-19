import net from 'net';

const host = process.env.API_HOST ?? '127.0.0.1';
const port = Number(process.env.API_PORT ?? process.env.PORT ?? 5065);

const inUse = await new Promise((resolve) => {
  const server = net.createServer();
  server.once('error', (err) => resolve(err.code === 'EADDRINUSE'));
  server.once('listening', () => { server.close(); resolve(false); });
  server.listen(port, host);
});

if (inUse) {
  console.error('');
  console.error('Port %s is already in use (another backend instance is running).', port);
  console.error('');
  console.error('Fix options:');
  console.error('  1. Stop the other terminal where npm start / dotnet run is running (Ctrl+C)');
  console.error('  2. Or kill the process:');
  console.error('       netstat -ano | findstr :%s', port);
  console.error('       taskkill /PID <pid> /F');
  console.error('');
  process.exit(1);
}
