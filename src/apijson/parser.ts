import { REGULAR, CONSTANT } from './const';
import { Token } from './interface';
/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                             语法分析器（Parser）!!!
 * ============================================================================
 */

/**
 *  语法分析器接受 token 数组，然后把它转化为 AST
 *
 *   [{ type: 'braces', value: '{' }, ...]   =>   { type: 'Program', body: [...] }
 */

// 现在我们定义 parser 函数，接受 `tokens` 数组
export function parser(tokens: Array<Token>) {

  // 我们再次声明一个 `current` 变量作为指针。
  var current = 0;

  // 但是这次我们使用递归而不是 `while` 循环，所以我们定义一个 `walk` 函数。
  function walk() {

    // walk函数里，我们从当前token开始
    debugger
    var token = tokens[current];

    // 接下来我们检查是不是 EnityField 类型，我们从左圆括号开始。
    if (token.type == CONSTANT.LETTER) {
      // 这里头字母大写就表示要查询该名字的表
      if(REGULAR.isEnityField.test(token.value)){
        // 创建一个Field 的根节点
        let node = {
          type: CONSTANT.FIELD_ENITY,
          name: token.value,
          [CONSTANT.SELECTIONS]: [],
        }
        // 跳过 Field 节点
        token = tokens[++current];
        // 我们从 { 开始，获取 Field 节点下的属性
        if (token.type == CONSTANT.SYMBOL_BRACES_FRONT) {
          // 直到 } 结束
          while (token.type !== CONSTANT.SYMBOL_BRACES_REAR) {
            // 跳过 { 括号 和 每次循环
            token = tokens[++current];
            // 判断是不是Enity下的column
            if (token.type == CONSTANT.LETTER) {
              node[CONSTANT.SELECTIONS].push({
                type: CONSTANT.FIELD_COLUMN,
                name: token.value
              })
            }
          }
        }
        // 我们最后一次增加 `current`，跳过右大括号。
        current++;
        return node
      }
    }


    // 同样，如果我们遇到了一个类型未知的结点，就抛出一个错误。
    throw new TypeError(token.type);
  }

  // 现在，我们创建 AST，根结点是一个类型为 `Program` 的结点。
  var ast = {
    type: CONSTANT.PROGRAM,
    body: []
  };

  // 现在我们开始 `walk` 函数，把结点放入 `ast.body` 中。
  //
  // 之所以在一个循环中处理，是因为我们的程序可能在 `Entity` 后面包含连续的两个
  // 参数，而不是嵌套的。
  //
  //   User { id ,name },
  //   Message { id, content }
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // 最后我们的语法分析器返回 AST 
  return ast;
}
