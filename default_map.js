const logLevelMapping = {
  '10': 'trace',
  '20': 'debug',
  '30': 'info',
  '40': 'warn',
  '50': 'error',
  '60': 'error'
};

module.exports = function mapCoreFields(rec) {
  return {
    logLevel: logLevelMapping[rec.level],
    application: rec.name,
    '@timestamp': rec.time,
    message: rec.msg
  }
};
