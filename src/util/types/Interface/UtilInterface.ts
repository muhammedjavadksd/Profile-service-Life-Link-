import { StatusCode } from "../Enum/UtilEnum"


interface HelperFunctionResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}


interface IPaginatedResponse<T> {
    paginated: []
    total_records: number
}

export { HelperFunctionResponse, IPaginatedResponse }