import js from '@eslint/js';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts'],
  },

  js.configs.recommended,

  // Vem antes do bloco TS: o config do Next define seu próprio parser, e o
  // bloco seguinte precisa poder sobrescrevê-lo pelo parser type-aware.
  ...nextCoreWebVitals,

  {
    // Regras com type-checking só nos arquivos que fazem parte do programa TS.
    // Elas pegam o que o lint sintático não vê: promise sem await, comparação
    // impossível, `any` escapando de um SDK.
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // O checkout lida com dinheiro e webhooks: promise solta é bug silencioso.
      '@typescript-eslint/no-floating-promises': 'error',
      // Erro (não warning) para não deixar variável morta chegar em produção;
      // prefixo _ é a válvula de escape para o que é ignorado de propósito.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Precisa ser o último: desliga tudo que conflita com o Prettier.
  prettier
);
