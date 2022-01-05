import fs from 'fs-extra'
import readline from 'readline'
import events from 'events'
import Config from './config'
import path from 'path'
import * as Utils from './utils'

export interface FilterData extends Array<string> {}
export interface InputData extends Array<{name: string, children?: InputData}> {}
export interface PathListData extends Array<string[]> {}
export interface EntryDataMap extends Map<string, string> {}

export class FileManager {
    // 输入数据 转 扁平化数据
    public static inputDataToPathListData (data: InputData, pathList: string[]): PathListData {
        if (data.length === 0) {
            return [pathList]
        }

        let pathListData: PathListData = []
        data.forEach(({ name, children = [] }) => {
            pathListData = [
                ...pathListData,
                ...FileManager.inputDataToPathListData(children, [...pathList, name])
            ]
        })

        return pathListData
    }

    public static async readFileNameListInDir (dirPath: string): Promise<string[]> {
        return await fs.readdir(dirPath)
            .then(async nameList => await Promise.resolve(nameList))
            .catch(async err => await Promise.reject(err))
    }

    // 判断目录或文件是否存在
    public static async pathExists (path: string): Promise<boolean> {
        return await fs.pathExists(path)
            .then(async exists => await Promise.resolve(exists))
            .catch(async err => await Promise.reject(err))
    }

    public static async getInputData (project: string): Promise<InputData> {
        const fileName = `${project}.json`
        const filePath = path.join(__dirname, `${Config.dataInputPath}/${fileName}`)
        return await fs.readJson(filePath, { throws: false })
            .then(async data => await Promise.resolve([data]))
            .catch(async err => await Promise.reject(err))
    }

    public static async getFilterData (project: string): Promise<FilterData> {
        const filePath = path.join(__dirname, `${Config.dataFilterPath}/${project}`)
        const lines: string[] = []

        // 逐行读取
        const stream = fs.createReadStream(filePath)
        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        })

        rl.on('line', line => { lines.push(line) })
        await events.once(rl, 'close')

        // 删除注释行，留下可用行
        let slow = 0
        let fast = 0
        let meetMultiLine = false
        const len = lines.length - 1
        while (fast <= len) {
            if (!Utils.isSingleLineComment(lines[fast])) {
                if (Utils.isMultiStartLineComment(lines[fast])) {
                    fast++
                    meetMultiLine = true
                } else if (Utils.isMultiEndLineComment(lines[fast])) {
                    fast++
                    meetMultiLine = false
                } else if (meetMultiLine) {
                    fast++
                } else {
                    lines[slow] = lines[fast]
                    fast++
                    slow++
                }
            } else {
                fast++
            }
        }

        return lines.slice(0, slow)
    }

    public static async getEntryDataMap (project: string): Promise<EntryDataMap> {
        const inputData: InputData = await FileManager.getInputData(project)
        const filterData: FilterData = await FileManager.getFilterData(project)
        const pathListData: PathListData = FileManager.inputDataToPathListData(inputData, [])

        const entryDataMap = new Map()
        const len = pathListData.length
        for (let i = 0; i < len; i++) {
            const pathList = pathListData[i]
            const intersection = filterData.filter(v => pathList.includes(v))

            // 如果有交集
            if (intersection.length > 0) {
                const pathLast = pathList[pathList.length - 1]
                const entry = pathLast.match(/K\d{5}/g)?.[0] || ''
                const href = `${Config.host}/entry/${entry}`

                if (entry && !entryDataMap.has(entry)) {
                    entryDataMap.set(entry, href)
                }
            }
        }

        return entryDataMap
    }
}
