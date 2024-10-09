

enum TicketExpireDays {
    WarningNotice = 5,
    CloseTicket = 7
}

enum CreateChatVia {
    DonorId = "donor-id",
    ProfileId = "profile_id"
}

enum StatusCode {
    OK = 200,
    CREATED = 201,
    UNAUTHORIZED = 401,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    FORBIDDEN = 403,
    CONFLICT = 409,
}


enum S3Folder {
    TicktAttachment = "ticket-attachment"
}

enum AuthUpdateType {
    Email = "EMAIL",
    Phone = "PHONE"
}


enum TicketPriority {
    High = 'High',
    Critical = 'Critical',
    Medium = 'Medium',
    Low = 'Low'
}

enum TicketCategory {
    BloodAccount = "Blood Account",
    FundRaiserAccount = "Fund Raiser Account",
    PaymentRelated = "Payment Related",
    Technical = "Technichal related",
    Other = "Other"
}

enum TicketStatus {
    Raised = "Raised",
    Closed = "Closed",
    ReOpened = "Reopen",
    Answered = "Answered",
}

enum IdPrefix {
    TicketChatId = "TCI",
    TicketId = "TI"
}

enum TicketChatFrom {
    Admin = "Admin",
    User = "User"
}
export { S3Folder, StatusCode, AuthUpdateType, TicketCategory, TicketPriority, TicketStatus, TicketChatFrom, IdPrefix, CreateChatVia, TicketExpireDays }