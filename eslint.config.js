import js from '@eslint/js';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'src/pages/ListaDePostagens.jsx', 'src/pages/DetalhesDaPostagem.jsx', 'src/pages/EdicaoDePostagem.jsx', 'src/pages/ExcluirPostagem.jsx', 'src/pages/FormularioCadastro.jsx', 'src/pages/apiConfig.jsx', 'src/App.js', 'src/index.js'] },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': hooks },
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: globals.browser },
    rules: { ...js.configs.recommended.rules, ...hooks.configs.recommended.rules, 'no-unused-vars': 'off' }
  }
];
