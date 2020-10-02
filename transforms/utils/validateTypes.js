const TYPES = [
  'integer',
  'number',
  'string',
  'boolean',
  'object',
];

const FORMAT = {
  date: { type: 'string', format: 'date' },
  'date-time': { type: 'string', format: 'date-time' },
  password: { type: 'string', format: 'password' },
  byte: { type: 'string', format: 'byte' },
  binary: { type: 'string', format: 'binary' },
  email: { type: 'string', format: 'email' },
  uuid: { type: 'string', format: 'uuid' },
  uri: { type: 'string', format: 'uri' },
  hostname: { type: 'string', format: 'hostname' },
  ipv4: { type: 'string', format: 'ipv4' },
  ipv6: { type: 'string', format: 'ipv6' },
};

const validateTypes = type => TYPES.includes(type);

const validateFormat = type => FORMAT[type];

module.exports = { validateTypes, validateFormat };
