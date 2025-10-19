# nuxt-lints-boilerplate

Инструмент для автоматической настройки ESLint и Stylelint в Nuxt проектах.

## Установка

```bash
npx git@github.com:PerchikKirill/nuxt-lints-boilerplate.git
```

## Возможности

### 🔍 Умная установка
- Автоматически определяет существующие пакеты ESLint и Stylelint
- Предлагает удалить конфликтующие пакеты перед установкой новых
- Обнаруживает Prettier и предлагает его удалить (включая конфигурацию)
- Интерактивные подсказки для управления процессом установки

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
- `typescript`

### 📁 Создает файлы конфигурации:
- `.stylelintignore`
- `.stylelintrc.json`
- `eslint.config.mjs`

### ⚙️ Обновляет проект:
- Добавляет `@nuxt/eslint` в секцию modules в nuxt.config
- Добавляет скрипты lint в package.json:
  - `lint:fix` - исправить код в app/src
  - `lint:style:fix` - исправить стили в app/src
  - `lint:layers:fix` - исправить код в layers (если папка существует)
  - `lint:layers:style:fix` - исправить стили в layers (если папка существует)

## Поддерживаемые пакетные менеджеры

Инструмент автоматически определяет и использует:
- **npm** (по умолчанию)
- **yarn** (если найден yarn.lock)
- **pnpm** (если найден pnpm-lock.yaml)
- **bun** (если найден bun.lockb)

## Использование

### Полная установка

Перейдите в корень вашего Nuxt проекта и запустите:

```bash
npx git@github.com:PerchikKirill/nuxt-lints-boilerplate.git
```

При наличии существующих пакетов линтеров или Prettier, инструмент предложит:
- Удалить старые пакеты ESLint и установить новые
- Удалить старые пакеты Stylelint и установить новые
- Удалить Prettier и все его конфигурационные файлы

### Обновление только конфигурационных файлов

Если нужно только обновить конфигурационные файлы без установки пакетов:

```bash
npx git@github.com:PerchikKirill/nuxt-lints-boilerplate.git -configs
```

Этот режим обновит только:
- `.stylelintignore`
- `.stylelintrc.json`
- `eslint.config.mjs`

## Интерактивный режим

При обнаружении существующих пакетов линтеров или Prettier, инструмент спросит:

```
⚠️  Обнаружены существующие пакеты ESLint:
   • eslint
   • eslint-config-airbnb
   • eslint-plugin-vue
Удалить их и установить новые? (y/n):
```

```
⚠️  Обнаружен Prettier:
   • prettier
   • eslint-config-prettier
   • eslint-plugin-prettier
   Prettier может конфликтовать с настройками линтеров.
Удалить Prettier и его конфигурацию? (y/n):
```

Просто введите `y` (yes) или `n` (no) для каждого варианта.

## Запуск линтеров

После установки используйте добавленные скрипты:

```bash
# Исправить код в app/src
npm run lint:fix

# Исправить стили в app/src
npm run lint:style:fix

# Если есть папка layers:
npm run lint:layers:fix
npm run lint:layers:style:fix
```

## Требования

- Node.js 18.0.0+
- Nuxt проект
- Наличие `package.json` в корне проекта

## Что будет удалено при выборе очистки

### ESLint пакеты:
- `eslint-config-prettier`
- `eslint-plugin-prettier`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-airbnb`
- `eslint-config-standard`
- `eslint-plugin-vue`
- `eslint-plugin-import`
- `eslint-plugin-node`
- `eslint-plugin-promise`

### Stylelint пакеты:
- `stylelint-config-prettier`
- `stylelint-prettier`

### Prettier:
- Все пакеты Prettier
- Конфигурационные файлы (`.prettierrc`, `.prettierrc.json`, `prettier.config.js` и т.д.)
- Секция `prettier` из `package.json`

## Troubleshooting

### Конфликт с существующими настройками

Если у вас уже есть настроенные ESLint или Stylelint, инструмент предложит удалить старые пакеты. Рекомендуется:
1. Сделать backup вашей текущей конфигурации
2. Согласиться на удаление старых пакетов
3. Проверить работу новой конфигурации
4. При необходимости внести изменения в созданные конфигурационные файлы

### Prettier конфликтует с линтерами

Prettier форматирует код по своим правилам, которые могут конфликтовать с ESLint и Stylelint. Рекомендуется удалить Prettier при установке этого инструмента для избежания конфликтов.
