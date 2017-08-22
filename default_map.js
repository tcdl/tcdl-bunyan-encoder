const logLevelMapping = {
  '10': 'TRACE',
  '20': 'DEBUG',
  '30': 'INFO',
  '40': 'WARN',
  '50': 'ERROR',
  '60': 'ERROR'
};

module.exports = function mapCoreFields(rec) {
  return {
    logLevel: logLevelMapping[rec.level],
    application: rec.name,
    timestamp: rec.time,
    message: rec.msg
  }
};
