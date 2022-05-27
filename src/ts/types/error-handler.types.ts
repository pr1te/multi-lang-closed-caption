export type ErrorResponsePayload = {
  type: string;
  code: string;
  status: string | number;
  message: string;
  errors: any;
  stack?: any;
};
