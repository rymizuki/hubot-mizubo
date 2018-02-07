// Description:
//   show changelog
// Commands:
//   hubot changelog - show recently changes
//
const fs = require('fs')
const path = require('path')

function loadChangelog () {
  const filepath = path.join(__dirname, '..', 'CHANGELOG.md')
  const raw = fs.readFileSync(filepath, 'utf8')
  return raw
}

function getReleases (raw) {
  const rows = raw.split(/\n/)
  const releases = {}

  let version
  let date

  rows.forEach((row) => {
    const pattern_version_link = /^#\s+\[([0-9]+\.[0-9]+\.[0-9]+)\]\((?:.+)\)\s(?:\(([0-9]{4}-[0-9]{2}-[0-9]{2})\))/
    const pattern_version      = /^#\s+([0-9]+\.[0-9]+\.[0-9]+)\s(?:\(([0-9]{4}-[0-9]{2}-[0-9]{2})\))/
    if (pattern_version.test(row) || pattern_version_link.test(row)) {
      version = RegExp.$1
      date    = RegExp.$2
      releases[version] = {
        version,
        date,
        contents: []
      }
    }
    if (releases[version]) releases[version].contents.push(row)
  })

  return releases
}

function getRecentData (raw) {
  const releases = getReleases(raw)
  const version  = Object.keys(releases)[0]
  const release = releases[version]

  if (release == null) return null

  return {
    title: `${ release.version } (${ release.date })`,
    content: release.contents.join('\n')
  }
}

module.exports = function (robot) {
  robot.respond(/changelog/, function (msg) {
    const envelope = msg.envelope
    const raw = loadChangelog()
    const data = getRecentData(raw)

    if (data == null) return msg.send('取得に失敗しました')

    const { title, content } = data

    robot.logger.debug('[changelog] title', title)
    robot.logger.debug('[changelog] content', content)

    robot.upload(envelope, title, {
      title,
      content,
      filetype: 'post',
    })
  })
}
