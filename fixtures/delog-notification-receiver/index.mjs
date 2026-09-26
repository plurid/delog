import { createServer } from 'node:http';

const server = createServer(async (request, response) => {
  if (request.method !== 'POST') {
    response.writeHead(405).end();
    return;
  }
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > 1024 * 1024) {
        response.writeHead(413).end();
        return;
      }
      chunks.push(chunk);
    }
    const notification = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    console.log(
      JSON.stringify(
        {
          delivery: request.headers['delog-delivery'],
          notification,
        },
        null,
        2,
      ),
    );
    response.writeHead(204).end();
  } catch {
    response.writeHead(400).end();
  }
});

server.listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () => {
  console.log(`Notification receiver: http://127.0.0.1:${server.address().port}`);
});
process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());
