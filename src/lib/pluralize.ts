export default function pluralize(word: string, progress: number) {
  return `${word}${progress === 1 ? '' : 's'}`
}
