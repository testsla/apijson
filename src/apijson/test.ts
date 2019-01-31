import { test_01 } from './design';
import { tokenizer } from './complier';
import { parser } from './parser';
import { transformer } from './transformer';
var assert = require('assert');
var result_01_tokens = tokenizer(test_01.input);
var result_01_parse = parser(result_01_tokens);
var result_01_transformer = transformer(result_01_parse);

assert.deepStrictEqual(result_01_tokens, test_01.tokens,
    'Tokenizer should turn `input` string into `tokens` array'
)
assert.deepStrictEqual(result_01_parse, test_01.ast,
    'Parser should turn `tokens` array into `ast`'
)
assert.deepStrictEqual(result_01_transformer, test_01.newAst, 'Transformer should turn `ast` into a `newAst`');