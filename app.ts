const axios = require('axios').default;
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const OpenApiValidator = require('express-openapi-validator');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');


const port = 3001;
const app = express();
const apiSpec = path.join(__dirname, 'api.yaml');
const swaggerDocument = YAML.load(apiSpec);
var options = {
    customCss: '.swagger-ui .topbar { display: none }'
  };

// 1. Install bodyParsers for the request types your API will support
app.use(express.urlencoded({ extended: false }));
app.use(express.text());
app.use(express.json());

app.use('/spec', express.static(apiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,options));
// 2. Add the OpenApiValidator middleware
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateResponses: true, // default false
    // 3. Provide the path to the controllers directory
    operationHandlers: path.join(__dirname), // default false
  }),
);

// 4. Add an error handler
app.use((err:any, req:any, res:any, next:any) => {
  // format errors
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

http.createServer(app).listen(port);
console.log(`Listening on port ${port}`);
const get_exchange_rate = async ()=> {
  const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=btc%2Ceth%2Cltc%2Cbch%2Cbnb%2Ceos%2Cxrp%2Cxlm%2Clink%2Cdot%2Cyfi%2Cusd%2Caed%2Cars%2Caud%2Cbdt%2Cbhd%2Cbmd%2Cbrl%2Ccad%2Cchf%2Cclp%2Ccny%2Cczk%2Cdkk%2Ceur%2Cgbp%2Chkd%2Chuf%2Cidr%2Cils%2Cinr%2Cjpy%2Ckrw%2Ckwd%2Clkr%2Cmmk%2Cmxn%2Cmyr%2Cngn%2Cnok%2Cnzd%2Cphp%2Cpkr%2Cpln%2Crub%2Csar%2Csek%2Csgd%2Cthb%2Ctry%2Ctwd%2Cuah%2Cvef%2Cvnd%2Czar%2C%20dr%2Cxag%2Cxau%2Cbits%2Csats')

  app.locals.exchange_rate = response?.data?.monero;
}
setInterval( get_exchange_rate,5000)
get_exchange_rate()

module.exports = app;