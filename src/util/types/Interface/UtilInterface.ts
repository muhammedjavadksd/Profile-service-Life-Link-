import { StatusCode } from "../Enum/UtilEnum"


interface HelperFunctionResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}


interface ITicketCloseNotification {
    email: string,
    name: string,
    ticket_id: string,
    title: string
}

interface ITicketWarningCloseNotification {
    email: string,
    name: string,
    ticket_id: string,
    title: string
    close_date: Date
}

interface IPaginatedResponse<T> {
    paginated: []
    total_records: number
}

export { HelperFunctionResponse, IPaginatedResponse, ITicketCloseNotification, ITicketWarningCloseNotification }