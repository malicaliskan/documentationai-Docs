const firstUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const { getDataPropertyConfig } = require("./configs");

function getProperties(dbObjectName) {
  const properties = [];

  const ownerId = getDataPropertyConfig(
    "ownerId",
    "ID",
    " An ID value to represent owner user who created the order",
    {
      sessionSettings: {
        isSessionData: true,
        sessionParam: "userId",
        isOwnerField: true,
      },
      relationSettings: {
        hasRelation: false,
      },
    }
  );

  properties.push(ownerId);

  const orderId = getDataPropertyConfig(
    "orderId",
    "ID",
    `an ID value to represent the orderId which is the ID parameter of the source ${dbObjectName} object`,
    {
      basicSettings: { isRequired: true, allowUpdate: false },
      indexSettings: { indexedInDb: true, unique: true, isSecondaryKey: true },
    }
  );
  properties.push(orderId);

  const paymentId = getDataPropertyConfig(
    "paymentId",
    "String",
    `A String value to represent the paymentId which is generated on the Stripe gateway. This id may represent different objects due to the payment gateway and the chosen flow type`,
    {
      basicSettings: { isRequired: true, allowUpdate: true },
    }
  );

  properties.push(paymentId);

  const paymentStatus = getDataPropertyConfig(
    "paymentStatus",
    "String",
    `A string value to represent the payment status which belongs to the lifecyle of a Stripe payment.`,
    {
      basicSettings: { isRequired: true, allowUpdate: true },
    }
  );
  properties.push(paymentStatus);

  const statusLiteral = getDataPropertyConfig(
    "statusLiteral",
    "String",
    `A string value to represent the logical payment status which belongs to the application lifecycle itself.`,
    {
      basicSettings: {
        isRequired: true,
        allowUpdate: true,
        defaultValues: { default: "started" },
      },
    }
  );
  properties.push(statusLiteral);

  const redirectUrl = getDataPropertyConfig(
    "redirectUrl",
    "String",
    `A string value to represent return page of the frontend to show the result of the payment, this is used when the callback is made to server not the client.`,
    {
      basicSettings: { isRequired: false, allowUpdate: true },
    }
  );
  properties.push(redirectUrl);

  return properties;
}

module.exports = createPaymentDataObjectConfig = (dbObjectName) => {
  return {
    objectSettings: {
      basicSettings: {
        name: "sys_"+dbObjectName + "Payment",
        description: `A payment storage object to store the payment life cyle of orders based on ${dbObjectName} object. It is autocreated based on the source object's checkout config`,
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
    properties: getProperties(dbObjectName),
  };
};
