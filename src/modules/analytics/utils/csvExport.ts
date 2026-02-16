function escapeCSVField(value: unknown): string {
  const stringValue = String(value ?? '')
  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function buildCSVContent(
  rows: readonly Record<string, unknown>[],
): string {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const headerRow = headers.join(',')

  const dataRows = rows.map((row) =>
    headers.map((header) => escapeCSVField(row[header])).join(','),
  )

  return [headerRow, ...dataRows].join('\n')
}

export function downloadCSV(
  data: readonly Record<string, unknown>[],
  filename: string,
): void {
  const csvContent = buildCSVContent(data)

  if (csvContent.length === 0) {
    return
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
