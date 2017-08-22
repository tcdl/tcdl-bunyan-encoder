# bunyan-encoder

A bunyan stream that allows to rename or remove bunyan core fields in output log records.

## Installation
```
$ npm install bunyan-encoder
```

## Usage
```js
const bunyan = require('bunyan');
const bunyanEncoder = require('bunyan-encoder');

const logger = bunyan.createLogger({
  name: 'myapp',
  streams: [{stream: bunyanEncoder(), type: 'raw'}]
});
```
By default, `bunyan-encoder` will write records to stdout applying following mapping to the core fields:

|Bunyan field|Output field|
|----|----|
|v|-|
|level|logLevel|
|name|application|
|hostname|-|
|pid|-|
|time|timestamp|
|msg|message|
|src|-|

Also, the log level value is converted from numeric to string representation:

|Bunyan level|Output level|
|----|----|
|10|TRACE|
|20|DEBUG|
|30|INFO|
|40|WARN|
|50|ERROR|
|60|ERROR|

## Customization
It is possible to override the default mapping of the core fields by providing a custom mapping function:
```js
bunyanEncoder(rec => {
  return {
    log_level: rec.level,
    event: rec.msg,
    time: rec.time,
    // ...
  }  
});
```
where `rec` is a raw bunyan record. The function should return a bundle that contains needed transformation of the core fields structure. Those core fields that are not included in the returned bundle will not appear in the output log record.

You can also override writing to stdout by providing another Node.js Stream object:
```js
const socket = new net.Socket();
socket.connect(/* ... */);
bunyanEncoder(rec => {/* ... */}, socket);
```