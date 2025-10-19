#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');
const readline = require('readline');

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
    'eslint',
    'typescript'
];

// Пакеты, которые могут конфликтовать
const conflictingPackages = {
    eslint: [
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-config-airbnb',
        'eslint-config-standard',
        'eslint-plugin-vue',
        'eslint-plugin-import',
        'eslint-plugin-node',
        'eslint-plugin-promise'
    ],
    stylelint: [
        'stylelint-config-prettier',
        'stylelint-prettier'
    ],
    prettier: [
        'prettier',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        'stylelint-config-prettier',
        'stylelint-prettier'
    ]
};

// Конфигурационные файлы prettier
const prettierFiles = [
    '.prettierrc',
    '.prettierrc.json',
    '.prettierrc.js',
    '.prettierrc.cjs',
    '.prettierrc.mjs',
    '.prettierrc.yml',
    '.prettierrc.yaml',
    'prettier.config.js',
    'prettier.config.cjs',
    'prettier.config.mjs',
    '.prettierignore'
];

// Создаем интерфейс для ввода
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Утилита для вопросов
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

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

// Проверка наличия пакетов в проекте
function checkInstalledPackages() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    const found = {
        eslint: [],
        stylelint: [],
        prettier: []
    };

    // Проверяем eslint пакеты
    if (allDeps.eslint) {
        found.eslint.push('eslint');
        conflictingPackages.eslint.forEach(pkg => {
            if (allDeps[pkg]) found.eslint.push(pkg);
        });
    }

    // Проверяем stylelint пакеты
    if (allDeps.stylelint) {
        found.stylelint.push('stylelint');
        conflictingPackages.stylelint.forEach(pkg => {
            if (allDeps[pkg]) found.stylelint.push(pkg);
        });
    }

    // Проверяем prettier
    conflictingPackages.prettier.forEach(pkg => {
        if (allDeps[pkg]) found.prettier.push(pkg);
    });

    return found;
}

// Удаление пакетов
function removePackages(packages, packageManager) {
    if (packages.length === 0) return;

    console.log(chalk.blue(`🗑️  Удаление пакетов: ${packages.join(', ')}`));

    const packageList = packages.join(' ');

    try {
        switch (packageManager) {
            case 'yarn':
                execSync(`yarn remove ${packageList}`, { stdio: 'inherit' });
                break;
            case 'pnpm':
                execSync(`pnpm remove ${packageList}`, { stdio: 'inherit' });
                break;
            case 'bun':
                execSync(`bun remove ${packageList}`, { stdio: 'inherit' });
                break;
            default:
                execSync(`npm uninstall ${packageList}`, { stdio: 'inherit' });
        }
        console.log(chalk.green('✅ Пакеты успешно удалены!'));
    } catch (error) {
        console.error(chalk.red('❌ Ошибка при удалении пакетов:'), error.message);
    }
}

// Удаление конфигурационных файлов prettier
function removePrettierConfigs() {
    let removed = [];
    prettierFiles.forEach(file => {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
                removed.push(file);
            } catch (error) {
                console.error(chalk.red(`❌ Не удалось удалить ${file}:`), error.message);
            }
        }
    });

    if (removed.length > 0) {
        console.log(chalk.green(`✅ Удалены файлы Prettier: ${removed.join(', ')}`));
    }

    // Также проверяем package.json на наличие prettier конфигурации
    try {
        const packageJsonPath = 'package.json';
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (packageJson.prettier) {
            delete packageJson.prettier;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
            console.log(chalk.green('✅ Удалена конфигурация Prettier из package.json'));
        }
    } catch (error) {
        console.error(chalk.red('❌ Ошибка при очистке package.json:'), error.message);
    }
}

// Обработка конфликтующих пакетов
async function handleConflictingPackages(installedPackages, packageManager) {
    let packagesToRemove = [];

    // Проверяем ESLint
    if (installedPackages.eslint.length > 0) {
        console.log(chalk.yellow('\n⚠️  Обнаружены существующие пакеты ESLint:'));
        installedPackages.eslint.forEach(pkg => console.log(chalk.yellow(`   • ${pkg}`)));
        
        const answer = await question(chalk.cyan('Удалить их и установить новые? (y/n): '));
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            packagesToRemove.push(...installedPackages.eslint);
        }
    }

    // Проверяем Stylelint
    if (installedPackages.stylelint.length > 0) {
        console.log(chalk.yellow('\n⚠️  Обнаружены существующие пакеты Stylelint:'));
        installedPackages.stylelint.forEach(pkg => console.log(chalk.yellow(`   • ${pkg}`)));
        
        const answer = await question(chalk.cyan('Удалить их и установить новые? (y/n): '));
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            packagesToRemove.push(...installedPackages.stylelint);
        }
    }

    // Проверяем Prettier
    if (installedPackages.prettier.length > 0) {
        console.log(chalk.yellow('\n⚠️  Обнаружен Prettier:'));
        installedPackages.prettier.forEach(pkg => console.log(chalk.yellow(`   • ${pkg}`)));
        console.log(chalk.yellow('   Prettier может конфликтовать с настройками линтеров.'));
        
        const answer = await question(chalk.cyan('Удалить Prettier и его конфигурацию? (y/n): '));
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            packagesToRemove.push(...installedPackages.prettier);
            removePrettierConfigs();
        }
    }

    // Удаляем выбранные пакеты
    if (packagesToRemove.length > 0) {
        // Убираем дубликаты
        packagesToRemove = [...new Set(packagesToRemove)];
        removePackages(packagesToRemove, packageManager);
    }
}

// Установка зависимостей
function installDependencies(packageManager) {
    console.log(chalk.blue('\n📦 Установка зависимостей...'));

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
    console.log(chalk.blue('\n📝 Обновление конфигурационных файлов...'));
    
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
                console.log(chalk.green(`✅ Обновлен файл ${file.to}`));
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
                newModules = `${cleanModules},\n    '@nuxt/eslint',`;
            } else {
                newModules = `'@nuxt/eslint',`;
            }

            content = content.replace(moduleRegex, `modules: [\n    ${newModules}\n  ]`);
        } else {
            // Если секции modules нет, добавляем её
            const exportRegex = /export\s+default\s+defineNuxtConfig\s*\(\s*\{([\s\S]*?)\}\s*\)/;
            const exportMatch = content.match(exportRegex);

            if (exportMatch) {
                const configContent = exportMatch[1].trim();
                const newConfigContent = configContent ?
                    `${configContent},\n  modules: [\n    '@nuxt/eslint',\n  ]` :
                    `modules: [\n    '@nuxt/eslint',\n  ]`;

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
function updatePackageScripts(sourceDir) {
    try {
        const packageJsonPath = 'package.json';
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Базовые скрипты
        const baseScripts = {
            'lint:fix': `eslint ./${sourceDir} --fix`,
            'lint:style:fix': `stylelint "${sourceDir}/**/*.{css,scss,vue}" --cache --fix`
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
    // Проверяем флаги
    const args = process.argv.slice(2);
    const configsOnly = args.includes('-configs') || args.includes('--configs');

    console.log(chalk.blue.bold('🚀 Настройка ESLint и Stylelint для Nuxt проекта'));
    
    if (configsOnly) {
        console.log(chalk.cyan('⚙️  Режим: обновление только конфигурационных файлов'));
    }
    
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

    // Определяем основную папку (src или app)
    const sourceDir = fs.existsSync('app') ? 'app' : 'src';
    console.log(chalk.blue(`📁 Основная папка проекта: ${sourceDir}`));

    // Если режим только конфигов - копируем файлы и выходим
    if (configsOnly) {
        copyTemplateFiles();
        console.log('');
        console.log(chalk.green.bold('🎉 Конфигурационные файлы успешно обновлены!'));
        rl.close();
        return;
    }

    // Определяем пакетный менеджер
    const packageManager = detectPackageManager();
    console.log(chalk.blue(`📋 Обнаружен пакетный менеджер: ${packageManager}`));

    // Проверяем существующие пакеты
    const installedPackages = checkInstalledPackages();
    
    // Обрабатываем конфликтующие пакеты
    await handleConflictingPackages(installedPackages, packageManager);

    // Выполняем установку и настройку
    installDependencies(packageManager);
    copyTemplateFiles();
    updateNuxtConfig();
    updatePackageScripts(sourceDir);

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
    console.log(chalk.yellow(`   npm run lint:fix - исправить код в ${sourceDir}`));
    console.log(chalk.yellow(`   npm run lint:style:fix - исправить стили в ${sourceDir}`));

    if (fs.existsSync('layers')) {
        console.log(chalk.yellow('   npm run lint:layers:fix - исправить код в layers'));
        console.log(chalk.yellow('   npm run lint:layers:style:fix - исправить стили в layers'));
    }

    rl.close();
}

// Запуск
main().catch(error => {
    console.error(error);
    rl.close();
    process.exit(1);
});
