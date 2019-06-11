var express = require('express');
var fs = require('fs');
var app = express();
const HummusRecipe = require('hummus-recipe');

const createPdf = (query) => {
  return new Promise (resolve => {
    const pdfDoc = new HummusRecipe('vuokrasopimus.pdf', 'output.pdf');
    const top = 363;

    pdfDoc
      .editPage(1)
      .text(query.name, 285, top, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.hetu, 285, top + 26, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.phone, 285, top + 51, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.email, 285, top + 76, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.address, 285, top + 101, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.postalCode, 285, top + 127, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.startDate, 285, top + 152, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.place, 285, top + 177, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.storageAddress, 285, top + 202, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.storageNumber, 285, top + 228, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.size, 285, top + 253, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.rent, 285, top + 279, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.rentDeposit, 285, top + 304, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .text(query.stacks, 285, top + 329, {
          color: '#000000',
          fontSize: 11,
          bold: false,
          font: 'Cambria',
          opacity: 1
      })
      .endPage()
      .endPDF();
      resolve();
  })
};

app.get('/', function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    createPdf(req.query);

    var filePath = "/output.pdf";
    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
  } else {
    res.send('Lisää path parametrit: name, hetu, phone, email, address');
  }
});

app.get('/pdf', function (req, res) {
    var filePath = "/output.pdf";

    fs.readFile(__dirname + filePath , function (err,data){
        res.contentType("application/pdf");
        res.send(data);
    });
});


var server = app.listen(8080, function () {
   var port = server.address().port

   console.log("App running port:%s", port)
})
