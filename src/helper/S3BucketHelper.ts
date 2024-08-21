import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from 'aws-sdk'
import axios from 'axios'

interface IS3BucketHelper {
    generatePresignedUrl(key: string): Promise<string>
}

class S3BucketHelper implements IS3BucketHelper {

    private readonly bucketName;
    private readonly s3Config;

    constructor(bucketName: string) {
        this.bucketName = bucketName;
        this.s3Config = new S3Client({
            endpoint: "http://localhost:4566",
            credentials: fromEnv(),
            region: 'us-east-1',
            forcePathStyle: true,
        })
    }

    async generatePresignedUrl(key: string): Promise<string> {
        const url = await getSignedUrl(this.s3Config, new PutObjectCommand({ Bucket: this.bucketName, Key: key }), { expiresIn: 3600 })
        return url;
    }

    getImageNameFromUrl(presigned_url: string) {
        const url = new URL(presigned_url);
        const pathName = url.pathname
        const splitPath = pathName.split("/");
        return `${this.bucketName}/${splitPath[2]}`
    }
}

export default S3BucketHelper