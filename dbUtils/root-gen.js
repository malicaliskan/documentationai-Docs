const path = require("path");

const { JsSourceFile, Generator } = require("patternutils");

const firstUpper = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

class DbObjectRootUtils extends Generator {
  constructor(serviceModel, parentFolder, dbObject) {
    const folderName = path.join(parentFolder, "utils");
    super(serviceModel, folderName);
    this.dbObject = dbObject;
  }
  generateSource() {
    const dbName = this.dbObject.dbType == "postgresql" ? "sequelize" : "mongo";

    const getByIdFile = new JsSourceFile(
      "get" + this.dbObject.modelName + "ById" + ".js",
      path.resolve(__dirname, `dbfunction-getid-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );
    this.files.push(getByIdFile);

    const getByQueryFile = new JsSourceFile(
      "get" + this.dbObject.modelName + "ByQuery" + ".js",
      path.resolve(__dirname, `dbfunction-getbyqr-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );
    this.files.push(getByQueryFile);

    const createFile = new JsSourceFile(
      "create" + this.dbObject.modelName + ".js",
      path.resolve(__dirname, `dbfunction-create-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );
    this.files.push(createFile);

    const createBulkFile = new JsSourceFile(
      "createBulk" + this.dbObject.modelName + ".js",
      path.resolve(__dirname, `dbfunction-bulkcreate-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );
    this.files.push(createBulkFile);

    const getIdListByFieldFile = new JsSourceFile(
      "getIdListOf" + this.dbObject.modelName + "ByField" + ".js",
      path.resolve(__dirname, `dbfunction-getIdList-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(getIdListByFieldFile);

    const listByQueryFile = new JsSourceFile(
      "get" + this.dbObject.modelName + "ListByQuery" + ".js",
      path.resolve(__dirname, `dbfunction-listqr-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(listByQueryFile);

    const getCountByQueryFile = new JsSourceFile(
      "get" + this.dbObject.modelName + "StatsByQuery" + ".js",
      path.resolve(__dirname, `dbfunction-getstatsql-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(getCountByQueryFile);

    const updateByIdListFile = new JsSourceFile(
      "update" + this.dbObject.modelName + "ByIdList" + ".js",
      path.resolve(__dirname, `dbfunction-updateIdList-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(updateByIdListFile);

    const updateByIdFile = new JsSourceFile(
      "update" + this.dbObject.modelName + "ById" + ".js",
      path.resolve(__dirname, `dbfunction-updateId-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(updateByIdFile);

    const deleteByIdFile = new JsSourceFile(
      "delete" + this.dbObject.modelName + "ById" + ".js",
      path.resolve(__dirname, `dbfunction-deleteId-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(deleteByIdFile);

    const deleteByQueryFile = new JsSourceFile(
      "delete" + this.dbObject.modelName + "ByQuery" + ".js",
      path.resolve(__dirname, `dbfunction-deleteqr-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(deleteByQueryFile);

    const updateByQueryFile = new JsSourceFile(
      "update" + this.dbObject.modelName + "ByQuery" + ".js",
      path.resolve(__dirname, `dbfunction-updateqr-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(updateByQueryFile);

    const hasCodename =
      this.dbObject.properties.some((prop) => prop.name == "codename") &&
      (this.dbObject.properties.some((prop) => prop.name == "name") ||
        this.dbObject.properties.some((prop) => prop.name == "shortname"));

    if (hasCodename) {
      const getNextCodenameFile = new JsSourceFile(
        "getNextCodenameFor" + this.dbObject.modelName + ".js",
        path.resolve(__dirname, `dbfunction-getNextCodename-${dbName}.ejs`),
        {
          dbObject: this.dbObject,
          dataModel: this.serviceModel.dataModel,
          organization: this.serviceModel.organization,
          project: this.serviceModel.project,
        }
      );
      this.files.push(getNextCodenameFile);
    }

    const nonPrimaryKeys = this.dbObject.getNonPrimaryKeys();

    for (const npKeyProp of nonPrimaryKeys) {
      const getByNonPkFile = new JsSourceFile(
        "get" +
          this.dbObject.modelName +
          "By" +
          firstUpper(npKeyProp.name) +
          ".js",
        path.resolve(__dirname, `dbfunction-getnpkey-${dbName}.ejs`),
        {
          dbObject: this.dbObject,
          dataModel: this.serviceModel.dataModel,
          organization: this.serviceModel.organization,
          project: this.serviceModel.project,
          npKeyProp: npKeyProp,
        }
      );
      this.files.push(getByNonPkFile);
    }

    const getAggByIdFile = new JsSourceFile(
      "get" + this.dbObject.modelName + "AggById" + ".js",
      path.resolve(__dirname, `dbfunction-getidAgg-${dbName}.ejs`),
      {
        dbObject: this.dbObject,
        dataModel: this.serviceModel.dataModel,
        organization: this.serviceModel.organization,
        project: this.serviceModel.project,
      }
    );

    this.files.push(getAggByIdFile);

    const stripeOrder = this.dbObject.stripeOrder;
    if (stripeOrder) {
      const updateOrderStatusByIdFile = new JsSourceFile(
        `update${this.dbObject.modelName}OrderStatusById.js`,
        path.resolve(__dirname, `dbfunction-updateOrderStatus-${dbName}.ejs`),
        {
          dbObject: this.dbObject,
          dataModel: this.serviceModel.dataModel,
          organization: this.serviceModel.organization,
          project: this.serviceModel.project,
        }
      );

      this.files.push(updateOrderStatusByIdFile);
    }

    const geoProps = this.dbObject.properties.filter(
      (p) => p.ordType == "GeoPoint"
    );

    if (geoProps.length) {
      const geoUtilsFile = new JsSourceFile(
        `geoUtils${this.dbObject.modelName}.js`,
        path.resolve(__dirname, `geo-utils-${dbName}.ejs`),
        {
          dbObject: this.dbObject,
        }
      );

      this.files.push(geoUtilsFile);
    }

    const indexFile = new JsSourceFile(
      "index.js",
      path.resolve(__dirname, "index_dbObject_utils.ejs"),
      { dbObject: this.dbObject }
    );
    this.files.push(indexFile);
  }
}

class DataModelRoot extends Generator {
  constructor(serviceModel, parentFolder, dataModel) {
    const folderName = path.join(parentFolder, dataModel.name);
    super(serviceModel, folderName);
    this.dataModel = dataModel;

    const dbObjects = this.dataModel.objects;
    for (const dbObject of dbObjects) {
      const dbObjectFolder = new DbObjectRoot(
        serviceModel,
        folderName,
        dbObject
      );
      this.folders.push(dbObjectFolder);
    }
  }

  generateSource() {
    const indexFile = new JsSourceFile(
      "index.js",
      path.resolve(__dirname, "index_dataModel.ejs"),
      { dbModel: this.dataModel }
    );
    this.files.push(indexFile);
  }
}

class RootGenerator extends Generator {
  constructor(serviceModel, parentFolder) {
    const folderName = path.join(parentFolder, "layer-of-db");
    super(serviceModel, folderName);

    const dataModelFolder = new DataModelRoot(
      serviceModel,
      folderName,
      this.serviceModel.dataModel
    );
    this.folders.push(dataModelFolder);
  }

  generateSource() {
    this.files.clear;
    const indexFile = new JsSourceFile(
      "index.js",
      path.resolve(__dirname, "index.ejs"),
      this.serviceModel
    );
    this.files.push(indexFile);
  }
}

module.exports = DbObjectRootUtils;
