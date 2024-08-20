import { Request } from 'express';

interface CustomRequest extends Request {
    context: Record<string, any>
}

export { CustomRequest }