import { AIResponse } from "types/LLMOutputType";
import { AIGatewaySetting } from "../AIGateway";
import { ChatRequestBody, RequestTool } from "routers/chatRouter";

export interface Tool {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      required: string[];
      properties: {
        [key: string]: {
          type: string;
          description: string;
        };
      };
    };
  };
}

const reformatTools = (tools: RequestTool[]): Tool[] => {
  return tools.map(tool => ({
    ...tool,
    function: {
      ...tool.function,
      description: tool.function.description || 'No description provided',
      parameters: {
        ...tool.function.parameters,
        type: tool.function.parameters.type || 'object',
        required: tool.function.parameters.required || [],
        properties: Object.keys(tool.function.parameters.properties).reduce((acc, key) => {
          acc[key] = {
            ...tool.function.parameters.properties[key],
            description: tool.function.parameters.properties[key].description || 'No description provided'
          };
          return acc;
        }, {} as { [key: string]: { type: string; description: string } })
      }
    }
  }));
};

export async function executePrompt(request: ChatRequestBody, env: Env): Promise<AIResponse> {
  if (request.tools) {
    request.tools = reformatTools(request.tools);
  }

  const filteredMessages = request.messages.filter(message => message.content !== null);

  const response = (await env.AI.run(
    "@cf/meta/llama-3.2-3b-instruct",
    {
      stream: false,
      max_tokens: request.options?.num_ctx || 8192,
      messages: filteredMessages,
      tools: request.tools,
    },
    AIGatewaySetting
  )) as AIResponse;

  return response;
}