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
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 */

// 我们从接收一个字符串开始，首先设置两个变量。
function tokenizer(input) {

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
  
      // 要做的第一件事情就是检查是不是右圆括号。这在之后将会用在 `CallExpressions` 中，
      // 但是现在我们关心的只是字符本身。
      //
      // 检查一下是不是一个左圆括号。
      if (char === '{') {
  
        // 如果是，那么我们 push 一个 type 为 `paren`，value 为左圆括号的对象。
        tokens.push({
          type: 'paren',
          value: '{'
        });
  
        // 自增 `current`
        current++;
  
        // 结束本次循环，进入下一次循环
        continue;
      }
  
      // 然后我们检查是不是一个右圆括号。这里做的时候和之前一样：检查右圆括号、加入新的 token、
      // 自增 `current`，然后进入下一次循环。
      if (char === '}') {
        tokens.push({
          type: 'paren',
          value: '}'
        });
        current++;
        continue;
      }

       // 然后我们检查是不是一个右圆括号。这里做的时候和之前一样：检查右圆括号、加入新的 token、
      // 自增 `current`，然后进入下一次循环。
      if (char === ',') {
        tokens.push({
          type: 'comma',
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
      //   (add 123 456)
      //        ^^^ ^^^
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
          type: 'number',
          value: value
        });
  
        // 进入下一次循环。
        continue;
      }
  
      // 最后一种类型的 token 是 `name`。它由一系列的字母组成，这在我们的 lisp 语法中
      // 代表了函数。
      //
      //   (add 2 4)
      //    ^^^
      //    Name token
      //
      var LETTERS = /[a-z]/i;
      if (LETTERS.test(char)) {
        var value = '';
  
        // 同样，我们用一个循环遍历所有的字母，把它们存入 value 中。
        while (LETTERS.test(char)) {
          value += char;
          char = input[++current];
        }
  
        // 然后添加一个类型为 `name` 的 token，然后进入下一次循环。
        tokens.push({
          type: 'name',
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
  
  /**
   * ============================================================================
   *                                 ヽ/❀o ل͜ o\ﾉ
   *                             语法分析器（Parser）!!!
   * ============================================================================
   */
  
  /**
   *  语法分析器接受 token 数组，然后把它转化为 AST
   *
   *   [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
   */
  
  // 现在我们定义 parser 函数，接受 `tokens` 数组
  function parser(tokens) {
  
    // 我们再次声明一个 `current` 变量作为指针。
    var current = 0;
  
    // 但是这次我们使用递归而不是 `while` 循环，所以我们定义一个 `walk` 函数。
    function walk() {
  
      // walk函数里，我们从当前token开始
      var token = tokens[current];
  
      // 对于不同类型的结点，对应的处理方法也不同，我们从 `number` 类型的 token 开始。
      // 检查是不是 `number` 类型
      if (token.type === 'number') {
  
        // 如果是，`current` 自增。
        current++;
  
        // 然后我们会返回一个新的 AST 结点 `NumberLiteral`，并且把它的值设为 token 的值。
        return {
          type: 'NumberLiteral',
          value: token.value
        };
      }
  
      // 接下来我们检查是不是 CallExpressions 类型，我们从左圆括号开始。
      if (
        token.type === 'paren' &&
        token.value === '('
      ) {
  
        // 我们会自增 `current` 来跳过这个括号，因为括号在 AST 中是不重要的。
        token = tokens[++current];
  
        // 我们创建一个类型为 `CallExpression` 的根节点，然后把它的 name 属性设置为当前
        // token 的值，因为紧跟在左圆括号后面的 token 一定是调用的函数的名字。 
        var node = {
          type: 'CallExpression',
          name: token.value,
          params: []
        };
  
        // 我们再次自增 `current` 变量，跳过当前的 token 
        token = tokens[++current];
  
        // 现在我们循环遍历接下来的每一个 token，直到我们遇到右圆括号，这些 token 将会
        // 是 `CallExpression` 的 `params`（参数）
        // 
        // 这也是递归开始的地方，我们采用递归的方式来解决问题，而不是去尝试解析一个可能有无限
        // 层嵌套的结点。
        // 
        // 为了更好地解释，我们来看看我们的 Lisp 代码。你会注意到 `add` 函数的参数有两个，
        // 一个是数字，另一个是一个嵌套的 `CallExpression`，这个 `CallExpression` 中
        // 包含了它自己的参数（两个数字）
        //
        //   (add 2 (subtract 4 2))
        // 
        // 你也会注意到我们的 token 数组中有多个右圆括号。
        //
        //   [
        //     { type: 'paren',  value: '('        },
        //     { type: 'name',   value: 'add'      },
        //     { type: 'number', value: '2'        },
        //     { type: 'paren',  value: '('        },
        //     { type: 'name',   value: 'subtract' },
        //     { type: 'number', value: '4'        },
        //     { type: 'number', value: '2'        },
        //     { type: 'paren',  value: ')'        }, <<< 右圆括号
        //     { type: 'paren',  value: ')'        }  <<< 右圆括号
        //   ]
        //
        // 遇到嵌套的 `CallExpressions` 时，我们将会依赖嵌套的 `walk` 函数来
        // 增加 `current` 变量
        // 
        // 所以我们创建一个 `while` 循环，直到遇到类型为 `'paren'`，值为右圆括号的 token。 
        while (
          (token.type !== 'paren') ||
          (token.type === 'paren' && token.value !== ')')
        ) {
          // 我们调用 `walk` 函数，它将会返回一个结点，然后我们把这个节点
          // 放入 `node.params` 中。
          node.params.push(walk());
          token = tokens[current];
        }
  
        // 我们最后一次增加 `current`，跳过右圆括号。
        current++;
  
        // 返回结点。
        return node;
      }
  
      // 同样，如果我们遇到了一个类型未知的结点，就抛出一个错误。
      throw new TypeError(token.type);
    }
  
    // 现在，我们创建 AST，根结点是一个类型为 `Program` 的结点。
    var ast = {
      type: 'Program',
      body: []
    };
  
    // 现在我们开始 `walk` 函数，把结点放入 `ast.body` 中。
    //
    // 之所以在一个循环中处理，是因为我们的程序可能在 `CallExpressions` 后面包含连续的两个
    // 参数，而不是嵌套的。
    //
    //   (add 2 2)
    //   (subtract 4 2)
    //
    while (current < tokens.length) {
      ast.body.push(walk());
    }
  
    // 最后我们的语法分析器返回 AST 
    return ast;
  }

  export { tokenizer }