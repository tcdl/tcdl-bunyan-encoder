const coreFields = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src'];

module.exports = function bunyanEncoder(encoding, stream = process.stdout) {
  return {
    write: function (rec) {
      const recCopy = JSON.parse(JSON.stringify(rec));
      coreFields.forEach(field => {
        if (field in encoding) {
          recCopy[encoding[field]] = recCopy[field];
        }
        delete recCopy[field];
      });
      stream.write(JSON.stringify(recCopy));
    }
  };
};
