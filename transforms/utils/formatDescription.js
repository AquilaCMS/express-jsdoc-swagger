const mapDescription = require('./mapDescription');

const ENUM_IDENTIFIER = 'enum:';
const DEFAULT_IDENTIFIER = 'default:';
const DESCRIPTION_DIVIDER = ' - ';

const formatDescription = description => {
  const descriptionTypes = mapDescription(description);
  const descriptionValue = descriptionTypes.filter(value => (
    !value.includes(ENUM_IDENTIFIER) && !value.includes(DEFAULT_IDENTIFIER)
  )).join(DESCRIPTION_DIVIDER);
  const enumOption = descriptionTypes.find(value => value.includes(ENUM_IDENTIFIER));
  let enumValues;
  if (enumOption) {
    const [, enumOptions] = enumOption.split(ENUM_IDENTIFIER);
    enumValues = enumOptions.split(',');
  }

  const defaultOption = descriptionTypes.find(value => value.includes(DEFAULT_IDENTIFIER));
  let defaultValue;
  if (defaultOption) {
    [, defaultValue] = defaultOption.split(DEFAULT_IDENTIFIER);
  }
  return [descriptionValue, enumValues, defaultValue];
};

module.exports = formatDescription;
