import { CONSTANT } from './const';
import { Token } from './interface';
/**
 * ============================================================================
 *                                   (/^▽^)/
 *                            词法分析器（Tokenizer）!
 * ============================================================================
 */

/**
 * 我们从第一个阶段开始，即词法分析，使用的是词法分析器（Tokenizer）。
 *
 * 我们只是接收代码组成的字符串，然后把它们分割成 token 组成的数组。
 *
 *   User {id,name}   =>   [{ type: 'braces', value: '{' }, ...]
 */

// 我们从接收一个字符串开始，首先设置两个变量。
export function tokenizer(input:string):Array<Token> {

    // `current`变量类似指针，用于记录我们在代码字符串中的位置。
    var current = 0;

    // `tokens`数组是我们放置 token 的地方
    var tokens = [];

    // 首先我们创建一个 `while` 循环， `current` 变量会在循环中自增。
    // 
    // 我们这么做的原因是，由于 token 数组的长度是任意的，所以可能要在单个循环中多次
    // 增加 `current` 
    while (current < input.length) {

        // 我们在这里储存了 `input` 中的当前字符
        var char = input[current];

        // 要做的第一件事情就是检查是不是右大括号。这在之后将会用在 `CallExpressions` 中，
        // 但是现在我们关心的只是字符本身。
        //
        // 检查一下是不是一个左大括号。
        if (char === '{') {

            // 如果是，那么我们 push 一个 type 为 `braces`，value 为左大括号的对象。
            tokens.push({
                type: CONSTANT.SYMBOL_BRACES_FRONT,
                value: '{'
            });

            // 自增 `current`
            current++;

            // 结束本次循环，进入下一次循环
            continue;
        }

        // 然后我们检查是不是一个右大括号。这里做的时候和之前一样：检查右大括号、加入新的 token、
        // 自增 `current`，然后进入下一次循环。
        if (char === '}') {
            tokens.push({
                type: CONSTANT.SYMBOL_BRACES_REAR,
                value: '}'
            });
            current++;
            continue;
        }

        // 然后我们检查是不是一个逗号。这里做的时候和之前一样：检查右大括号、加入新的 token、
        // 自增 `current`，然后进入下一次循环。
        if (char === ',') {
            tokens.push({
                type: CONSTANT.SYMBOL_COMMA,
                value: ','
            });
            current++;
            continue;
        }

        // 继续，我们现在检查是不是空格。有趣的是，我们想要空格的本意是分隔字符，但这现在
        // 对于我们储存 token 来说不那么重要。我们暂且搁置它。
        // 
        // 所以我们只是简单地检查是不是空格，如果是，那么我们直接进入下一个循环。
        var WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // 下一个 token 的类型是数字。它和之前的 token 不同，因为数字可以由多个数字字符组成，
        // 但是我们只能把它们识别为一个 token。
        // 
        //   User(id:1,age:25){}
        //           ^     ^^
        //        Only two separate tokens
        //        这里只有两个 token
        //        
        // 当我们遇到一个数字字符时，将会从这里开始。
        var NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {

            // 创建一个 `value` 字符串，用于 push 字符。
            var value = '';

            // 然后我们循环遍历接下来的字符，直到我们遇到的字符不再是数字字符为止，把遇到的每
            // 一个数字字符 push 进 `value` 中，然后自增 `current`。
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            // 然后我们把类型为 `number` 的 token 放入 `tokens` 数组中。
            tokens.push({
                type: CONSTANT.NUMBER,
                value: value
            });

            // 进入下一次循环。
            continue;
        }

        // 最后一种类型的 token 是 `name`。它由一系列的字母组成，这在我们的 jsonQL 语法中
        // 代表了数据库表。
        //
        //    User { id, name }
        //    ^^^
        //    Name token
        //
        var LETTERS = /[a-z]/i;
        var ENITYFILED = /^[A-Z]+$/
        if (LETTERS.test(char)) {
            var value = '';

            // 同样，我们用一个循环遍历所有的字母，把它们存入 value 中。
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }
            // 然后添加一个类型为 `LETTER` 的 token，然后进入下一次循环。
            tokens.push({
                type: CONSTANT.LETTER,
                value: value
            });

            continue;
        }

        // 最后如果我们没有匹配上任何类型的 token，那么我们抛出一个错误。
        throw new TypeError('I dont know what this character is: ' + char);
    }

    // 词法分析器的最后我们返回 tokens 数组。
    return tokens;
}
