import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  [process.env.npm_execpath, 'install', '--include=optional'],
  {
    stdio: 'inherit',
  },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
