const debug = require('debug')('express-jsdoc-swagger:transforms:paths');
const responsesGenerator = require('./responses');
const parametersGenerator = require('./parameters');
const requestBodyGenerator = require('./requestBody');
const { getTagInfo, getTagsInfo, formatDescriptionTag } = require('../utils/tags');
const {
  validRequestBodyMethods: bodyMethods,
  validHTTPMethod,
} = require('../utils/httpMethods');

const formatTags = (tags = []) => tags.map(({ description }) => {
  const { name } = formatDescriptionTag(description);
  return name;
});

const formatSecurity = (securityValues = []) => securityValues.map(({ description }) => ({
  [description]: [],
}));

const bodyParams = ({ name }) => name.includes('request.body');

const pathValues = tags => {
  const summary = getTagInfo(tags, 'summary');
  const deprecated = getTagInfo(tags, 'deprecated');
  const isDeprecated = !!deprecated;
  /* Response info */
  const returnValues = getTagsInfo(tags, 'return');
  const responses = responsesGenerator(returnValues);
  /* Parameters info */
  const paramValues = getTagsInfo(tags, 'param');
  const parameters = parametersGenerator(paramValues);
  /* Tags info */
  const tagsValues = getTagsInfo(tags, 'tags');
  /* Security info */
  const securityValues = getTagsInfo(tags, 'security');
  /* Request body info */
  const bodyValues = paramValues.filter(bodyParams);
  return {
    summary,
    isDeprecated,
    responses,
    parameters,
    tagsValues,
    bodyValues,
    securityValues,
  };
};

const parsePath = (path, state) => {
  debug(`Transforms path: ${JSON.stringify(path)}`);
  if (!path.description || !path.tags) return {};
  const [method, endpoint] = path.description.split(' ');
  // if jsdoc comment des not contain structure <Method> - <Endpoint> is not valid path
  const lowerCaseMethod = method.toLowerCase();
  if (!validHTTPMethod(lowerCaseMethod)) return {};
  const { tags } = path;
  const {
    summary, bodyValues, isDeprecated, responses, parameters, tagsValues, securityValues,
  } = pathValues(tags);
  const hasBodyValues = bodyValues.length > 0;
  const requestBody = requestBodyGenerator(bodyValues);
  return {
    ...state,
    [endpoint]: {
      ...state[endpoint],
      [lowerCaseMethod]: {
        deprecated: isDeprecated,
        summary: summary && summary.description ? summary.description : '',
        security: formatSecurity(securityValues),
        responses,
        parameters,
        tags: formatTags(tagsValues),
        ...(bodyMethods[lowerCaseMethod] && hasBodyValues ? { requestBody } : {}),
      },
    },
  };
};

const parsePaths = (swaggerObject = {}, paths = []) => {
  if (!paths || !Array.isArray(paths)) return { paths: {} };
  const pathObject = paths.reduce((acum, item) => ({
    ...acum, ...parsePath(item, acum),
  }), {});
  return {
    ...swaggerObject,
    paths: pathObject,
  };
};

module.exports = parsePaths;
