/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  singleAttributePerLine: true,
};

module.exports = config;
