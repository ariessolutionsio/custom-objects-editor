export type LocalizedString = Record<string, string>;

export interface Source {
  key: string;
  uri: string;
  contentType: string;
  width?: number | null;
  height?: number | null;
}

export interface Asset {
  key?: string;
  name: LocalizedString;
  description?: LocalizedString;
  tags?: string[];
  folder?: string;
  sources?: Source[];
}
