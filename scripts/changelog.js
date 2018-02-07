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
    if (/^#\s+([0-9]+\.[0-9]+\.[0-9]+)\s+(?:\(([0-9]{4}-[0-9]{2}-[0-9]{2})\))/.test(row)) {
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

  if (release == null) return {}

  return {
    title: `${ release.version } (${ release.date })`,
    content: release.contents.join('\n')
  }
}

module.exports = function (robot) {
  robot.respond(/changelog/, function (msg) {
    const envelope = msg.envelope
    const raw = loadChangelog()
    const { title, content } = getRecentData(raw)

    robot.upload(envelope, title, {
      title,
      content,
      filetype: 'post',
    })
  })
}
