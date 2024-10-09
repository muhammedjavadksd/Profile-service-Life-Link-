
import url from 'url'
import { Request } from 'express'

class UtilHelper {

    extractImageNameFromPresignedUrl(presigned_url: string): string | false {
        try {
            const newUrl = url.parse(presigned_url, true)
            console.log("Presigned url");
            console.log(presigned_url);

            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/")
                const path = `${pathName[1]}/${pathName[2]}`
                return path
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    extractKeyNameFromPresignedUrl(presigned_url: string): string | false {
        try {
            const newUrl = url.parse(presigned_url, true)

            if (newUrl.pathname) {
                const pathName = newUrl.pathname.split("/")
                const path = `${pathName[2]}`
                return path
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    createOtpNumber(length: number): number {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

    createRandomText(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    getTokenFromHeader(headers: Request['headers']['authorization']): string | false {
        const splitAuth = headers?.split(" ");
        if (splitAuth && splitAuth[0] == "Bearer") {
            const token: string | undefined = splitAuth[1];
            if (token) {
                return token
            }
        }
        return false
    }


}

export default UtilHelper;
