export default {
  '*.{ts,tsx}': () => 'tsc --noEmit',
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,scss}': ['prettier --write'],
  '*.md': ['markdownlint --fix', 'prettier --write'],
};
