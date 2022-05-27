export type Region = string;

export type Credentials = {
  accessKeyId: string;
  secretAccessKey: string;
};

export type UploadOptions = {
  folder?: string
  originalFileName?: string
}
