const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const payload = Buffer.concat(chunks).toString();
        resolve({ status: res.statusCode, body: payload });
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const login = await post('/api/login', { email: 'test@test.com', password: 'pass' });
    console.log('LOGIN', login);

    const chat = await post('/api/chat', { message: 'Hello', language: 'en' });
    console.log('CHAT', chat);

    const report = await post('/api/upload/report', { fileBase64: 'abc', language: 'en' });
    console.log('REPORT', report);
  } catch (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
})();
