const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);

      if(pathname.split('/').length > 1) { 
        res.statusCode = 400;
        res.end('error 400')
      };

      stream.on('data', (chunk) => {
       const ret = res.write(chunk);
       if(ret === false){
         stream.pause();
         ret.once('drain', () => {
           stream.resume();
         })
       }
      });

      stream.on('error', (err) => { 
        if(err.code == 'ENOENT') {
          res.statusCode = 404;
          res.end('file not found');
        } else {
          res.statusCode = 500;
          res.end('error 500')
        }
        
      });

      stream.on('end', () => {
        res.statusCode = 200;
        res.end();
      });

      stream.on('close', () => {
        console.log('close')
      });

      stream.on('open', () => {
        console.log('open')
      });

      req.on('aborted', () => {
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
  
  });

module.exports = server;
