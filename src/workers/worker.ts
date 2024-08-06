interface CsvRow {
  [key: string]: string | number | undefined
}

interface WorkerMessage {
  data: CsvRow[]
  rowPivots: string[]
  columnPivots: string[]
  valuePivot: string
  aggregation: string
}

self.onmessage = function (e: MessageEvent<WorkerMessage>) {
  const { data, rowPivots, columnPivots, valuePivot, aggregation } = e.data
  const result: { [key: string]: { [key: string]: number } } = {}

  data.forEach((row) => {
    const rowKey = rowPivots.map((pivot) => row[pivot] ?? '-').join(' / ')

    const colKey = columnPivots.map((pivot) => row[pivot] ?? '-').join(' / ')

    if (!result[rowKey]) {
      result[rowKey] = {}
    }
    if (!result[rowKey][colKey]) {
      result[rowKey][colKey] = 0
    }

    let rawValue = row[valuePivot]
    if (typeof rawValue === 'string') {
      rawValue = rawValue === '-' ? '0' : rawValue
    }
    const value = parseFloat(rawValue as string) || 0

    if (aggregation === 'sum') {
      result[rowKey][colKey] += value
    } else if (aggregation === 'count') {
      result[rowKey][colKey] += 1
    }
  })

  self.postMessage(result)
}
