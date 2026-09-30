// Cucumber loads this shared configuration for both runner.ts and direct CLI use.
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['hooks/**/*.ts', 'step-definitions/**/*.ts'],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
  },
};