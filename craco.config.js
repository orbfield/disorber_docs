const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add loader for .mjs files
      webpackConfig.module.rules.unshift({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      });

      // Add specific loader for pyodide
      webpackConfig.module.rules.push({
        test: /node_modules\/pyodide/,
        loader: 'string-replace-loader',
        options: {
          search: 'node:',
          replace: '',
          flags: 'g'
        }
      });

      // Configure resolving
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: false,
        fs: false,
        'fs/promises': false,
        path: false,
        url: false,
        util: false,
        stream: false,
        'child_process': false,
        vm: false,
        process: require.resolve('process/browser.js'),
        buffer: require.resolve('buffer/')
      };

      // Add plugins
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: ['process/browser.js', 'default'],
          Buffer: ['buffer', 'Buffer']
        })
      );

      return webpackConfig;
    }
  }
};