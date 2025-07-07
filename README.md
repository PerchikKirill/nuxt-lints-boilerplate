# Create Nuxt Linter Config

Инструмент для автоматической настройки ESLint и Stylelint в Nuxt проектах.

## Установка

```bash
npx git@github.com:PerchikKirill/nuxt-lints-boilerplate.git
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
   npx git@github.com:PerchikKirill/nuxt-lints-boilerplate.git
   ```

## Требования

- Node.js 18.0.0+
- Nuxt проект
