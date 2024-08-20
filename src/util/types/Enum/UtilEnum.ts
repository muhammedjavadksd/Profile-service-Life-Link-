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


enum AuthUpdateType {
    Email = "EMAIL",
    Phone = "PHONE"
}


enum TicketPriority {
    Critical = 'Critical',
    High = 'High',
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

enum TicketChatFrom {
    Admin = "Admin",
    User = "User"
}
export { StatusCode, AuthUpdateType, TicketCategory, TicketPriority, TicketStatus, TicketChatFrom }