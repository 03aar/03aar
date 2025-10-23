import { IntentResult, AppMode } from '../types';

/**
 * AI Service Layer
 * Handles intent detection, summarization, and AI interactions
 */

export class AIService {
  /**
   * Detect user intent from input string
   */
  static async detectIntent(input: string): Promise<IntentResult> {
    const lowerInput = input.toLowerCase().trim();

    // URL detection
    if (this.isURL(input)) {
      return {
        mode: 'research',
        action: 'navigate',
        parameters: { url: this.normalizeURL(input) },
        confidence: 0.95,
      };
    }

    // Writing mode keywords
    if (
      lowerInput.startsWith('write') ||
      lowerInput.startsWith('draft') ||
      lowerInput.startsWith('compose') ||
      lowerInput.includes('email') ||
      lowerInput.includes('letter') ||
      lowerInput.includes('essay')
    ) {
      return {
        mode: 'write',
        action: 'create_document',
        parameters: { prompt: input },
        confidence: 0.85,
      };
    }

    // Automation keywords
    if (
      lowerInput.startsWith('book') ||
      lowerInput.startsWith('schedule') ||
      lowerInput.startsWith('fill') ||
      lowerInput.startsWith('automate') ||
      lowerInput.includes('form')
    ) {
      return {
        mode: 'automate',
        action: 'execute_task',
        parameters: { task: input },
        confidence: 0.8,
      };
    }

    // Memory/recall keywords
    if (
      lowerInput.startsWith('remember') ||
      lowerInput.startsWith('recall') ||
      lowerInput.startsWith('show me') ||
      lowerInput.includes('yesterday') ||
      lowerInput.includes('last week')
    ) {
      return {
        mode: 'memory',
        action: 'recall',
        parameters: { query: input },
        confidence: 0.75,
      };
    }

    // Default to research for questions
    return {
      mode: 'research',
      action: 'search',
      parameters: { query: input },
      confidence: 0.7,
    };
  }

  /**
   * Check if string is a URL
   */
  private static isURL(str: string): boolean {
    try {
      new URL(str.includes('://') ? str : `https://${str}`);
      return (
        str.includes('.') &&
        (str.includes('://') ||
          str.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/) !== null)
      );
    } catch {
      return false;
    }
  }

  /**
   * Normalize URL (add protocol if missing)
   */
  private static normalizeURL(url: string): string {
    if (!url.includes('://')) {
      return `https://${url}`;
    }
    return url;
  }

  /**
   * Query AI assistant (can be connected to OpenAI, Anthropic, or local models)
   */
  static async query(
    prompt: string,
    context?: any
  ): Promise<{ response: string; sources?: string[] }> {
    // In production, this would call the actual AI service
    // For now, use the Electron IPC bridge

    if (window.electron?.ai) {
      try {
        const result = await window.electron.ai.query(prompt, context);
        return {
          response: result.response,
          sources: [],
        };
      } catch (error) {
        console.error('AI query failed:', error);
        return {
          response: 'I encountered an issue processing your request.',
          sources: [],
        };
      }
    }

    // Fallback mock response
    return {
      response: `I understand you're asking about: "${prompt}". To connect to a real AI service, please configure your API key in Settings.`,
      sources: [],
    };
  }

  /**
   * Summarize webpage content
   */
  static async summarizePage(
    url: string,
    content?: string
  ): Promise<{ summary: string; keyPoints: string[] }> {
    const prompt = `Summarize the following webpage from ${url}:\n\n${content?.slice(0, 5000) || 'No content provided'}`;

    const result = await this.query(prompt);

    return {
      summary: result.response,
      keyPoints: [], // Extract from structured response in production
    };
  }

  /**
   * Generate writing assistance
   */
  static async assistWriting(
    prompt: string,
    context?: string
  ): Promise<string> {
    const fullPrompt = context
      ? `Context: ${context}\n\nTask: ${prompt}`
      : prompt;

    const result = await this.query(fullPrompt);
    return result.response;
  }

  /**
   * Extract structured data from page
   */
  static async extractData(
    content: string,
    schema: string
  ): Promise<Record<string, any>> {
    const prompt = `Extract the following information from this content: ${schema}\n\nContent: ${content.slice(0, 3000)}`;

    const result = await this.query(prompt);

    // In production, parse structured response
    return {
      extracted: result.response,
    };
  }
}
