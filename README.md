# bunyan-encoder

A stream decorator for bunyan that allows to rename or remove bunyan core fields in output log records.

## Installation
```
$ npm install bunyan-encoder
```

## Usage
```js
const bunyan = require('bunyan');
const bunyanEncoder = require('bunyan-encoder');

const logger = bunyan.createLogger({
  streams: [bunyanEncoder()]
});

```
By default, `bunyan-encoder` will write records to stdout applying following mapping to the core fields:

|Bunyan field|Output field|
|----|----|
|msg|message|
|time|timestamp|
|name|application|
|level|logLevel|

Also, the log level value is converted from numeric to string representation:

|Bunyan level|Output level|
|----|----|
|10|TRACE|
|20|DEBUG|
|30|INFO|
|40|WARN|
|50|ERROR|
|60|ERROR|
