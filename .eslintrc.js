module.exports = (() => {
  const { FlatCompat } = require('@eslint/eslintrc');
  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });
  // next/core-web-vitals 확장만 사용합니다.
  return [
    ...compat.extends('next/core-web-vitals'),
  ];
})();
