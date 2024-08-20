import { StatusCode } from "../Enum/UtilEnum"


interface HelperFunctionResponse {
    status: boolean,
    msg: string,
    statusCode: StatusCode,
    data?: any
}

export { HelperFunctionResponse }