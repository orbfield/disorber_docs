module.exports = {
    resolve: {
      alias: {
        'node:crypto': 'crypto',
        'node:fs': false,
        'node:path': 'path',
        'node:url': 'url',
        'node:util': 'util',
        'node:stream': 'stream',
        'node:child_process': false,
        'node:vm': false
      }
    }
  };