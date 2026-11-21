const esbuild = require('esbuild');

module.exports = {
  process(src, filename) {
    const result = esbuild.transformSync(src, {
      loader: 'js',
      format: 'cjs',
      sourcefile: filename,
    });
    return { code: result.code };
  },
};