import Busboy from 'busboy'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { logger } from './logger.js'
export default class UploadHandler {
    constructor({ io, socketId, downloadsFolder, messageTimeDelay = 200 }) {
        this.io = io
        this.socketId = socketId
    }

    async onFile(fieldname, file, filename) {
       
    }

    registerEvents(headers, onFinish) {
        const busboy = new Busboy({ headers })
        busboy.on("file", this.onFile.bind(this))
        busboy.on("finish", onFinish)

        return busboy
    }

}