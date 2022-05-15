import errorCodes from './error-codes';
import defaultMessages from './default-messages';

class CustomError extends Error {
  private type: string;

  private code: string;

  private errors: any;

  constructor (message: string, errors?: any) {
    super(message);

    this.message = message ?? defaultMessages[this.constructor.name as keyof typeof defaultMessages];
    this.type = this.constructor.name;
    this.code = (errorCodes[this.constructor.name as keyof typeof errorCodes] || {}).code;
    this.errors = errors;
  }
}

export default {};
export { CustomError };
