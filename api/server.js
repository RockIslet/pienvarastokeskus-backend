const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const routes = require('./routes/router');
const bodyParser = require('body-parser');

const listEndpoints = require('express-list-endpoints');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require('dotenv').config();

app.use(express.static(__dirname + '/docs'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', function(req, res) {
  res.json(listEndpoints(app));
});

router.use(routes);
app.use('/api/v1', router);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Pienvarastokeskus backend running port: %s', port);
});
