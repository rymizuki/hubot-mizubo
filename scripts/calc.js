// Description:
//   計算する
//
// Commands:
//   hubot calc <expr> - exprを計算した値をだす
//
module.exports = function (robot) {
  robot.respond(/calc ([0-9-\+\/*% \(\)]+)/, (msg) => {
    const expr = msg.match[1]
    if (expr == null) {
      msg.reply('入力が不適切なようです')
      return
    }
    try {
      const result = eval(expr)
      if (result == Infinity) {
        throw new Error('Infinity')
      }
      msg.send(`結果は \`${ result }\` です`)
    } catch (err) {
      msg.send('計算できません')
    }
  })
}
