export function exportToTxt(metadata: Record<string, any>, notes: Record<string, string>) {
  const lines: string[] = []
  // Global metadata
  lines.push('@v=1.0')
  lines.push(`@export=${new Date().toISOString()}`)
  lines.push('')

  const dates = Object.keys(metadata).sort()
  for (const date of dates) {
    const dayMeta = metadata[date]
    const note = notes[date] ?? ''
    lines.push(`# ${date}`)
    lines.push(`mood: ${dayMeta.mood ?? '-'} `)
    lines.push(`energy: ${dayMeta.energy ?? '-'} `)
    lines.push(`tags: ${dayMeta.tags?.length ? dayMeta.tags.join(', ') : '-'} `)
    lines.push('')
    if (note) {
      lines.push(`> ${note}`)
      lines.push('')
    }
    if (dayMeta.statusChecks && dayMeta.statusChecks.length) {
      for (const check of dayMeta.statusChecks) {
        const notePart = check.note ? ` | ${check.note}` : ''
        lines.push(`~ ${check.time} ${check.status}${notePart}`)
      }
      lines.push('')
    }
  }
  return lines.join('\n')
}
