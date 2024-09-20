import S3BucketHelper from "../helper/S3BucketHelper";
import UtilHelper from "../helper/utilHelper";
import { S3Folder, StatusCode } from "../util/types/Enum/UtilEnum";
import { HelperFunctionResponse } from "../util/types/Interface/UtilInterface";


class ImageService {

    async createPresignedUrl(fileName: string, bucket: string, folderName: S3Folder): Promise<HelperFunctionResponse> {
        const utilHelper = new UtilHelper();
        const s3Helper = new S3BucketHelper(bucket, folderName);
        const key = `${utilHelper.createRandomText(5)}_${fileName}`
        const presigned_url = await s3Helper.generatePresignedUrl(key);
        if (presigned_url) {
            return {
                msg: "Presigned url created",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    url: presigned_url
                }
            }
        } else {
            return {
                msg: "Url create failed",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }
}

export default ImageService