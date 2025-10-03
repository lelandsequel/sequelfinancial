"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.AccountStatus = exports.AccountType = exports.EquityType = exports.LiabilityType = exports.AssetType = void 0;
// Enums
var AssetType;
(function (AssetType) {
    AssetType["CURRENT"] = "CURRENT";
    AssetType["FIXED"] = "FIXED";
})(AssetType || (exports.AssetType = AssetType = {}));
var LiabilityType;
(function (LiabilityType) {
    LiabilityType["CURRENT"] = "CURRENT";
    LiabilityType["LONG_TERM"] = "LONG_TERM";
})(LiabilityType || (exports.LiabilityType = LiabilityType = {}));
var EquityType;
(function (EquityType) {
    EquityType["COMMON_STOCK"] = "COMMON_STOCK";
    EquityType["PREFERRED_STOCK"] = "PREFERRED_STOCK";
    EquityType["ADDITIONAL_PAID_IN_CAPITAL"] = "ADDITIONAL_PAID_IN_CAPITAL";
    EquityType["RETAINED_EARNINGS"] = "RETAINED_EARNINGS";
})(EquityType || (exports.EquityType = EquityType = {}));
var AccountType;
(function (AccountType) {
    AccountType["ASSET"] = "ASSET";
    AccountType["LIABILITY"] = "LIABILITY";
    AccountType["EQUITY"] = "EQUITY";
    AccountType["REVENUE"] = "REVENUE";
    AccountType["EXPENSE"] = "EXPENSE";
})(AccountType || (exports.AccountType = AccountType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["INACTIVE"] = "INACTIVE";
    AccountStatus["ARCHIVED"] = "ARCHIVED";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["SALES"] = "SALES";
    TransactionType["PURCHASES"] = "PURCHASES";
    TransactionType["PAYMENTS"] = "PAYMENTS";
    TransactionType["RECEIPTS"] = "RECEIPTS";
    TransactionType["ADJUSTMENTS"] = "ADJUSTMENTS";
    TransactionType["DEPRECIATION"] = "DEPRECIATION";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
//# sourceMappingURL=accounting.js.map