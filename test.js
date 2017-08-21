const bunyanEncoder = require('./index');
const sinon = require('sinon');
const {assert} = require('chai');

describe('bunyan-encoder', () => {

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.spy(process.stdout, 'write');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should write message encoded with default layout to stdout', () => {
    //given
    const encoder = bunyanEncoder();
    //when
    encoder.write({v: '1', name: 'nice-microservice', level: 30, time: '2017-08-21T09:37:02.567Z', msg: 'event happened', sessionId: '123'});
    //then
    assert.isTrue(process.stdout.write.calledOnce);
    assert.isString(process.stdout.write.firstCall.args[0]);
    assert.deepEqual(JSON.parse(process.stdout.write.firstCall.args[0]), {application: 'nice-microservice', logLevel: 'info', '@timestamp': '2017-08-21T09:37:02.567Z', message: 'event happened', sessionId: '123'});
  });

  it('should write message encoded with defined layout', () => {
    //given
    const encoder = bunyanEncoder({time: 'customTime', msg: 'customMsg'});
    //when
    encoder.write({v: '1', time: '2017-08-21T09:37:02.567Z', msg: 'event happened', sessionId: '123'});
    //then
    assert.isTrue(process.stdout.write.calledOnce);
    assert.deepEqual(JSON.parse(process.stdout.write.firstCall.args[0]), {customTime: '2017-08-21T09:37:02.567Z', customMsg: 'event happened', sessionId: '123'});
  });

  it('should write encoded message to a defined stream', () => {
    //given
    const stream = {write: sinon.spy()};
    const encoder = bunyanEncoder({msg: 'message'}, stream);
    //when
    encoder.write({msg: 'event happened'});
    //then
    assert.isTrue(stream.write.calledOnce);
    assert.deepEqual(JSON.parse(stream.write.firstCall.args[0]), {message: 'event happened'});
  });

  it('should throw if log record is stringified', () => {
    assert.throws(() => bunyanEncoder().write('{"msg": "event happened"}'));
  });
});
