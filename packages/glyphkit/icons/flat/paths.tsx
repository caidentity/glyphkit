interface IconPathData {
  d: string;
  viewBox: string;
}

// Temporary empty paths until we generate the real ones
export const paths: Record<string, IconPathData> = {
  default: { d: '', viewBox: '0 0 24 24' }
};

export type PathName = keyof typeof paths;
