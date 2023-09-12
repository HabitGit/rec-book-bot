export class ConfigEnv {
  get(key: string): string {
    const findEnv: string | undefined = process.env[key];
    if (!findEnv) {
      throw new Error('Local variable is empty');
    }
    return findEnv;
  }
}
