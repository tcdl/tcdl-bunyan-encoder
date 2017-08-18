const bunyanEncoder = require('./index');
const sinon = require('sinon');
const {assert} = require('chai');

describe('bunyan-encoder', () => {

  let stream;

  beforeEach(() => {
    stream = {write: () => {}};
    sinon.spy(stream, 'write');
  });

  it('should write encoded message to given stream', () => {
    //given
    const encoder = bunyanEncoder({time: '@timestamp', msg: 'message'}, stream);
    const timestamp = new Date().toISOString();
    //when
    encoder.write({v: '1', time: timestamp, msg: 'event happened', sessionId: '123'});
    //then
    assert.isTrue(stream.write.calledOnce);
    assert.deepEqual(stream.write.firstCall.args[0], {'@timestamp': timestamp, message: 'event happened', sessionId: '123'});
  });
});
