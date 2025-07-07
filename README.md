# Create Nuxt Linter Config

Инструмент для автоматической настройки ESLint и Stylelint в Nuxt проектах.

## Установка

```bash
npm install -g create-nuxt-linter-config
```

Или используйте npx для одноразового использования:

```bash
npx create-nuxt-linter-config
```

## Что делает инструмент

### 📦 Устанавливает пакеты в devDependencies:
- `stylelint`
- `stylelint-config-html`
- `stylelint-config-rational-order-fix`
- `stylelint-config-recess-order`
- `stylelint-config-recommended-vue`
- `stylelint-config-standard`
- `stylelint-config-standard-scss`
- `stylelint-config-standard-vue`
- `stylelint-order`
- `@nuxt/eslint`
- `@nuxt/eslint-config`
- `eslint`

### 📁 Создает файлы конфигурации:
- `.stylelintignore`
- `.stylelintrc.json`
- `eslint.config.mjs`

### ⚙️ Обновляет nuxt.config:
- Добавляет `@nuxt/eslint` в секцию modules

## Поддерживаемые пакетные менеджеры

Инструмент автоматически определяет и использует:
- **npm** (по умолчанию)
- **yarn** (если найден yarn.lock)
- **pnpm** (если найден pnpm-lock.yaml)
- **bun** (если найден bun.lockb)

## Использование

1. Перейдите в корень вашего Nuxt проекта
2. Запустите команду:
   ```bash
   npx create-nuxt-linter-config
   ```

## Требования

- Node.js 14.0.0+
- Nuxt проект

## Лицензия

MIT
