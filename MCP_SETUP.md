# 🚀 LinguFlow MCP Настройка

## ✅ Установленные MCP серверы

| Сервер | Описание | Статус |
|--------|----------|--------|
| `@jpisnice/shadcn-ui-mcp-server` | Компоненты shadcn/ui | ✅ Установлен |
| `linguflow-dictionary` | Кастомный API словарей | ✅ Создан |
| `filesystem` | Работа с файлами | 🔄 Требуется установка |
| `sqlite` | База данных SQLite | 🔄 Требуется установка |

---

## 📋 Как использовать MCP

### 1. **Для Cursor IDE**

Открой настройки Cursor (`Ctrl+,`) → **MCP** → добавь пути:

```json
{
  "mcp": {
    "servers": {
      "shadcn-ui": {
        "command": "npx",
        "args": ["-y", "@jpisnice/shadcn-ui-mcp-server"],
        "cwd": "c:\\Users\\Валера\\Desktop\\МДП проект\\pr2\\linguflow"
      },
      "linguflow-dictionary": {
        "command": "node",
        "args": ["mcp/dictionary-server.js"],
        "cwd": "c:\\Users\\Валера\\Desktop\\МДП проект\\pr2\\linguflow"
      }
    }
  }
}
```

### 2. **Для Windsurf IDE**

Создай файл `.windsurf/mcp.json` в проекте:

```json
{
  "servers": [
    {
      "name": "shadcn-ui",
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server"]
    },
    {
      "name": "linguflow-dictionary",
      "command": "node",
      "args": ["mcp/dictionary-server.js"]
    }
  ]
}
```

### 3. **Для Claude Desktop**

Добавь в `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "@jpisnice/shadcn-ui-mcp-server"],
      "env": {
        "WORKING_DIRECTORY": "c:\\Users\\Валера\\Desktop\\МДП проект\\pr2\\linguflow"
      }
    },
    "linguflow-dictionary": {
      "command": "node",
      "args": ["mcp/dictionary-server.js"],
      "env": {
        "WORKING_DIRECTORY": "c:\\Users\\Валера\\Desktop\\МДП проект\\pr2\\linguflow"
      }
    }
  }
}
```

---

## 🛠️ Доступные инструменты Dictionary MCP

После подключения ты можешь использовать:

### `translate_word`
```
Перевести слово с одного языка на другой
Параметры: text, from (en|ru|es|de|fr), to (en|ru|es|de|fr)
```

### `get_word_definition`
```
Получить определение слова с примерами
Параметры: word, language (en|ru|es|de|fr)
```

### `get_word_synonyms`
```
Получить синонимы слова
Параметры: word, language
```

### `get_word_examples`
```
Получить примеры использования в предложениях
Параметры: word, language
```

---

## 📦 Установка дополнительных MCP серверов

### Filesystem MCP (для работы с файлами)
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

### SQLite MCP (для базы данных)
```bash
npm install -g @modelcontextprotocol/server-sqlite
```

### Puppeteer MCP (для тестирования UI)
```bash
npm install -g @modelcontextprotocol/server-puppeteer
```

---

## 🎯 Примеры запросов для Qwen

Теперь ты можешь писать такие запросы:

```
«Добавь компонент Button из shadcn/ui в проект»
«Переведи слово "apple" с английского на русский через MCP»
«Создай карточку слова с определением и синонимами»
«Добавь страницу Settings с использованием shadcn компонентов»
«Найди все файлы с расширением .jsx в src/»
```

---

## ⚙️ Запуск MCP серверов вручную (для тестирования)

```bash
# shadcn-ui MCP
npx -y @jpisnice/shadcn-ui-mcp-server

# Dictionary MCP
node mcp/dictionary-server.js
```

---

## 🔑 API ключи (опционально)

Для расширенных функций перевода получи API ключи:

- **DeepL API**: https://www.deepl.com/pro-api
- **Google Translate API**: https://cloud.google.com/translate

Добавь ключ в `.env`:
```
DEEPL_API_KEY=your_key_here
GOOGLE_TRANSLATE_API_KEY=your_key_here
```
