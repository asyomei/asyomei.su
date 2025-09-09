const months = {
  ru: 'январь февраль март апрель май июнь июль август сентябрь октябрь ноябрь декабрь'.split(' '),
  en: 'january february march april may june july august september october november december'.split(' '),
}

export function formatPostDate(date: Date, lang: keyof typeof months): string {
  const day = date.getUTCDate()
  const mon = months[lang][date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${mon} ${day}, ${year}`
}
