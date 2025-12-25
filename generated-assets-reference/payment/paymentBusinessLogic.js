const { get } = require("request");
const getBusinessApiConfig = require("./getBusinessApiConfig");

const firstUpper = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getPaymentStoreObjectApi = (dbObjectName) => {
    const DbObjectName = firstUpper(dbObjectName);

    const getPaymentApi = getBusinessApiConfig("get", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `get${DbObjectName}Payment`,
            apiDescription:
                "This route is used to get the payment information by ID.",
            crudType: "get",
        }
    });

    const getPaymentByOrderIdApi = getBusinessApiConfig("get", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `get${DbObjectName}PaymentByOrderId`,
            apiDescription:
                "This route is used to get the payment information by order id.",
            crudType: "get",
        },

        restSettings: {
            configuration: {
                routePath: `/${dbObjectName}paymentbyorderid/:orderId`
            }
        },

        whereClause: {
            selectBy: ["orderId"]
        }
    });

    const getByPaymentIdApi = getBusinessApiConfig("get", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `get${DbObjectName}PaymentByPaymentId`,
            apiDescription:
                "This route is used to get the payment information by payment id.",
            crudType: "get",
        },

        restSettings: {
            configuration: {
                routePath: `/${dbObjectName}paymentbypaymentid/:paymentId`
            }
        },

        whereClause: {
            selectBy: ["paymentId"]
        }
    });

    const createPaymentApi = getBusinessApiConfig("create", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `create${DbObjectName}Payment`,
            apiDescription:
                "This route is used to create a new payment.",
            crudType: "create",
        }
    });

    const updatePaymentApi = getBusinessApiConfig("update", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `update${DbObjectName}Payment`,
            apiDescription:
                "This route is used to update an existing payment.",
            crudType: "update",
        }
    });

    const listPaymentApi = getBusinessApiConfig("list", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `list${DbObjectName}Payments`,
            apiDescription:
                "This route is used to list all payments.",
            crudType: "list",
        }
    });

    const deletePaymentApi = getBusinessApiConfig("delete", {
        apiOptions: {
            dataObjectName: `sys_${dbObjectName}Payment`,
            name: `delete${DbObjectName}Payment`,
            apiDescription:
                "This route is used to delete a payment.",
            crudType: "delete",
        }
    });

    return [getPaymentApi, listPaymentApi, createPaymentApi, updatePaymentApi, deletePaymentApi, listPaymentApi, getPaymentByOrderIdApi, getByPaymentIdApi, getPaymentApi];

};

const getPaymentCustomerObjectApi = () => {
    const getApi = getBusinessApiConfig("get", {
        apiOptions: {
            dataObjectName: "sys_paymentCustomer",
            name: "getPaymentCustomerByUserId",
            apiDescription:
                "This route is used to get the payment customer information by user id.",
            crudType: "get",
        },

        restSettings: {
            configuration: {
                routePath: `/paymentcustomers/:userId`
            }
        },

        whereClause: {
            selectBy: ["userId"]
        }
    });

    const listApi = getBusinessApiConfig("list", {
        apiOptions: {
            dataObjectName: "sys_paymentCustomer",
            name: "listPaymentCustomers",
            apiDescription:
                "This route is used to list all payment customers.",
            crudType: "list",
        }
    });

    return [getApi, listApi];

};

const getPaymentMethodObjectApi = () => {
    const listPaymentMethodApi = getBusinessApiConfig("list", {
        apiOptions: {
            dataObjectName: "sys_paymentMethod",
            name: "listPaymentCustomerMethods",
            apiDescription:
                "This route is used to list all payment customer methods.",
            crudType: "list",
        },
        whereClause: {
            selectBy: ["userId"]
        }
    });

    return [listPaymentMethodApi];

};

module.exports = {
    getPaymentStoreObjectApi,
    getPaymentCustomerObjectApi,
    getPaymentMethodObjectApi
};