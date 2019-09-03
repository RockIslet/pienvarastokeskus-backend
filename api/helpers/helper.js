var pdf = require('html-pdf');
var fs = require('fs');
var path = require('path');
const { JSDOM } = require('jsdom');

const options = {
  format: 'Letter',
  type: 'pdf'
};

const generateHtml = (request) => {
  return new Promise ((resolve, reject) => {
    const document = JSDOM.fromFile('./docs/sopimus.html').then(dom => {
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
    const name = request.name.split(' ').join('_');
    pdf.create(html, options).toFile(`./docs/agreements/${name}-${time.getTime()}.pdf`, (error, res) => {
      if (error) {
        reject(error);
      }
      resolve(res);
    });
  });
};


const readFilenames = () => {
  return new Promise ((resolve, reject) => {
    const folder = './docs/agreements';
    fs.readdir(folder, (error, files) => {
      let list;
      if (files.length) {
        list = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
      } else {
        list = { error: 'no files' };
      }
      if (error) {
        reject(error);
      }
      resolve(list);
    });
  });
}

module.exports = {
  generateHtml,
  generatePdf,
  readFilenames
}
