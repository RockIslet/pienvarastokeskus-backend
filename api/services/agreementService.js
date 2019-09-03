const fs = require('fs');
const VismaSign = require('../helpers/vismaSign');
require('dotenv').config();
const { generateHtml, generatePdf, readFilenames } = require('../helpers/helper');

const generateAgreement = async (queryParams) => {
  let pdf;
  try {
    const html = await generateHtml(queryParams);
    pdf = await generatePdf(html, queryParams);
    await signDocument(queryParams, pdf.filename);
  } catch (error) {
    throw new Error(error);
  }
  return pdf;
}

async function getPdf(url) {
  return await fs.readFileSync(url);
}

const signDocument = async (userData, pdfUrl) => {
  const baseUrl = "https://sign.visma.net/";
  const identifier = process.env.VISMA_SIGN_IDENTIFIER;
  const secret = Buffer.from(process.env.VISMA_SIGN_SECRET, "base64");
  const vismaSign = new VismaSign(baseUrl, identifier, secret);
  const document = {document: {name: userData.name}};
  const pdfFile = await getPdf(pdfUrl);
  const invitations = [{ email: userData.email }];
  
  const documentUuid = await vismaSign.createDocument(document);
  console.log("Created document", documentUuid);
  
  const fileUuid = await vismaSign.addFile(documentUuid, pdfFile, "file-name-not-required.pdf");
  console.log("Added file", fileUuid);
  
  const createdInvitations = await vismaSign.createInvitations(documentUuid, invitations);
  console.log("Created invitations", createdInvitations);
}

const getAgreements = async (queryParams) => {
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
