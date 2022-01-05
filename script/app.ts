import { Answer, QuestionManager } from './question-manager'
import { FileManager } from './file-manager'
import Config from './config'
import path from 'path'

(async function () {
    // 程序执行前，需要先检查全局配置中的各项路径是否存在
    const dataInputPath = path.join(__dirname, Config.dataInputPath)
    const existDataInputDir = await FileManager.pathExists(dataInputPath)
    if (!existDataInputDir) {
        console.log('dataInputPath 不存在，请创建文件夹')
    }

    // 提问并获取答案
    const questionManager: QuestionManager = QuestionManager.getInstance()
    await questionManager.selectProject()
    await questionManager.selectShouldCrawler()
    await questionManager.selectShouldExport()
    const answer: Answer = questionManager.answer
    console.log(answer)

    // 提示
    console.log('All right. The questioning session is over. Let us check whether the file exists based on the answer.')

    // 根据answer.project 检查inputData和filterConfig是否存在
    const entryDataMap = await FileManager.getEntryDataMap(answer.project)
    console.log(entryDataMap)
})()
