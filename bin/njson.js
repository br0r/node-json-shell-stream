#!/usr/bin/env node
var split = require('split');
var Writable = require('stream').Writable;
var spawn = require('child_process').spawn;

var cmd = process.argv[2];
if (!cmd) exit('No cmd');

var w = new Writable({
  objectMode: true,
  write: function (chunk, enc, next) {
    var c = spawn(cmd, { shell: true, stdio: ['pipe', 'inherit', 'inherit'] });
    c.stdin.write(JSON.stringify(chunk));
    c.stdin.end();
    next();
  },
});

process.stdin
  .pipe(split(JSON.parse, null, { trailing: false }))
  .on('error', exit)
  .pipe(w)
  .on('error', exit);

function exit(msg) {
  console.error(msg);
  process.exit(msg ? 1 : 0);
}
