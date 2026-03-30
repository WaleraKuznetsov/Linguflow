# 🧩 LinguFlow MCP Quick START

## ✅ Что уже настроено

| Компонент | Статус |
|-----------|--------|
| shadcn-ui MCP сервер | ✅ Установлен |
| Dictionary MCP сервер | ✅ Создан |
| База данных SQLite | ✅ Инициализирована |
| MCP SDK | ✅ Установлен |

---

## 🎯 НАСТРОЙКА ЗА 2 МИНУТЫ

### Шаг 1: Добавь MCP в свой редактор

#### **Cursor** (рекомендуется)
1. Открой `Ctrl+Shift+P` → **MCP: Open Config**
2. Вставь:

```json
{
  "mcpServers": {
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
```

3. Перезапусти Cursor

#### **Claude Desktop**
1. Открой `%APPDATA%\Claude\claude_desktop_config.json`
2. Вставь ту же конфигурацию
3. Перезапусти Claude

---

### Шаг 2: Проверь работу MCP

Напиши в чате с Qwen:

```
Используй MCP shadcn-ui и добавь компонент Button на страницу
```

Или:

```
Переведи слово "language" с английского на русский через MCP dictionary
```

---

## 📁 Структура проекта

```
linguflow/
├── mcp/
│   └── dictionary-server.js    # Кастомный MCP для словарей
├── data/
│   ├── linguflow.db            # SQLite база данных
│   └── schema.sql              # Схема БД
├── scripts/
│   └── init-db.js              # Скрипт инициализации БД
├── mcp.json                    # Конфигурация MCP
├── MCP_SETUP.md                # Подробная документация
└── README.md                   # Этот файл
```

---

## 🔧 Доступные команды

```bash
# Запустить dev-сервер
npm run dev

# Запустить shadcn-ui MCP вручную
npm run mcp:shadcn

# Запустить Dictionary MCP вручную
npm run mcp:dictionary

# Пересоздать базу данных
npm run db:init
```

---

## 🤖 Примеры запросов для Qwen

### shadcn-ui компоненты
```
«Добавь кнопку из shadcn/ui на главную страницу»
«Создай форму входа с использованием shadcn компонентов»
«Добавь карточки из shadcn/ui для отображения колод»
```

### Dictionary API
```
«Переведи слово "education" с английского на русский»
«Найди синонимы для слова "learn"»
«Покажи примеры использования слова "language"»
«Получи определение слова "fluency"»
```

### Работа с файлами
```
«Создай компонент Header в src/components/Header.jsx»
«Найди все файлы .jsx в папке src»
«Покажи содержимое App.jsx»
```

### База данных
```
«Добавь таблицу users в базу данных»
«Покажи схему базы данных»
«Создай миграцию для добавления поля rating в cards»
```

---

## 🆘 Troubleshooting

### MCP сервер не подключается
1. Проверь путь в `mcp.json`
2. Убедись, что Node.js установлен
3. Перезапусти редактор

### Dictionary MCP не работает
```bash
# Проверь вручную
node mcp/dictionary-server.js
```

### Ошибки базы данных
```bash
# Пересоздай БД
rm data/linguflow.db
npm run db:init
```

---

## 📚 Документация

- [MCP_SETUP.md](./MCP_SETUP.md) — Подробная настройка
- [mcp.json](./mcp.json) — Конфигурация серверов
- [data/schema.sql](./data/schema.sql) — Схема базы данных

---

## 🔗 Полезные ссылки

- [shadcn/ui](https://ui.shadcn.com/) — UI компоненты
- [MCP Protocol](https://modelcontextprotocol.io/) — Документация MCP
- [Free Dictionary API](https://dictionaryapi.dev/) — API словарей
- [DeepL API](https://www.deepl.com/pro-api) — Платный перевод
