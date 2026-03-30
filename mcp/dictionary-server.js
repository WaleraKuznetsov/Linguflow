import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const DICTIONARY_API_KEY = process.env.DICTIONARY_API_KEY || '';

const server = new Server(
  {
    name: 'linguflow-dictionary',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'translate_word',
        description: 'Перевести слово с одного языка на другой',
        inputSchema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'Слово для перевода' },
            from: { type: 'string', description: 'Язык исходного текста (en, ru, es, de, fr)' },
            to: { type: 'string', description: 'Язык перевода (en, ru, es, de, fr)' },
          },
          required: ['text', 'from', 'to'],
        },
      },
      {
        name: 'get_word_definition',
        description: 'Получить определение слова с примерами использования',
        inputSchema: {
          type: 'object',
          properties: {
            word: { type: 'string', description: 'Слово для определения' },
            language: { type: 'string', description: 'Язык слова (en, ru, es, de, fr)' },
          },
          required: ['word', 'language'],
        },
      },
      {
        name: 'get_word_synonyms',
        description: 'Получить синонимы слова',
        inputSchema: {
          type: 'object',
          properties: {
            word: { type: 'string', description: 'Слово для поиска синонимов' },
            language: { type: 'string', description: 'Язык слова (en, ru, es, de, fr)' },
          },
          required: ['word', 'language'],
        },
      },
      {
        name: 'get_word_examples',
        description: 'Получить примеры использования слова в предложениях',
        inputSchema: {
          type: 'object',
          properties: {
            word: { type: 'string', description: 'Слово для примеров' },
            language: { type: 'string', description: 'Язык слова (en, ru, es, de, fr)' },
          },
          required: ['word', 'language'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'translate_word') {
      const { text, from, to } = args;
      // Используем бесплатный API (можно заменить на DeepL, Google Translate API)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`
      );
      const data = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              original: text,
              translation: data.responseData?.translatedText || 'Перевод не найден',
              from,
              to,
              quality: data.responseData?.quality || 'unknown',
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'get_word_definition') {
      const { word, language } = args;
      // Free Dictionary API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`);
      if (!response.ok) {
        return {
          content: [{ type: 'text', text: `Определение не найдено для слова "${word}"` }],
          isError: true,
        };
      }
      const data = await response.json();
      const definition = data[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'Не найдено';
      const example = data[0]?.meanings?.[0]?.definitions?.[0]?.example || '';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ word, definition, example, language }, null, 2),
          },
        ],
      };
    }

    if (name === 'get_word_synonyms') {
      const { word, language } = args;
      // Используем Datamuse API для синонимов
      const response = await fetch(
        `https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=10`
      );
      const data = await response.json();
      const synonyms = data.map((item) => item.word);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ word, synonyms, language }, null, 2),
          },
        ],
      };
    }

    if (name === 'get_word_examples') {
      const { word, language } = args;
      // Примеры через Sentence API
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=e&max=5`
      );
      const data = await response.json();
      const examples = data.map((item) => item.tags?.e || 'Пример недоступен');
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ word, examples, language }, null, 2),
          },
        ],
      };
    }

    return {
      content: [{ type: 'text', text: `Неизвестный инструмент: ${name}` }],
      isError: true,
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Ошибка: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LinguFlow Dictionary MCP Server запущен...');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
