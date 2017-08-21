const defaultMap = require('./default_map');

const coreFields = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src'];

module.exports = function bunyanEncoder(mapCoreFields = defaultMap, stream = process.stdout) {
  return {
    write: function (rec) {
      if (typeof(rec) === 'string' || (rec instanceof String)) {
        throw new Error('Stream must be of raw type');
      }

      const recCopy = JSON.parse(JSON.stringify(rec));

      const mappedCoreFields = mapCoreFields(recCopy);

      coreFields.forEach(field => recCopy[field] = undefined);

      Object.assign(recCopy, mappedCoreFields);

      stream.write(JSON.stringify(recCopy));
    }
  };
};
