var express = require('express');
const router = express.Router();
const cors = require('cors');
const { createAgreement, getAgreementList } = require('../controllers/agreementController');

router.use(cors());

router.route('/agreement')
  .get(getAgreementList)
  .post(createAgreement)

module.exports = router;
