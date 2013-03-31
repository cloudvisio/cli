#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.0.2')
  .option('-c, --config <path>', 'set config path. defaults to ./cloudvisio.conf');

program
  .command('[json]')
  .description('Convert data to visualization')
  .option("-g, --graph", "Create Graph")
  .action(function(json, options){
    json = json || {};
    console.log('converting data %s', json);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ cloudvisio {{json}}');
    console.log('    $ cloudvisio {{json}} --graph');
    console.log();
  });

program.parse(process.argv);
