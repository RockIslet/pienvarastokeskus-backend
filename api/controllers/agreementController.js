const fs = require('fs');
const { generateAgreement, getAgreements } = require('../services/agreementService');

const createAgreement = async (req, res, next) => {
  let agreement;
  try {
    agreement = await generateAgreement(req.query, next);
  } catch(error) {
    res.status(500).json({ error: error.toString() });
  }
    res.send(agreement);
};


const getAgreementList = async (req, res, next) => {
  let agreements;
  try {
    agreements = await getAgreements();
  } catch(error) {
    res.status(500).json({ error: error.toString() });
  }
    res.send(agreements);
};

module.exports = {
  createAgreement,
  getAgreementList
}
