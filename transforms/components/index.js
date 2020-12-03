const { getTagInfo, getTagsInfo } = require('../utils/tags');
const mapDescription = require('../utils/mapDescription');
const { refSchema, formatRefSchema } = require('../utils/refSchema');
const addEnumValues = require('../utils/enumValues');
const formatDescription = require('../utils/formatDescription');
const combineSchema = require('../utils/combineSchema');
const addDefaultValue = require('../utils/defaultValue');

const REQUIRED = 'required';

const getPropertyName = ({ name: propertyName }) => {
  const [name] = propertyName.split('.');
  return name;
};

const addTypeApplication = (applications, expression) => {
  if (!applications && !expression) return {};
  return {
    type: expression.name,
    items: {
      type: applications[0].name,
    },
  };
};

const addRefSchema = (typeName, applications, elements) => {
  if (!typeName && !elements) return { items: formatRefSchema(applications) };
  return {};
};

const formatProperties = properties => {
  if (!properties || !Array.isArray(properties)) return {};
  let response = {};
  let i = 0;
  while (i < properties.length) {
    const property = properties[i];
    const name = getPropertyName(property);
    const {
      name: typeName, applications, expression, elements,
    } = property.type;
    const [descriptionValue, enumValues, defaultValue] = formatDescription(property.description);
    const [description, format] = mapDescription(descriptionValue);
    response = {
      ...response,
      [name]: {
        description,
        ...refSchema(typeName),
        ...combineSchema(elements),
        ...addTypeApplication(applications, expression),
        ...addRefSchema(typeName, applications, elements),
        ...(format ? { format } : {}),
        ...addEnumValues(enumValues),
        ...addDefaultValue(defaultValue),
      },
    };
    i += 1;
  }
  return response;
};

const getRequiredProperties = properties => (
  properties.filter(({ name }) => name.includes(REQUIRED))
);

const formatRequiredProperties = requiredProperties => requiredProperties.map(getPropertyName);

const parseSchema = schema => {
  const typedef = getTagInfo(schema.tags, 'typedef');
  const propertyValues = getTagsInfo(schema.tags, 'property');
  const requiredProperties = getRequiredProperties(propertyValues);
  if (!typedef || !typedef.name) return {};
  const { elements } = typedef.type;
  return {
    [typedef.name]: {
      ...combineSchema(elements),
      description: schema.description,
      ...(requiredProperties.length ? {
        required: formatRequiredProperties(requiredProperties),
      } : {}),
      type: 'object',
      properties: formatProperties(propertyValues),
    },
  };
};

const parseComponents = (swaggerObject = {}, components = []) => {
  if (!components || !Array.isArray(components)) return { components: { schemas: {} } };

  let componentSchema = {};
  let i = 0;
  while (i < components.length) {
    const item = components[i];
    componentSchema = { ...componentSchema, ...parseSchema(item) };
    i += 1;
  }
  return {
    ...swaggerObject,
    components: {
      ...swaggerObject.components,
      schemas: componentSchema,
    },
  };
};

module.exports = parseComponents;
