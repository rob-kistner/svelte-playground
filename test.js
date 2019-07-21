const v8n = require('v8n')

const test = 'Bread'

let valid = v8n()
  .string()
  .first('C')
  .testAll(test)

console.log(valid[0].rule)