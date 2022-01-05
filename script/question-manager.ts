
import path from 'path'
import inquirer from 'inquirer'
import { FileManager } from './file-manager'
import Config from './config'

export interface Answer {
    project: string // 项目数据名称，例如：ko01000
    shouldCrawler: boolean // 是否执行爬虫程序
    shouldExport: boolean // 是否执行导出程序
}

export class QuestionManager {
    private static instance: QuestionManager
    public answer: Answer = {
        project: '',
        shouldCrawler: false,
        shouldExport: false
    }

    // 单例模式
    public static getInstance () {
        if (QuestionManager.instance) {
            return QuestionManager.instance
        } else {
            QuestionManager.instance = new QuestionManager()
            return QuestionManager.instance
        }
    }

    // 请选择要爬取或导出数据的项目
    public async selectProject (): Promise<string> {
        const dataInputPath = path.join(__dirname, Config.dataInputPath)
        const fileNameList = await FileManager.readFileNameListInDir(dataInputPath)

        if (fileNameList.length === 0) {
            return await Promise.reject(new Error(`${dataInputPath} 目录中没有文件，请放置项目数据文件！例如：ko01000.json`))
        }

        const aw = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'project',
                message: 'Please select project name: ',
                choices: () => {
                    const list: string[] = []
                    fileNameList.forEach(name => {
                        const project = name.match(/^.*(?=\.json)/g)?.[0]
                        project && list.push(project)
                    })
                    return list
                }
            }
        ])

        this.answer = { ...this.answer, ...aw }
        return await Promise.resolve(this.answer.project)
    }

    // 请选择是否执行爬虫程序
    public async selectShouldCrawler (): Promise<boolean> {
        const aw = await inquirer.prompt([{
            type: 'confirm',
            name: 'shouldCrawler',
            message: 'Should rum crawler program? (Default is No)',
            default: false
        }])

        this.answer = { ...this.answer, ...aw }
        return await Promise.resolve(this.answer.shouldCrawler)
    }

    // 请选择是否执行导出程序
    public async selectShouldExport (): Promise<boolean> {
        const aw = await inquirer.prompt([{
            type: 'confirm',
            name: 'shouldExport',
            message: 'Should rum export program? (Default is No)',
            default: false
        }])

        this.answer = { ...this.answer, ...aw }
        return await Promise.resolve(this.answer.shouldCrawler)
    }
}
