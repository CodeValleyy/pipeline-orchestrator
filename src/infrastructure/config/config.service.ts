require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getAppPort() {
    return this.getValue('APP_PORT');
  }

  public getAppHostname() {
    return this.getValue('APP_HOSTNAME');
  }

  public getDomain() {
    return this.getValue('APP_DOMAIN');
  }

  public getFrontendUrl() {
    return this.getValue('FRONTEND_URL');
  }

  public getDynoCodeUrl() {
    return this.getValue('DYNO_CODE_URL');
  }

  public getContentCraftersUrl() {
    return this.getValue('CONTENT_CRAFTERS_URL') + '/v1';
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'APP_PORT',
  'APP_HOSTNAME',
  'APP_DOMAIN',
  'DYNO_CODE_URL',
  'CONTENT_CRAFTERS_URL',
  'FRONTEND_URL',
]);

export { configService };
