import { test_01 } from './design';
import { tokenizer } from './complier';
var assert = require('assert');
var result;
result = tokenizer(test_01.input)
console.log(result)
assert.deepStrictEqual(result, test_01.output,
    'Tokenizer should turn `input` string into `tokens` array'
)