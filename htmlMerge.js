var express = require('express');
var pdf = require('html-pdf');
var fs = require('fs');
var path = require('path');
var app = express();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const options = {
  format: 'Letter',
  type: 'pdf'
};

app.use(express.static(__dirname + '/docs'));

app.get('/', (req, res) => {
  generateHtml(req.query).then(html => {
    generatePdf(html, req.query).then(path => {
      fs.readFile(path.filename, (err, data) => {
          res.contentType("application/pdf");
          res.send(data);
          if (err) {
            console.log(err)
          }
      });
    }).catch(error => {
      console.log(error);
    });

  }).catch(error => {
    console.log(error)
    res.send(error);
  });
});

const generateHtml = (request) => {
  return new Promise ((resolve, reject) => {
    let document = JSDOM.fromFile('docs/sopimus.html').then(dom => {
      Object.keys(request).map((key) => {
        const tableObject = dom.window.document.getElementById(key);
        if (tableObject) {
          tableObject.textContent = request[key];
        }
      });
      return dom;
    }).then(dom => {
      resolve(dom.serialize());
    }).catch(error => {
      reject(error);
    });
  })
};

const generatePdf = (html, request) => {
  return new Promise ((resolve, reject) => {
    const time = new Date();
    pdf.create(html, options).toFile(`./${request.name}-${time.getTime()}.pdf`, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};

const server = app.listen(8080, () => {
  const port = server.address().port;
  console.log("Pienvarastokeskus app running port: %s", port)
});
