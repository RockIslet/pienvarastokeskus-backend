const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const routes = require('./routes/router');
const bodyParser = require('body-parser');
const listEndpoints = require('express-list-endpoints')

app.use(express.static(__dirname + '/docs'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', router);
router.use(routes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Pienvarastokeskus backend running port: %s', port);
  console.log('Api list:', listEndpoints(app))
});
