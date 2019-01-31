import { CONSTANT } from "./const";

/**
 * ============================================================================
 *                                 ⌒(❀>◞౪◟<❀)⌒
 *                                   遍历器!!!
 * ============================================================================
 */

/**
 * 现在我们有了 AST，我们需要一个 visitor 去遍历所有的结点。当遇到某个类型的结点时，我们
 * 需要调用 visitor 中对应类型的处理函数。
 *
 *   traverse(ast, {
 *     CONSTANT.PROGRAM(node, parent) {
 *       // ...
 *     },
 *
 *     CONSTANT.FIELD_ENITY(node, parent) {
 *       // ...
 *     },
 *
 *     CONSTANT.NUMBER(node, parent) {
 *       // ...
 *     }
 *   });
 */

// 所以我们定义一个遍历器，它有两个参数，AST 和 vistor。在它的里面我们又定义了两个函数...
export function traverser(ast, visitor) {

    // `traverseArray` 函数允许我们对数组中的每一个元素调用 `traverseNode` 函数。
    function traverseArray(array, parent) {
        array.forEach(function (child) {
            traverseNode(child, parent);
        });
    }

    // `traverseNode` 函数接受一个 `node` 和它的父结点 `parent` 作为参数，这个结点会被
    // 传入到 visitor 中相应的处理函数那里。
    function traverseNode(node, parent) {

        // 首先我们看看 visitor 中有没有对应 `type` 的处理函数。
        var method = visitor[node.type];

        // 如果有，那么我们把 `node` 和 `parent` 都传入其中。
        if (method) {
            method(node, parent);
        }

        // 下面我们对每一个不同类型的结点分开处理。
        switch (node.type) {

            // 我们从顶层的 `Program` 开始，Program 结点中有一个 body 属性，它是一个由若干
            // 个结点组成的数组，所以我们对这个数组调用 `traverseArray`。
            //
            // （记住 `traverseArray` 会调用 `traverseNode`，所以我们会递归地遍历这棵树。）
            case CONSTANT.PROGRAM:
                traverseArray(node.body, node);
                break;

            // 下面我们对 `FIELD_ENITY` 做同样的事情，遍历它的 `selections`。
            case CONSTANT.FIELD_ENITY:
                traverseArray(node[CONSTANT.SELECTIONS], node);
                break;

            // 如果是 `NUMBER`，那么就没有任何子结点了，所以我们直接 break
            case CONSTANT.NUMBER:
                break;

            // 同样，如果我们不能识别当前的结点，那么就抛出一个错误。
            default:
                throw new TypeError(node.type);
        }
    }

    // 最后我们对 AST 调用 `traverseNode`，开始遍历。注意 AST 并没有父结点。
    traverseNode(ast, null);
}
