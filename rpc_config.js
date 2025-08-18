
const { RetoolRPC } = require('retoolrpc');
const {
  getSubscriberProperties,
  getSubscriberPropertyByName,
  updateSubscriberProperties,
  getApiKeyForAccount
} = require("./rpc_implementation");

const rpc = new RetoolRPC({
  apiToken: 'retool_01k0evfddn0begk04435phht6t',
  host: 'https://zetaglobalcustomerengineeringintern.retool.com',  
  resourceId: '8e81d1c4-ba61-484d-99df-de939fccb8f3',
  environmentName: 'production',
  pollingIntervalMs: 1000,
  version: '0.0.1',
  logLevel: 'info',
});


rpc.register({
  name: 'getSubscriberProperties',
  arguments: {
    search: { type: 'string', required: false } 
  },
  implementation: async (args) => getSubscriberProperties(args.search)
});

rpc.register({
  name: 'getSubscriberPropertyByName',
  arguments: { name: { type: 'string', required: true } },
  implementation: async (args) => getSubscriberPropertyByName(args.name)
});

rpc.register({
  name: 'updateSubscriberProperties',
  arguments: {
    propertyName: { type: 'string', required: true },
    propDisplayName: { type: 'string', required: false },
    description: { type: 'string', required: false }
  },
  implementation: async (args) => updateSubscriberProperties(args)
});

rpc.register({
  name: 'getApiKeyForAccount',
  arguments: { accountId: { type: 'string', required: true } },
  implementation: async (args) => getApiKeyForAccount(args.accountId)
});


rpc.listen();
