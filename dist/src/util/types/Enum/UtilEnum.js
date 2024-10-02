"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatVia = exports.IdPrefix = exports.TicketChatFrom = exports.TicketStatus = exports.TicketPriority = exports.TicketCategory = exports.AuthUpdateType = exports.StatusCode = exports.S3Folder = void 0;
var CreateChatVia;
(function (CreateChatVia) {
    CreateChatVia["DonorId"] = "donor-id";
    CreateChatVia["ProfileId"] = "profile_id";
})(CreateChatVia || (exports.CreateChatVia = CreateChatVia = {}));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
var S3Folder;
(function (S3Folder) {
    S3Folder["TicktAttachment"] = "ticket-attachment";
})(S3Folder || (exports.S3Folder = S3Folder = {}));
var AuthUpdateType;
(function (AuthUpdateType) {
    AuthUpdateType["Email"] = "EMAIL";
    AuthUpdateType["Phone"] = "PHONE";
})(AuthUpdateType || (exports.AuthUpdateType = AuthUpdateType = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["Critical"] = "Critical";
    TicketPriority["High"] = "High";
    TicketPriority["Medium"] = "Medium";
    TicketPriority["Low"] = "Low";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["BloodAccount"] = "Blood Account";
    TicketCategory["FundRaiserAccount"] = "Fund Raiser Account";
    TicketCategory["PaymentRelated"] = "Payment Related";
    TicketCategory["Technical"] = "Technichal related";
    TicketCategory["Other"] = "Other";
})(TicketCategory || (exports.TicketCategory = TicketCategory = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["Raised"] = "Raised";
    TicketStatus["Closed"] = "Closed";
    TicketStatus["ReOpened"] = "Reopen";
    TicketStatus["Answered"] = "Answered";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var IdPrefix;
(function (IdPrefix) {
    IdPrefix["TicketChatId"] = "TCI";
    IdPrefix["TicketId"] = "TI";
})(IdPrefix || (exports.IdPrefix = IdPrefix = {}));
var TicketChatFrom;
(function (TicketChatFrom) {
    TicketChatFrom["Admin"] = "Admin";
    TicketChatFrom["User"] = "User";
})(TicketChatFrom || (exports.TicketChatFrom = TicketChatFrom = {}));
