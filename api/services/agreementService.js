const fs = require('fs');
const { generateHtml, generatePdf, readFilenames } = require('../helpers/helper');

const generateAgreement = async (queryParams, next) => {
  let pdf;
  try {
    const html = await generateHtml(queryParams);
    pdf = await generatePdf(html, queryParams);
  } catch (error) {
    throw new Error(error);
  }
  return pdf;
}

const getAgreements = async (queryParams, next) => {
  let files;
  try {
    files = await readFilenames();
  } catch (error) {
    throw new Error(error);
  }
  return files;
}

module.exports = {
  generateAgreement,
  getAgreements
}
