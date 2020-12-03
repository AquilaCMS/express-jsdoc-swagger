const { validateTypes, validateFormat } = require('./validateTypes');

const REF_ROUTE = '#/components/schemas/';

const refSchema = (value) => {
    if (!value) return {};
    let schema = validateFormat(value);
    if (!schema) {
        if (validateTypes(value)) {
            schema = { type: value };
        } else {
            schema = { $ref: `${REF_ROUTE}${value}` };
        }
    }
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
    return response;
};

module.exports = {
    refSchema,
    formatRefSchema,
};
