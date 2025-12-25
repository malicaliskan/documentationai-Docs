const {  getDataPropertyConfig } = require("./configs");

function getProperties(serviceConfig, projectConfig) {
  const properties = [];

  const userId = getDataPropertyConfig(
    "userId",
    "ID",
    " An ID value to represent the user who is created as a stripe customer",
    {
      sessionSettings: {
        isSessionData: true,
        sessionParam: "userId",
        isOwnerField: true,
      },
      relationSettings: {
        hasRelation: false,
      },
      indexSettings: { indexedInDb: true, unique: true, isSecondaryKey: true },
    }
  );

  properties.push(userId);

  const customerId = getDataPropertyConfig(
    "customerId",
    "String",
    `A string value to represent the customer id which is generated on the Stripe gateway. This id is used to represent the customer in the Stripe gateway`,
    {
      basicSettings: { isRequired: true, allowUpdate: false },
      indexSettings: { indexedInDb: true, unique: true, isSecondaryKey: true },
    }
  );
  properties.push(customerId);

  const platform = getDataPropertyConfig(
    "platform",
    "String",
    `A String value to represent payment platform which is used to make the payment. It is stripe as default. It will be used to distinguesh the payment gateways in the future.`,
    {
      basicSettings: {
        isRequired: true,
        allowUpdate: false,
        defaultValues: { default: "stripe" },
      },
    }
  );

  properties.push(platform);

  return properties;
}

module.exports = createPaymentCustomerObjectConfig = (
  serviceConfig,
  projectConfig
) => {
  return {
    objectSettings: {
      basicSettings: {
        name: "sys_paymentCustomer",
        description: `A payment storage object to store the customer values of the payment platform`,
        useSoftDelete: true,
      },
      authorization: {
        dataObjectAccess: "accessPrivate",
        objectDataIsInTenantLevel: true,
      },
      redisEntityCacheSettings: {
        useEntityCaching: false,
      },
      compositeIndexSettings: [],
    },
    properties: getProperties(serviceConfig, projectConfig),

  };
};
