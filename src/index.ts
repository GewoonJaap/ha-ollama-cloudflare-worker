import { Hono } from 'hono';
import chatRouter from 'routers/chatRouter';
import pullRouter from 'routers/pullRouter';
import tagsRouter from 'routers/tagsRouter';

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// accept all requests and log them
app.use(async (data, next) => {
  console.log('Body data', await data.req.text());
  console.log('Endpoint', data.req.url);
  console.log('Method', data.req.method);
  await next();
});

// Use the tags router
app.route('api/tags', tagsRouter);
app.route('api/pull', pullRouter);
app.route('api/chat', chatRouter);

// Export the Hono app
export default app;