export default class ViewManager {
  constructor() {
      this.tbody = document.getElementById('tbody')
  }

  getIcon(file) {
      return file.match(/\.mp4/i) ? 'movie'
          : file.match(/\.jp|png/i) ? 'image' : 'content_copy'
  }

  makeIcon(file) {
      const icon = this.getIcon(file)
      const colors = {
          image: 'yellow600',
          movie: 'red600',
          file: ''
      }

      return `
      <i class="material-icons ${colors[icon]} left">${icon}</i>
      `
  }

  updateCurrentFiles(files) {
      const template = (item) => `
      <tr>
          <td>${this.makeIcon(item.file)} ${item.file}</td>
          <td>system_user</td>
          <td>27 de agosto de 2021 14:10</td>
          <td>65.6 GB</td>
      </tr>
      `

      this.tbody.innerHTML = files.map(template).join('')
  }
}