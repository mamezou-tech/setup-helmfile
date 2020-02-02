const cp = require('child_process');
const path = require('path');

test('test runs', () => {
  const ip = path.join(__dirname, '../dist/index.js');
  console.log(cp.execSync(`node ${ip}`).toString());
})
