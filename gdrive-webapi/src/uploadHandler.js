import Busboy from 'busboy'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { logger } from './logger.js'
export default class UploadHandler {
    constructor({ io, socketId, downloadsFolder, messageTimeDelay = 200 }) {
        this.io = io
        this.socketId = socketId
        this.downloadsFolder = downloadsFolder
    }


    /**
     * usado pelo onFile para fazer o funil dos bytes
     */
    handleFileBytes(filename) {
        
    }

    async onFile(fieldname, file, filename) {
        const saveTo = `${this.downloadsFolder}/${filename}`

        await pipeline(
            // 1o passo, pegar uma readable stream!
            file,
            // 2o passo, filtrar, converter, transformar dados!
            this.handleFileBytes.apply(this, [filename]),
            // 3o passo, é saida do processo, uma writable stream!
            fs.createWriteStream(saveTo)
        )

        logger.info(`File [${filename}] finished`)
    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers })
        busboy.on("file", this.onFile.bind(this))
        busboy.on("finish", onFinish)

        return busboy
    }

}