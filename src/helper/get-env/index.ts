function getEnv (envName: string, defaultValue?: any): string {
  return process.env[envName] || defaultValue;
}

export default getEnv;
