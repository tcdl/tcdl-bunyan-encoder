const bunyanEncoder = require('./index');
const sinon = require('sinon');
const {assert} = require('chai');

describe('bunyan-encoder', () => {

  const stream = {write: () => {}};
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(stream, 'write');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should write encoded message to given stream', () => {
    //given
    const encoder = bunyanEncoder({time: '@timestamp', msg: 'message'}, stream);
    const timestamp = new Date().toISOString();
    //when
    encoder.write({v: '1', time: timestamp, msg: 'event happened', sessionId: '123'});
    //then
    assert.isTrue(stream.write.calledOnce);
    assert.isString(stream.write.firstCall.args[0]);
    assert.deepEqual(JSON.parse(stream.write.firstCall.args[0]), {'@timestamp': timestamp, message: 'event happened', sessionId: '123'});
  });

  it('should write to stdout stream if no stream specified', () => {
    //given
    sandbox.stub(process.stdout, 'write');
    const encoder = bunyanEncoder({msg: 'message'});
    //when
    encoder.write({msg: 'event happened'});
    //then
    assert.isTrue(process.stdout.write.calledOnce);
  });
});
