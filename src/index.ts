import 'dotenv/config';

import fs from 'fs';
import _ from 'lodash';
import { Promise } from 'bluebird';
import { parseSync, stringifySync, Node } from 'subtitle';

import { Storage } from '~/lib/storage';
import { Translator } from '~/lib/translator';
import { Transcriber } from '~/lib/transcriber';

import config from '~/config';

const TARGET_LANGUAGE_CODE = 'th';
const SOURCE_LANGUAGE_CODE = 'en-US';

async function main () {
  const region = _.get(config, 'aws.region');
  const credentials = _.pick(config.aws, [ 'accessKeyId', 'secretAccessKey' ]);

  const translator = new Translator(region, credentials);
  const storage = new Storage(region, credentials, config);
  const transcriber = new Transcriber(region, credentials, config);

  const videoDir = './videos/';
  const videoName = 'steve-job.mp4';
  const file = fs.readFileSync(`${videoDir}${videoName}`);

  // upload media file to s3
  const { key } = await storage.uploadVideo(file, { originalFileName: videoName });

  const transcribeJobName = `video-en-${key}`;
  await transcriber.transcribeVideo(transcribeJobName, { sourceLanguage: SOURCE_LANGUAGE_CODE, media: { key, format: 'mp4' } });

  console.log(`waiting for "${transcribeJobName}" job complete`);
  await transcriber.waitingForComplete(transcribeJobName);

  const originalCaptions = await storage.get(`${key}/caption.${SOURCE_LANGUAGE_CODE}.srt`);

  const captions = parseSync(originalCaptions);
  const translatedCaptions = await Promise.map(captions, async (caption: Node) => {
    if (caption.type === 'cue') {
      const translated = await translator.translate(caption?.data?.text, 'en', TARGET_LANGUAGE_CODE);

      _.set(caption, 'data.text', translated);
    }

    return caption;
  });

  const converted = stringifySync(translatedCaptions, { format: 'SRT' });
  await storage.uploadFile(`${key}/caption.${TARGET_LANGUAGE_CODE}.srt`, Buffer.from(converted));

  console.log('complete');
}

main();
