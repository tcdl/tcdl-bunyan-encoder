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

  it('should write message to stdout mapped with default strategy', () => {
    //given
    const encoder = bunyanEncoder();

    //when
    encoder.write({
      v: '1',
      name: 'nice-microservice',
      level: 30,
      time: '2017-08-21T09:37:02.567Z',
      msg: 'event happened',
      sessionId: '123'
    });

    //then
    assert.isTrue(process.stdout.write.calledOnce);
    assert.isString(process.stdout.write.firstCall.args[0]);
    assert.deepEqual(JSON.parse(process.stdout.write.firstCall.args[0]), {
      application: 'nice-microservice',
      logLevel: 'INFO',
      timestamp: '2017-08-21T09:37:02.567Z',
      message: 'event happened',
      sessionId: '123'
    });
    assert.isTrue(process.stdout.write.firstCall.args[0].endsWith('\n'));
  });

  it('should write message to stdout mapped with defined strategy', () => {
    //given
    const encoder = bunyanEncoder(rec => ({
      customTime: rec.time,
      customMsg: rec.msg,
      level: rec.level
    }));

    //when
    encoder.write({
      v: '1',
      time: '2017-08-21T09:37:02.567Z',
      msg: 'event happened',
      sessionId: '123'}
    );

    //then
    assert.isTrue(process.stdout.write.calledOnce);
    assert.deepEqual(JSON.parse(process.stdout.write.firstCall.args[0]), {
      customTime: '2017-08-21T09:37:02.567Z',
      customMsg: 'event happened',
      sessionId: '123'
    });
  });

  it('should write message to a defined stream', () => {
    //given
    const stream = {write: sinon.spy()};
    const encoder = bunyanEncoder(rec => ({message: rec.msg}), stream);

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
