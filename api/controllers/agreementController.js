const fs = require('fs');
const { generateAgreement, getAgreements } = require('../services/agreementService');
var express = require('express')
var router = express.Router();

router.post('/create', async (req, res) => {
  let agreement;
  try {
    agreement = await generateAgreement(req.body);
  } catch(error) {
    res.status(500).json({ error: error.toString() });
  }
  res.send(agreement);
});

router.get('/list', async (req, res) => {
  let agreements;
  try {
    agreements = await getAgreements();
  } catch(error) {
    res.status(500).json({ error: error.toString() });
  }
  res.send(agreements);
});

module.exports = router;
