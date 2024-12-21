declare module '*/icons-metadata.json' {
  import { IconCategory } from './icon';
  
  interface IconsMetadata {
    categories: IconCategory[];
  }
  
  const value: IconsMetadata;
  export default value;
} 