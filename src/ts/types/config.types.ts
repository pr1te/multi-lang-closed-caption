export type Config = {
  env: string
  port: number
  version?: string
  debug: boolean
  corsOriginWhitelist: string[]

  aws: {
    region?: string
    accessKeyId?: string
    secretAccessKey?: string
  }

  storage: {
    bucket?: string
  }
}
