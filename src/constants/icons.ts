import { ICON_SIZES } from '@/types/icon'

export const ICONS_CONFIG = {
  BASE_DIR: 'public/icons',
  METADATA_FILE: 'public/icons/metadata.json',
  SMALL_SUFFIX: '-small',
  DEFAULT_SIZE: ICON_SIZES.REGULAR,
  SMALL_SIZE: ICON_SIZES.SMALL,
  CACHE_DURATION: 1000 * 60 * 5, // 5 minutes
  FILE_EXTENSION: '.svg',
} as const

export const METADATA_DEFAULTS = {
  EMPTY_METADATA: { categories: [] },
} as const 