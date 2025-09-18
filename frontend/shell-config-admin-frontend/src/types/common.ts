export interface AppConfig {
  apiBaseUrl: string;
  isEmbedded: boolean;
  language: string;
}

export interface EmbeddedModeConfig {
  hideHeader?: boolean;
  hideFooter?: boolean;
  hideNavigation?: boolean;
  parentOrigin?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface TableColumn {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}