const swaggerUi = require('swagger-ui-express');
const merge = require('merge');
const processSwagger = require('./processSwagger');
const swaggerEvents = require('./swaggerEvents');

let instance = null;
const DEFAULT_SWAGGERUI_URL = '/api-docs';

const expressJSDocSwagger = app => {
  if (instance) return () => instance;
  return async (options = {}, userSwagger = {}) => {
    const events = swaggerEvents();
    instance = events.instance;
    let swaggerObject = {};
    try {
      const result = await processSwagger(options, events.processFile);
      swaggerObject = {
        ...swaggerObject,
        ...result,
      };
      swaggerObject = merge.recursive(true, swaggerObject, userSwagger);
      events.finish(swaggerObject);
    } catch (err) {
      events.error = err;
    }
    app.use(options.swaggerUIPath || DEFAULT_SWAGGERUI_URL, async (req, res, next) => {
      swaggerObject = {
        ...swaggerObject,
        host: req.get('host'),
      };
      req.swaggerDoc = swaggerObject;
      next();
    }, swaggerUi.serve, swaggerUi.setup());

    return instance;
  };
};

module.exports = expressJSDocSwagger;
