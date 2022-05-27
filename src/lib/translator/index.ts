/* eslint-disable import/prefer-default-export */

import _ from 'lodash';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

import { Region, Credentials } from '~/ts/types/translator.types';

class Translator {
  private client: TranslateClient;

  constructor (region: Region, credentials: Credentials) {
    this.client = new TranslateClient({ region, credentials });
  }

  /**
   *
   * @param text
   * @param source Source language code
   * @param target Target language code
   */
  async translate (text: string, source: string, target: string): Promise<string | undefined> {
    const command = new TranslateTextCommand({ Text: text, SourceLanguageCode: source, TargetLanguageCode: target });

    const result = await this.client.send(command);
    const translated = _.get(result, 'TranslatedText');

    return translated;
  }
}

export { Translator };
