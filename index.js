const clone = require('lodash.clone');

const coreFields = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src'];

module.exports = function bunyanEncoder(encoding, stream = process.stdout) {
  return {
    write: function (rec) {
      const clonedRec = clone(rec);
      coreFields.forEach(field => {
        if (field in encoding) {
          clonedRec[encoding[field]] = clonedRec[field];
        }
        delete clonedRec[field];
      });
      stream.write(clonedRec);
    }
  };
};
