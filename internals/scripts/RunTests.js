import spawn from 'cross-spawn';
import path from 'path';

const pattern = 'test/[^/]+/.+\\.spec\\.js$';

const result = spawn.sync(
  path.normalize('./node_modules/.bin/jest'),
  [pattern],
  { stdio: 'inherit' }
);

process.exit(result.status);
