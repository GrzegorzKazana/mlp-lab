const path = require('path');

// list of dependencies that need to be transpiled
const es6deps = ['fp-ts/es6'];

require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
  cwd: path.join(__dirname, '..', '..'),
  ignore: [
    filePath =>
      filePath.includes('node_modules') &&
      !es6deps.some(dep => filePath.includes(dep)),
  ],
});
