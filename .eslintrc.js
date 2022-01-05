module.exports = {
    env: {
        node: true,
        commonjs: true,
        amd: true,
        es6: true
    },
    extends: [
        'standard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        indent: ['error', 4],
        /* Possible Errors - 这些规则与 JavaScript 可能的错误或者逻辑错误有关 */
        'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
        'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
        'no-empty': 2, // 禁止出现空语句块
        'no-func-assign': 2, // 禁止对 function 声明重新赋值
        'no-irregular-whitespace': 2, // 禁止不规则的空白
        'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码

        /* Best Practices - 这些规则是关于最佳实践的，帮助避免一些问题 */
        eqeqeq: 2, // 要求使用 === 和 !==
        curly: 2, // 强制所有控制语句使用一致的括号风格

        /* Variables - 这些规则与变量有关 */
        'no-delete-var': 2, // 禁止删除变量
        'no-unused-vars': 2, // 进制出现未使用过的变量

        /* Node.js and CommonJS - 关于 Node.js 相关的规则 */
        'global-require': 2, // 要求 require() 出现在顶层模块作用域中
        'handle-callback-err': 2 // 要求回调函数中有容错处理
    }
}
