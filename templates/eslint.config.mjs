import { createConfigForNuxt } from '@nuxt/eslint-config';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  createConfigForNuxt({
    features: {
      stylistic: {
        semi: true,
        quotes: 'single',
        indent: 2,
        commaDangle: 'always-multiline',
        quoteProps: 'as-needed',
        blockSpacing: true,
      },
    },
  }),
  {
    rules: {
      //   Base
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'comma-style': ['error', 'last'],
      'object-curly-spacing': ['error', 'always'],
      'no-irregular-whitespace': 'off',

      // Vue
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 2,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below',
        },
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          closeBracket: 0,
          alignAttributesVertically: true,
        },
      ],
      'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
      'vue/no-duplicate-attributes': [
        'error',
        {
          allowCoexistClass: true,
          allowCoexistStyle: true,
        },
      ],
      'vue/no-multi-spaces': [
        'error',
        {
          ignoreProperties: false,
        },
      ],
      'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
          ignore: [],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/object-curly-spacing': ['error', 'always'],
      'vue/no-v-html': 'off',
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],

      // TypeScript
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  },
);
