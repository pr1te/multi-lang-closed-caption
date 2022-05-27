import { Application as ExpressApplication } from 'express';

export type Application = ExpressApplication & { configure (callback: (self: Application) => void): void };
