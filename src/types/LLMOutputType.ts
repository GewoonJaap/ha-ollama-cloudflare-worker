export interface AIResponse {
	response: string;
	tool_calls?: ToolCall[];
}

export interface ToolCall {
	arguments: Record<string, any>;
	name: string;
}