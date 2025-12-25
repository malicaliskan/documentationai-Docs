const {  getDataPropertyConfig } = require("./configs");

function getProperties(serviceConfig, projectConfig) {
  const properties = [];

  const paymentMethodId = getDataPropertyConfig(
    "paymentMethodId",
    "String",
    `A string value to represent the id of the payment method on the payment platform.`,
    {
      basicSettings: { isRequired: true, allowUpdate: false },
      indexSettings: { indexedInDb: true, unique: true, isSecondaryKey: true },
    }
  );
  properties.push(paymentMethodId);

  const userId = getDataPropertyConfig(
    "userId",
    "ID",
    " An ID value to represent the user who owns the payment method",
    {
      sessionSettings: {
        isSessionData: true,
        sessionParam: "userId",
        isOwnerField: true,
      },
      basicSettings: { isRequired: true, allowUpdate: false },
      indexSettings: { indexedInDb: true, unique: false, isSecondaryKey: true },
    }
  );

  properties.push(userId);

  const customerId = getDataPropertyConfig(
    "customerId",
    "String",
    `A string value to represent the customer id which is generated on the payment gateway.`,
    {
      basicSettings: { isRequired: true, allowUpdate: false },
      indexSettings: { indexedInDb: true, unique: false, isSecondaryKey: true },
    }
  );
  properties.push(customerId);

  const cardHolderName = getDataPropertyConfig(
    "cardHolderName",
    "String",
    `A string value to represent the name of the card holder. It can be different than the registered customer.`,
    {
      basicSettings: { isRequired: false, allowUpdate: false },
      indexSettings: { indexedInDb: false, unique: false },
    }
  );
  properties.push(cardHolderName);

  const cardHolderZip = getDataPropertyConfig(
    "cardHolderZip",
    "String",
    `A string value to represent the zip code of the card holder. It is used for address verification in specific countries.`,
    {
      basicSettings: { isRequired: false, allowUpdate: false },
      indexSettings: { indexedInDb: false, unique: false },
    }
  );
  properties.push(cardHolderZip);

  const platform = getDataPropertyConfig(
    "platform",
    "String",
    `A String value to represent payment platform which teh paymentMethod belongs. It is stripe as default. It will be used to distinguesh the payment gateways in the future.`,
    {
      basicSettings: {
        isRequired: true,
        allowUpdate: false,
        defaultValues: { default: "stripe" },
      },
    }
  );

  properties.push(platform);

  const cardInfo = getDataPropertyConfig(
    "cardInfo",
    "Object",
    `A Json value to store the card details of the payment method.`,
    {
      basicSettings: {
        isRequired: true,
        allowUpdate: true
      },
    }
  );
  properties.push(cardInfo);

  return properties;
}

module.exports = createPaymentMethodObjectConfig = (
  serviceConfig,
  projectConfig
) => {
  return {
    objectSettings: {
      basicSettings: {
        name: "sys_paymentMethod",
        description: `A payment storage object to store the payment methods of the platform customers`,
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
    properties: getProperties(serviceConfig, projectConfig)
  };
};
