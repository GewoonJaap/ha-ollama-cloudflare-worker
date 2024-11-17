import { Hono } from 'hono';
import { ToolCall } from 'types/LLMOutputType';
import { executePrompt, Tool } from 'util/LLM/LLMHandler';

export interface Message {
  role: string;
  content: string;
  images?: string[];
  tool_calls?: any[];
}

export interface RequestTool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: any;
  };
}

export interface ChatRequestBody {
  model: string;
  messages: Message[];
  tools?: RequestTool[];
  stream: boolean;
  format?: string;
  options?: {
    num_ctx?: number;
    seed?: number;
    temperature?: number;
  };
  keep_alive?: string;
}

const chatRouter = new Hono();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateResponse = async (body: ChatRequestBody, env: Env) => {
  return await executePrompt(body, env);
};

const transformToolCalls = (toolCalls: ToolCall[]) => {
    console.log('Tool Calls:', JSON.stringify(toolCalls));
  return toolCalls.map(toolCall => ({
    function: {
      name: toolCall.name,
      arguments: toolCall.arguments
    }
  }));
};

chatRouter.post('', async (c) => {
  const body: ChatRequestBody = await c.req.json();
  console.log('Chat Request Body:', JSON.stringify(body));

  const encoder = new TextEncoder();
  const generateAndEnqueueResponse = async (controller: ReadableStreamDefaultController, content: string, done: boolean) => {
    const response = await generateResponse(body, c.env);
    controller.enqueue(encoder.encode(JSON.stringify(response)));
  };

  if (body.stream) {
    const stream = new ReadableStream({
      async start(controller) {
        await generateAndEnqueueResponse(controller, "The", false);
        await generateAndEnqueueResponse(controller, " sky is blue because of Rayleigh scattering.", true);
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    const response = await generateResponse(body, c.env);
    const result = {
      model: body.model,
      created_at: new Date().toISOString(),
      message: {
        role: "assistant",
        content: response.response,
        tool_calls: transformToolCalls(response.tool_calls || [])
      },
      done_reason: "stop",
      done: true,
      total_duration: 885095291,
      load_duration: 3753500,
      prompt_eval_count: 122,
      prompt_eval_duration: 328493000,
      eval_count: 33,
      eval_duration: 552222000
    };
    return c.json(result);
  }
});

export default chatRouter;