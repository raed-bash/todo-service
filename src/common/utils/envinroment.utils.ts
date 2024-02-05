export function isEnvDev() {
  const ENV = process.env.NODE_ENV;
  return !ENV || ENV.toLowerCase().startsWith('dev');
}
