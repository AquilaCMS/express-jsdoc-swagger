const errorMessage = require('../utils/errorMessage');
const STATUS_CODES = require('./validStatusCodes');
const mapDescription = require('../utils/mapDescription');
const getContent = require('./content')('@return');

const hasOldContent = (value, status) => (value[status] && value[status].content);

const EXAMPLE_DIVIDER = ' | ';
const mapExample = example => (example || '').split(EXAMPLE_DIVIDER);

const formatResponses = values => {
  let response = {};
  let i = 0;
  while (i < values.length) {
    const value = values[i];
    const [descriptions, exampleName, exampleValue] = mapExample(value.description);
    const [status, description, contentType] = mapDescription(descriptions);
    if (!STATUS_CODES[status]) {
      errorMessage(`Status ${status} is not valid to create a response`);
      return {};
    }
    const content = {
      ...response,
      [status]: {
        description,
        content: {
          ...(hasOldContent(response, status) ? { ...response[status].content } : {}),
          ...getContent(value.type, contentType, value.description),
        },
      },
    };
    if (exampleName && exampleValue) {
      content[status].content[Object.keys(content[status].content)[0]].examples = {
        [exampleName]: {
          value: exampleValue,
        },
      };
    }
    response = content;
    i += 1;
  }
  return response;
};

const responsesGenerator = (returnValues = []) => {
  if (!returnValues || !Array.isArray(returnValues)) return {};
  return formatResponses(returnValues);
};

module.exports = responsesGenerator;
