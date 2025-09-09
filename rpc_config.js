const { RetoolRPC } = require("retoolrpc");
const {
  getApiKeyForAccount,
  getSubscriberPropertyTypes,
  updateSubscriberPropertyTypes

} = require("./rpc_implementation");

const rpc = new RetoolRPC({
  apiToken: "retool_01k0evfddn0begk04435phht6t", 
  host: "https://zetaglobalcustomerengineeringintern.retool.com",
  resourceId: "8e81d1c4-ba61-484d-99df-de939fccb8f3",
  environmentName: "production",
  pollingIntervalMs: 1000,
  version: "0.0.1",
  logLevel: "info",
});


rpc.register({
  name: "getApiKeyForAccount",
  arguments: { accountId: { type: "string", required: true } },
  implementation: async (args) =>
    getApiKeyForAccount(args.accountId),
});


rpc.register({
  name: "getSubscriberPropertyTypes",
  arguments: {
    accountId: { type: "string", required: true },
    apiKey: { type: "string", required: true },
    page: { type: "number", required: false },       
    per_page: { type: "number", required: false },
    sort_by: { type: "string", required: false },
    order: { type: "string", required: false },
    format_as_single_object: { type: "string", required: false },
    keyword: { type: "string", required: false },
  },
  implementation: async (args) => {
    const pageNumber = (args.page); 
    const pageSize = (args.per_page);

   
    const offset = (pageNumber - 1) * pageSize;

    return getSubscriberPropertyTypes(args.accountId, args.apiKey, {
      per_page: pageSize,
      page: pageNumber,
      sort_by: args.sort_by,
      order: args.order,
      format_as_single_object: args.format_as_single_object,
      keyword: args.keyword,
    });
  },
});


rpc.register({
  name: "updateSubscriberPropertyTypes",
  arguments: {
    accountId: { type: "string", required: true },
    apiKey: { type: "string", required: true },
    subscriberId: { type: "string", required: true },
    property:{type:"json", required:true},
  },
  implementation: async (args) => updateSubscriberPropertyTypes(args),
});


rpc.listen();
