interface CsvRow {
  [key: string]: string | number
}

interface WorkerMessage {
  data: CsvRow[]
  rowPivot: string
  columnPivot: string
  valuePivot: string
  aggregation: string
}

self.onmessage = function (e: MessageEvent<WorkerMessage>) {
  const { data, rowPivot, columnPivot, valuePivot, aggregation } = e.data

  const result: { [key: string]: { [key: string]: number } } = {}

  data.forEach((row) => {
    const rowKey = row[rowPivot] as string
    const colKey = row[columnPivot] as string
    let rawValue = row[valuePivot] as string

    const value = parseFloat(rawValue) || 0

    if (!result[rowKey]) {
      result[rowKey] = {}
    }
    if (!result[rowKey][colKey]) {
      result[rowKey][colKey] = 0
    }

    switch (aggregation) {
      case 'sum':
        result[rowKey][colKey] += value
        break
      case 'count':
        result[rowKey][colKey] += 1
        break
      default:
        break
    }
  })

  self.postMessage(result)
}
