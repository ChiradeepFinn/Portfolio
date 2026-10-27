/**
 * Minimal typings for Chrome's experimental WebMCP APIs.
 * @see https://developer.chrome.com/docs/ai/webmcp
 */

interface WebMcpToolAnnotations {
  readonly readOnlyHint?: boolean;
  readonly untrustedContentHint?: boolean;
}

interface WebMcpToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: Record<string, unknown>;
  readonly annotations?: WebMcpToolAnnotations;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

interface ModelContext {
  registerTool(tool: WebMcpToolDefinition): Promise<void> | void;
  unregisterTool?(name: string): Promise<void> | void;
}

interface Document {
  modelContext?: ModelContext;
}

declare namespace React {
  interface FormHTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: boolean | '';
  }

  interface InputHTMLAttributes<T> {
    toolparamdescription?: string;
  }

  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string;
  }

  interface SelectHTMLAttributes<T> {
    toolparamdescription?: string;
  }
}
