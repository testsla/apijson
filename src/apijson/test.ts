import { test_01 } from './design';
import { tokenizer } from './complier';
import { parser } from './parser';

var assert = require('assert');
var result_01_tokens = tokenizer(test_01.input);
var result_01_parse = parser(result_01_tokens);

assert.deepStrictEqual(result_01_tokens, test_01.tokens,
    'Tokenizer should turn `input` string into `tokens` array'
)
assert.deepStrictEqual(result_01_parse, test_01.ast,
    'Parser should turn `tokens` array into `ast`'
)