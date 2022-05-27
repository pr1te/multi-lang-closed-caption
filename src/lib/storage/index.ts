/* eslint-disable import/prefer-default-export */

import * as uuid from 'uuid';
import Readable from 'stream';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { Config } from '~/ts/types/config.types';
import { Region, Credentials, UploadOptions } from '~/ts/types/storage.types';

class Storage {
  private client: S3Client;

  private config: Config;

  constructor (region: Region, credentials: Credentials, config: Config) {
    this.config = config;
    this.client = new S3Client({ region, credentials });
  }

  private async _upload (key: string, file: string | Uint8Array | Buffer, meta?: { [key: string]: string }) {
    const command = new PutObjectCommand({
      Key: key,
      Body: file,
      Metadata: meta,
      Bucket: this.config.storage.bucket,
    });

    await this.client.send(command);
  }

  async uploadVideo (file: string | Uint8Array | Buffer, options?: UploadOptions) {
    const name = uuid.v4();
    const key = options?.folder ? `${options.folder}/${name}` : name;

    await this._upload(`${key}/video`, file, { 'original-file-name': options?.originalFileName ?? '' });

    return { key: name, folder: options?.folder, location: key };
  }

  async uploadFile (name: string, file: string | Uint8Array | Buffer, options?: UploadOptions) {
    const key = options?.folder ? `${options.folder}/${name}` : name;

    await this._upload(key, file);

    return { key: name, folder: options?.folder, location: key };
  }

  async get (location: string): Promise<string> {
    const command = new GetObjectCommand({ Key: location, Bucket: this.config.storage.bucket });

    const { Body } = await this.client.send(command);

    if (!Body) throw new Error('Body of undefined');

    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      const bodyStream = Body! as Readable;

      bodyStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      bodyStream.on('error', reject);
      bodyStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
  }
}

export { Storage };
