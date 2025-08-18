

async function getSubscriberProperties(search) {
  const properties = [
    { propertyName: "email", type: "string", displayName: "Email Address", description: "User email" },
    { propertyName: "firstName", type: "string", displayName: "First Name", description: "User's first name" },
    { propertyName: "age", type: "integer", displayName: "Age", description: "User's age in years" }
  ];

  
  if (search) {
    const lowerSearch = search.toLowerCase();
    return properties.filter(prop =>
      prop.propertyName.toLowerCase().includes(lowerSearch) ||
      prop.displayName.toLowerCase().includes(lowerSearch) ||
      prop.description.toLowerCase().includes(lowerSearch)
    );
  }

  return properties;
}

async function getSubscriberPropertyByName(name) {
  const properties = await getSubscriberProperties();
  return properties.find(prop => prop.propertyName === name) || null;
}

async function updateSubscriberProperties({ propertyName, propDisplayName, description }) {
  return {
    success: true,
    updated: { propertyName, propDisplayName, description }
  };
}

async function getApiKeyForAccount(accountId) {
  return { accountId, apiKey: "demo_api_key_123456" };
}

module.exports = {
  getSubscriberProperties,
  getSubscriberPropertyByName,
  updateSubscriberProperties,
  getApiKeyForAccount
};
