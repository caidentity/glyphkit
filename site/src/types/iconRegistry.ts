export interface IconRegistryItem {
  category: string;
  name: string;
}

export interface IconCategories {
  [key: string]: {
    icons: string[];
    count: number;
  };
}

export interface IconRegistry {
  icons: {
    [key: string]: IconRegistryItem;
  };
  categories: IconCategories;
  metadata: {
    totalIcons: number;
    totalCategories: number;
    generatedAt: string;
  };
} 