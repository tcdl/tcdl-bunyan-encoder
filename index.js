const defaultMap = require('./default_map');

const coreFields = [
  'v',
  'level',
  'name',
  'hostname',
  'pid',
  'time',
  'msg',
  'src'
];

module.exports = function bunyanEncoder(mapCoreFields = defaultMap, stream = process.stdout) {
  return {
    write: function (rec) {
      if (typeof(rec) === 'string' || (rec instanceof String)) {
        throw new Error('Stream must be raw');
      }

      const mappedCoreFields = mapCoreFields(rec);

      coreFields.forEach(field => rec[field] = undefined);
      Object.assign(rec, mappedCoreFields);

      stream.write(JSON.stringify(rec) + '\n');
    }
  };
};
