var express = require('express');
const router = express.Router();
const cors = require('cors');
const agreementController = require('../controllers/agreementController');

router.use(cors());
router.use('/agreement', agreementController);

module.exports = router;
