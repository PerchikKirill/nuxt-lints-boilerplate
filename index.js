#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Пакеты для установки
const devDependencies = [
    'stylelint',
    'stylelint-config-html',
    'stylelint-config-rational-order-fix',
    'stylelint-config-recess-order',
    'stylelint-config-recommended-vue',
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue',
    'stylelint-order',
    '@nuxt/eslint',
    '@nuxt/eslint-config',
    'eslint'
];

// Определяем пакетный менеджер
function detectPackageManager() {
    if (fs.existsSync('yarn.lock')) {
        return 'yarn';
    } else if (fs.existsSync('pnpm-lock.yaml')) {
        return 'pnpm';
    } else if (fs.existsSync('bun.lockb')) {
        return 'bun';
    } else {
        return 'npm';
    }
}

// Установка зависимостей
function installDependencies(packageManager) {
    console.log(chalk.blue('📦 Установка зависимостей...'));

    const packageList = devDependencies.join(' ');

    try {
        switch (packageManager) {
            case 'yarn':
                execSync(`yarn add -D ${packageList}`, { stdio: 'inherit' });
                break;
            case 'pnpm':
                execSync(`pnpm add -D ${packageList}`, { stdio: 'inherit' });
                break;
            case 'bun':
                execSync(`bun add -D ${packageList}`, { stdio: 'inherit' });
                break;
            default:
                execSync(`npm install --save-dev ${packageList}`, { stdio: 'inherit' });
        }
        console.log(chalk.green('✅ Зависимости успешно установлены!'));
    } catch (error) {
        console.error(chalk.red('❌ Ошибка при установке зависимостей:'), error.message);
        process.exit(1);
    }
}

// Копирование файлов шаблонов
function copyTemplateFiles() {
    const templateDir = path.join(__dirname, 'templates');
    const files = [
        { from: '.stylelintignore', to: '.stylelintignore' },
        { from: '.stylelintrc.json', to: '.stylelintrc.json' },
        { from: 'eslint.config.mjs', to: 'eslint.config.mjs' }
    ];

    files.forEach(file => {
        const sourcePath = path.join(templateDir, file.from);
        const targetPath = file.to;

        try {
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(chalk.green(`✅ Создан файл ${file.to}`));
            } else {
                console.log(chalk.yellow(`⚠️  Шаблон ${file.from} не найден`));
            }
        } catch (error) {
            console.error(chalk.red(`❌ Ошибка при копировании ${file.from}:`), error.message);
        }
    });
}

// Обновление nuxt.config
function updateNuxtConfig() {
    const configPaths = ['nuxt.config.js', 'nuxt.config.ts', 'nuxt.config.mjs'];
    let configPath = null;

    for (const path of configPaths) {
        if (fs.existsSync(path)) {
            configPath = path;
            break;
        }
    }

    if (!configPath) {
        console.log(chalk.yellow('⚠️  Файл nuxt.config не найден. Создайте его вручную.'));
        return;
    }

    try {
        let content = fs.readFileSync(configPath, 'utf8');

        // Проверяем, есть ли уже @nuxt/eslint в модулях
        if (content.includes('@nuxt/eslint')) {
            console.log(chalk.yellow('⚠️  @nuxt/eslint уже добавлен в nuxt.config'));
            return;
        }

        // Ищем секцию modules и добавляем @nuxt/eslint
        const moduleRegex = /modules\s*:\s*\[([\s\S]*?)\]/;
        const match = content.match(moduleRegex);

        if (match) {
            const modules = match[1].trim();
            let newModules;

            if (modules) {
                // Убираем лишние запятые в конце и пробелы
                const cleanModules = modules.replace(/,\s*$/, '');
                newModules = `${cleanModules},\n    '@nuxt/eslint'`;
            } else {
                newModules = `'@nuxt/eslint'`;
            }

            content = content.replace(moduleRegex, `modules: [\n    ${newModules}\n  ]`);
        } else {
            // Если секции modules нет, добавляем её
            const exportRegex = /export\s+default\s+defineNuxtConfig\s*\(\s*\{([\s\S]*?)\}\s*\)/;
            const exportMatch = content.match(exportRegex);

            if (exportMatch) {
                const configContent = exportMatch[1].trim();
                const newConfigContent = configContent ?
                    `${configContent},\n  modules: [\n    '@nuxt/eslint'\n  ]` :
                    `modules: [\n    '@nuxt/eslint'\n  ]`;

                content = content.replace(exportRegex,
                    `export default defineNuxtConfig({\n  ${newConfigContent}\n})`
                );
            }
        }

        fs.writeFileSync(configPath, content);
        console.log(chalk.green('✅ Обновлен файл nuxt.config'));
    } catch (error) {
        console.error(chalk.red('❌ Ошибка при обновлении nuxt.config:'), error.message);
        console.log(chalk.yellow('⚠️  Добавьте @nuxt/eslint в modules вручную'));
    }
}

// Обновление скриптов в package.json
function updatePackageScripts() {
    try {
        const packageJsonPath = 'package.json';
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Базовые скрипты
        const baseScripts = {
            'lint:fix': 'eslint ./src --fix',
            'lint:style:fix': 'stylelint "src/**/*.{css,scss,vue}" --cache --fix'
        };

        // Проверяем наличие папки layers
        const hasLayers = fs.existsSync('layers');

        // Скрипты для layers
        const layersScripts = {
            'lint:layers:fix': 'eslint ./layers --fix',
            'lint:layers:style:fix': 'stylelint "layers/**/*.{css,scss,vue}" --cache --fix'
        };

        // Инициализируем scripts если их нет
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }

        // Добавляем базовые скрипты
        Object.assign(packageJson.scripts, baseScripts);

        // Добавляем скрипты для layers если папка существует
        if (hasLayers) {
            Object.assign(packageJson.scripts, layersScripts);
            console.log(chalk.blue('📁 Обнаружена папка layers - добавлены дополнительные скрипты'));
        }

        // Сохраняем обновленный package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(chalk.green('✅ Обновлены скрипты в package.json'));

        // Показываем добавленные скрипты
        console.log(chalk.blue('📝 Добавленные скрипты:'));
        Object.entries(baseScripts).forEach(([key, value]) => {
            console.log(chalk.blue(`   "${key}": "${value}"`));
        });

        if (hasLayers) {
            Object.entries(layersScripts).forEach(([key, value]) => {
                console.log(chalk.blue(`   "${key}": "${value}"`));
            });
        }

    } catch (error) {
        console.error(chalk.red('❌ Ошибка при обновлении скриптов:'), error.message);
    }
}

// Основная функция
async function main() {
    console.log(chalk.blue.bold('🚀 Настройка ESLint и Stylelint для Nuxt проекта'));
    console.log('');

    // Проверяем, что мы в Nuxt проекте
    if (!fs.existsSync('package.json')) {
        console.error(chalk.red('❌ Файл package.json не найден. Убедитесь, что вы находитесь в корне проекта.'));
        process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.devDependencies?.nuxt && !packageJson.dependencies?.nuxt) {
        console.error(chalk.red('❌ Nuxt не найден в зависимостях. Убедитесь, что это Nuxt проект.'));
        process.exit(1);
    }

    // Определяем пакетный менеджер
    const packageManager = detectPackageManager();
    console.log(chalk.blue(`📋 Обнаружен пакетный менеджер: ${packageManager}`));

    // Выполняем установку и настройку
    installDependencies(packageManager);
    copyTemplateFiles();
    updateNuxtConfig();
    updatePackageScripts();

    console.log('');
    console.log(chalk.green.bold('🎉 Настройка завершена успешно!'));
    console.log('');
    console.log(chalk.blue('📝 Что было сделано:'));
    console.log(chalk.blue('   • Установлены все необходимые пакеты'));
    console.log(chalk.blue('   • Созданы файлы конфигурации линтеров'));
    console.log(chalk.blue('   • Обновлен nuxt.config (добавлен @nuxt/eslint)'));
    console.log(chalk.blue('   • Добавлены скрипты в package.json'));
    console.log('');
    console.log(chalk.yellow('💡 Для запуска линтеров используйте:'));
    console.log(chalk.yellow('   npm run lint:fix - исправить код'));
    console.log(chalk.yellow('   npm run lint:style:fix - исправить стили'));

    if (fs.existsSync('layers')) {
        console.log(chalk.yellow('   npm run lint:layers:fix - исправить код в layers'));
        console.log(chalk.yellow('   npm run lint:layers:style:fix - исправить стили в layers'));
    }
}

// Запуск
main().catch(console.error);
