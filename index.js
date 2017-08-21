const coreFields = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src'];

const defaultFieldMapping = {
  level: ['logLevel', level => logLevelMapping[level]],
  name: 'application',
  time: '@timestamp',
  msg: 'message'
};

const logLevelMapping = {
  '10': 'trace',
  '20': 'debug',
  '30': 'info',
  '40': 'warn',
  '50': 'error',
  '60': 'fatal'
};

module.exports = function bunyanEncoder(coreFieldMapping = defaultFieldMapping, stream = process.stdout) {
  return {
    write: function (rec) {
      if (typeof(rec) === 'string' || (rec instanceof String)) {
        throw new Error('Trying to log stringified record. Forgot to define "raw: true"?');
      }
      const recCopy = JSON.parse(JSON.stringify(rec));

      coreFields.forEach(field => {
        if (field in coreFieldMapping) {
          const mapping = coreFieldMapping[field];
          if (mapping.constructor === Array) {
            const [name, mapValue] = mapping;
            recCopy[name] = mapValue(recCopy[field]);
          } else {
            recCopy[mapping] = recCopy[field];
          }
        }
        delete recCopy[field];
      });

      stream.write(JSON.stringify(recCopy));
    }
  };
};
