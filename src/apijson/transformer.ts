import { traverser } from "./traverser";
import { CONSTANT } from "./const";

/**
 * ============================================================================
 *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
 *                                   转换器!!!
 * ============================================================================
 */

/**
 * 下面是转换器。转换器接收我们在之前构建好的 AST，然后把它和 visitor 传递进入我们的遍历
 * 器中 ，最后得到一个新的 AST。
 */

// 定义我们的转换器函数，接收 AST 作为参数
export function transformer(ast) {

    // 创建 `newAST`，它与我们之前的 AST 类似，有一个类型为 Program 的根节点。
    var newAst = {
        type: CONSTANT.PROGRAM,
        body: []
    };

    // 下面的代码会有些奇技淫巧，我们在父结点上使用一个属性 `context`（上下文），这样我们就
    // 可以把结点放入他们父结点的 context 中。当然可能会有更好的做法，但是为了简单我们姑且
    // 这么做吧。
    //
    // 注意 context 是一个*引用*，从旧的 AST 到新的 AST。
    ast._context = newAst.body;

    // 我们把 AST 和 visitor 函数传入遍历器
    traverser(ast, {

        // 第一个 visitor 方法接收 `Number`。
        [CONSTANT.NUMBER]: function (node, parent) {

            // 我们创建一个新结点，名字叫 `Number`，并把它放入父结点的 context 中。
            parent._context.push({
                type: CONSTANT.NUMBER,
                value: node.value
            });
        },

        // 下一个，`FIELD_ENITY`。
        [CONSTANT.FIELD_ENITY]: function (node, parent) {

            // 我们创建一个 `Field` 。
            var expression: any = {
                type: CONSTANT.FIELD,
                queryType: {
                    type: CONSTANT.FIELD_ENITY,
                    name: node.name
                },
                [CONSTANT.SELECTIONS]: [],
                arguments: []
            };

            // 下面我们在原来的 `CallExpression` 结点上定义一个新的 context，它是 expression
            // 中 arguments 这个数组的引用，我们可以向其中放入参数。
            node._context = expression.arguments;

            // 然后来看看父结点是不是一个 `CallExpression`，如果不是...
            if (parent.type !== 'CallExpression') {

                // 我们把 `CallExpression` 结点包在一个 `ExpressionStatement` 中，这么做是因为
                // 单独存在（原文为top level）的 `CallExpressions` 在 JavaScript 中也可以被当做
                // 是声明语句。
                // 
                // 译者注：比如 `var a = foo()` 与 `foo()`，后者既可以当作表达式给某个变量赋值，也
                // 可以作为一个独立的语句存在。
                expression = {
                    type: 'ExpressionStatement',
                    expression: expression
                };
            }

            // 最后我们把 `CallExpression`（可能是被包起来的） 放入父结点的 context 中。
            parent._context.push(expression);
        }
    });

    // 最后返回创建好的新 AST。
    return newAst;
}
