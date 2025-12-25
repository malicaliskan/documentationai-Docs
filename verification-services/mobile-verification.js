const VerificationServiceBase = require("./verification-service-base");

const {
  BadRequestError,
  ErrorCodes,
  NotAuthenticatedError,
  ForbiddenError,
} = require("common");

class MobileVerification extends VerificationServiceBase {
  constructor(req) {
    super(req, "byCode");
    this.startTopic = "stagefishworld-user-service-mobile-verification-start";
    this.completeTopic =
      "stagefishworld-user-service-mobile-verification-complete";
  }

  async getMobileVerificationEntityCache(userId) {
    return this.getVStepFromEntityCache("mobileVerification", userId);
  }

  async setMobileVerificationEntityCache(mobileVerification) {
    return this.setVStepToEntityCache(
      "mobileVerification",
      mobileVerification.userId,
      mobileVerification,
    );
  }

  async deleteMobileVerificationEntityCache(userId) {
    return this.deleteVStepFromEntityCache("mobileVerification", userId);
  }

  async startVerification() {
    console.log("startVerification Mobile", this.req.body);
    const email = this.req.body.email;

    const user = await this.findUserByEmail(email);

    if (!user.mobile) {
      throw new BadRequestError(
        "errMsg_UserMobileDoesntExits",
        ErrorCodes.MobileAlreadyVerified,
      );
    }

    if (user.mobileVerified) {
      throw new BadRequestError(
        "errMsg_UserMobileAlreadyVerified",
        ErrorCodes.MobileAlreadyVerified,
      );
    }

    const mobileVerificationDate = new Date();
    const mobileVerificationTimeStamp = mobileVerificationDate.getTime();

    const mobileVerification = (await this.getMobileVerificationEntityCache(
      user.id,
    )) ?? {
      userId: user.id,
      mobile: user.mobile,
    };

    const delta =
      mobileVerificationTimeStamp - mobileVerification.timeStamp ??
      mobileVerificationTimeStamp;

    if (delta < 60 * 1000) {
      throw new ForbiddenError(
        "errMsg_UserMobileCodeCanBeSentOnceInTheTimeWindow",
        ErrorCodes.CodeSpamError,
      );
    }

    let codeIndex = mobileVerification.codeIndex ?? 0;
    ++codeIndex;
    if (codeIndex > 10) codeIndex = 1;

    mobileVerification.secretCode = this.createSecretCode();
    mobileVerification.timeStamp = mobileVerificationTimeStamp;
    mobileVerification.date = mobileVerificationDate;
    mobileVerification.codeIndex = codeIndex;
    mobileVerification.expireTime = Number(300);
    mobileVerification.verificationType = this.verificationType;

    this.setMobileVerificationEntityCache(mobileVerification);
    mobileVerification.user = user;
    this.publishVerificationStartEvent(mobileVerification);

    const result = {
      status: "OK",
      email: email,
      mobile: user.mobile
        ? user.mobile.slice(0, 4) + "******" + user.mobile.slice(0, -3)
        : null,
      codeIndex: mobileVerification.codeIndex,
      timeStamp: mobileVerification.timeStamp,
      date: mobileVerification.date,
      expireTime: mobileVerification.expireTime,
      verificationType: mobileVerification.verificationType,
    };

    // in test mode
    result.secretCode = mobileVerification.secretCode;
    result.userId = mobileVerification.user.id;

    return result;
  }

  async completeVerification() {
    const email = this.req.body.email;
    const user = await this.findUserByEmail(email);

    if (user.mobileVerified) {
      throw new BadRequestError(
        "errMsg_UserMobileAlreadyVerified",
        ErrorCodes.MobileAlreadyVerified,
      );
    }

    const mobileVerification = await this.getMobileVerificationEntityCache(
      user.id,
    );

    if (!mobileVerification) {
      throw new NotAuthenticatedError(
        "errMsg_UserMobileCodeIsNotFoundInStore",
        ErrorCodes.StepNotFound,
      );
    }

    const mobileVerificationTimeStamp = new Date();
    const delta =
      mobileVerificationTimeStamp - mobileVerification.timeStamp ??
      mobileVerificationTimeStamp;

    if (delta > Number(300) * 1000) {
      throw new NotAuthenticatedError(
        "errMsg_UserMobileCodeHasExpired",
        ErrorCodes.CodeExpired,
      );
    }

    if (mobileVerification.secretCode == this.req.body.secretCode) {
      const newUser = await this.dbVerifyMobile(user.id);
      mobileVerification.user = newUser;
      mobileVerification.isVerified = true;
      this.publishVerificationCompleteEvent(mobileVerification);
      const result = {
        status: "OK",
        isVerified: true,
        email: email,
      };
      // in test mode
      result.userId = newUser.id;
      result.mobile = newUser.mobile;
      return result;
    } else {
      throw new ForbiddenError(
        "errMsg_UserMobileCodeIsNotAuthorized",
        ErrorCodes.CodeMismatch,
      );
    }
  }
}

const startMobileVerification = async (req, res, next) => {
  try {
    const mobileVerification = new MobileVerification(req);
    const response = await mobileVerification.startVerification();
    console.log("start mobile verification", response);
    res.send(response);
  } catch (err) {
    next(err);
  }
};

const completeMobileVerification = async (req, res, next) => {
  try {
    const mobileVerification = new MobileVerification(req);
    const response = await mobileVerification.completeVerification();
    res.send(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startMobileVerification,
  completeMobileVerification,
  MobileVerification,
};
