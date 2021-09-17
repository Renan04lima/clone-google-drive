export default class AppController {
  constructor({ connectionManager, viewManager, dragAndDropManager }) {
    this.connectionManager = connectionManager
    this.viewManager = viewManager
  }

  async initialize() {
    this.viewManager.configureFileBtnClick()

    await this.updateCurrentFiles()
  }

  async updateCurrentFiles() {
    const files = await this.connectionManager.currentFiles()
    this.viewManager.updateCurrentFiles(files)
  }
}