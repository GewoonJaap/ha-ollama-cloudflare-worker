import { Hono } from 'hono';

interface PullRequestBody {
  name: string;
  insecure: boolean;
  stream: boolean;
}

const pullRouter = new Hono();

pullRouter.post('', async (c) => {
  const body: PullRequestBody = await c.req.json();
  console.log('Request Body:', body);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  if (body.stream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        await delay(1000); // 1 second delay
        controller.enqueue(encoder.encode(JSON.stringify({ status: "success" })));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    await delay(1000); // 1 second delay
    return c.json({ status: "success" });
  }
});

export default pullRouter;