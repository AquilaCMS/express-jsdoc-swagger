const validateTypes = require('./validateTypes');

const REF_ROUTE = '#/components/schemas/';

const refSchema = value => {
  if (!value) return {};
  const isPrimitive = validateTypes(value);
  const schema = isPrimitive ? { type: value } : { $ref: `${REF_ROUTE}${value}` };
  return schema;
};

const formatRefSchema = (applications = []) => {
  let response = {};
  let i = 0;
  while (i < applications.length) {
    const itemTypes = applications[i];
    response = {
      ...response,
      ...refSchema(itemTypes.name),
    };
    i += 1;
  }
};

module.exports = {
  refSchema,
  formatRefSchema,
};
