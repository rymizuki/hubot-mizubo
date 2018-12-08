const GoogleSpreadsheet = require('google-spreadsheet');
const Q = require('q')
const { filter, reduce, chain, find } = require('lodash')

const columns = {
  2: 'item',
  3: 'rank',
  4: 'area',
  5: 'quest',
  6: 'ap',
  7: 'bonds_rate',
  8: '-',
  9: 'ap_rate',
  10: 'ap_rate_unit',
  11: 'drop_rate',
  12: 'drop_rate_unit'
}

module.exports = class FgoDropEfficiency {
  constructor () {
    this.id = '1TrfSDteVZnjUPz68rKzuZWZdZZBLqw03FlvEToOvqH0'
    this.spreadsheet = new GoogleSpreadsheet(this.id)
    this.items = []
  }
  sync () {
    return this._getSheet()
      .then((sheet) => {
        return this._getItems(sheet)
      })
      .then((items) => {
        this.items = items
        return this.items
      })
  }
  _getSheet () {
    return Q.Promise((resolve, reject) => {
      this.spreadsheet.getInfo((err, info) => {
        if (err) reject(new Error(err))

        const workSheet = find(info.worksheets, ({ title }) => {
          return title == 'ドロップ率Best5'
        })

        return workSheet ? resolve(workSheet) : reject(new Error('sheet not found'))
      })
    })
  }
  _getItems (sheet) {
    return Q.Promise((resolve, reject) => {
      sheet.getCells({
        'min-row': 4,
        'min-col': 1,
        'max-col': 12,
      }, (err, cells) => {
        if (err) return reject(err)
        const data = chain(cells)
          .map(({ row, col, value }) => {
            const key = columns[col]
            return { row, col, value, key }
          })
          .groupBy('row')
          .reduce((items, rows, num, index) => {
            const item_row = find(rows, { col: 2 })
            if (item_row != null) {
              items.push({
                name: item_row.value,
                records: []
              })
            }
            const record = reduce(rows, (prev, { col, value, key }) => {
                if (col <= 2) return prev
                prev[key] = value
                return prev
              }, {})
            if (!/^[0-9]+$/.test(record.rank)) return items

            items[items.length - 1].records.push(record)
            return items
          }, [])
          .value()
        resolve(data)
      })
    })
  }
  find (name) {
    const synced = this.items.length == 0 ? this.sync() : Q.when(this.items)
    return synced.then(() => {
      return find(this.items, { name })
    })
  }
  search (keyword) {
    const synced = this.items.length == 0 ? this.sync() : Q.when(this.items)
    return synced.then(() => {
      return filter(this.items, (item) => {
        const name = item.name
          .replace(/\r?\n/g, '')
          .replace(/\|/g, 'ー')
        return new RegExp(keyword).test(name)
      })
    })
  }
}
