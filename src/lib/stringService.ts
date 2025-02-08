export const extractFediverseName = (url: string, fallback: string) => {
  try {
    const u = new URL(url)
    return `${u.pathname.slice(1)}@${u.host}`
  } catch (e) {
    return fallback
  }
}
