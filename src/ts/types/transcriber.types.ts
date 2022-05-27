export type Region = string;

export type Credentials = {
  accessKeyId: string
  secretAccessKey: string
};

export type Options = {
  sourceLanguage: string

  media: {
    key: string
    format: string
  }
};
