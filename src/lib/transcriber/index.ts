/* eslint-disable import/prefer-default-export */

import promiseRetry from 'promise-retry';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from '@aws-sdk/client-transcribe';

import { Config } from '~/ts/types/config.types';
import { Region, Credentials, Options } from '~/ts/types/transcriber.types';

class Transcriber {
  private config: Config;

  private client: TranscribeClient;

  constructor (region: Region, credentials: Credentials, config: Config) {
    this.config = config;
    this.client = new TranscribeClient({ region, credentials });
  }

  async transcribeVideo (jobName: string, options: Options) {
    // See more the params of start command
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-transcribe/interfaces/starttranscriptionjobcommandinput.html
    const command = new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,

      // in case of don't know the langague of the source media, can use `IdentifyLanguage` to identify automatically instead
      LanguageCode: options.sourceLanguage,
      MediaFormat: options.media.format,

      // See more about the media object
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-transcribe/modules/media.html#mediafileuri
      Media: { MediaFileUri: `s3://${this.config.storage.bucket}/${options.media.key}/video` },

      // json out put. see more below
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-transcribe/interfaces/starttranscriptionjobcommandinput.html#outputkey
      OutputKey: `${options.media.key}/caption.${options.sourceLanguage}.json`,
      OutputBucketName: this.config.storage.bucket,

      Subtitles: {
        OutputStartIndex: 1,
        Formats: [ 'srt' ],
      },
    });

    const run = await this.client.send(command);

    return run;
  }

  async waitingForComplete (jobName: string) {
    const command = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });

    return promiseRetry(async (retry) => {
      const response = await this.client.send(command);

      if (response.TranscriptionJob?.TranscriptionJobStatus !== 'COMPLETED') {
        return retry(null);
      }

      return {
        caption: { location: response.TranscriptionJob.Subtitles?.SubtitleFileUris?.[0] },
        transcription: { location: response.TranscriptionJob.Transcript?.TranscriptFileUri },
      };
    }, { minTimeout: 2000, forever: true });
  }
}

export { Transcriber };
