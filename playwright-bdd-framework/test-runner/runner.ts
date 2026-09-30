// Cucumber is the BDD runner; this entry point forwards its CLI options unchanged.
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const cucumberCli = resolve(
  __dirname,
  '../node_modules/@cucumber/cucumber/bin/cucumber.js',
);
const cucumber = spawn(process.execPath, [cucumberCli, ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});

cucumber.on('error', (error) => {
  console.error(`Unable to start Cucumber: ${error.message}`);
  process.exitCode = 1;
});

cucumber.on('close', (code, signal) => {
  if (signal) {
    console.error(`Cucumber stopped by signal ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});