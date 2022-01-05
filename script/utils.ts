// 是否是单行注释
export function isSingleLineComment (lineStr: string): boolean {
    return /^\s*#(?!\[\[)/g.test(lineStr) || lineStr === ''
}

// 是否是多行注释的开始行
export function isMultiStartLineComment (lineStr: string): boolean {
    return /^\s*#\[\[/g.test(lineStr)
}

// 是否为多行注释的结束行
export function isMultiEndLineComment (lineStr: string): boolean {
    return /^\s*\]\].*/g.test(lineStr)
}
