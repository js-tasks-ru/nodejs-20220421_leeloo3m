const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if(pathname && pathname.split('/').length > 1) { 
    res.statusCode = 400;
    res.end('subfolders are not supported');
  };

  const filepath = path.join(__dirname, 'files', pathname);

  if(!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('file doesnt exist');
  };

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('something went wrong');
        } else {
          res.statusCode = 200;
          res.end('The file was deleted.');
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
