const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if(pathname && pathname.split('/').length > 1) { 
    res.statusCode = 400;
    res.end('subfolders are not supported');
    return;
  };

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if(fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('file already exist');
      } else {
        const stream = fs.createWriteStream(filepath);
        const limitSizeStream = new LimitStream({limit: 1048576});
  
        req.pipe(limitSizeStream).pipe(stream);
  
        stream.on('open', () => {
          console.log('stream open');
        });
    
        limitSizeStream.on('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('file is too big');
          } else {
            res.statusCode = 500;
            res.end('something went wrong');
          };
        });
  
        stream.on('error', (err) => {
          res.statusCode = 500;
          res.end('something went wrong');
        });
      
        stream.on('finish', () => {
          res.statusCode = 201;
          res.end('successfully');
        });
       
        stream.on('close', () => {
          console.log('stream close');
        });
  
        req.on('aborted', () => { 
          limitSizeStream.destroy();
          stream.destroy();
          fs.unlink(filepath, () => {});
        });
      };
     

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
