export type Value = {
  [key: string]: Array<Value> | Array<string> | string | Value;
};
