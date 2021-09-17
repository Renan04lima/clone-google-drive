export default class AppController {
  constructor({ connectionManager, viewManager, dragAndDropManager }) {
    this.connectionManager = connectionManager
    this.viewManager = viewManager

    this.uploadingFiles = new Map() // NOTE - ajuda a controlar o estado de cada file
  }

  async initialize() {
    this.viewManager.configureFileBtnClick()
    this.viewManager.configureOnFileChange(this.onFileChange.bind(this))
    this.connectionManager.configureEvents({
      onProgress: () => { }
    })
    await this.updateCurrentFiles()
  }

  async onFileChange(files) {
    const requests = []
    for (const file of files) {
      this.uploadingFiles.set(file.name, file)
      requests.push(this.connectionManager.uploadFile(file))
    }

    await Promise.all(requests)

    await this.updateCurrentFiles()
  }

  async updateCurrentFiles() {
    const files = await this.connectionManager.currentFiles()
    this.viewManager.updateCurrentFiles(files)
  }
}