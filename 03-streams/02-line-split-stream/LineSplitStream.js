const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
   
    options.decodeStrings = false;

    super(options);
    this.text = "";
  }

  _transform(chunk, encoding, callback) {
    if(encoding !== 'utf8') {
      this.emit('error', new Error('only utf-8'));
      return callback();
    }
    this.text += chunk;
    const textArr = this.text.split(os.EOL);
    textArr.forEach((item, idx) => {
      if(idx == textArr.length - 1) {
        return this.text = item;
      }
      this.push(item);
    })
  
    callback();
  }

  _flush(callback) {
    this.push(this.text)
    callback();
  }
}

module.exports = LineSplitStream;
