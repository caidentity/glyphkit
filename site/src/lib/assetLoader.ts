const ASSET_BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/assets'
  : '/assets'

export function getAssetPath(category: string, filename: string): string {
  return `${ASSET_BASE_PATH}/${category}/${filename}`
}

export function getIconPath(category: string, size: number, name: string): string {
  return getAssetPath(`icons/${category}/${size}px`, `${name}.svg`)
}

export function getLogoPath(filename: string): string {
  return getAssetPath('Logo', filename)
} 