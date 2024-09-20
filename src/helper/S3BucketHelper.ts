import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from 'aws-sdk'
import axios from 'axios'
import UtilHelper from "./utilHelper";

interface IS3BucketHelper {
    generatePresignedUrl(key: string): Promise<string>
    uploadFile(file: Buffer, presigned_url: string): Promise<boolean>
}

class S3BucketHelper {

    private readonly bucketName;
    private readonly folderName;
    private readonly s3;

    constructor(bucketName: string, folderName: string) {
        this.bucketName = bucketName;
        this.folderName = folderName

        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            signatureVersion: 'v4',
        });
        console.log("Key");

        console.log(process.env.AWS_SECRET_ACCESS_KEY);

    }

    async generatePresignedUrl(key: string): Promise<string> {
        const signedUrlExpireSeconds = 60 * 5
        const filePath = this.folderName ? `${this.folderName}/${key}` : key
        console.log("Bucket name");
        console.log(this.bucketName);

        const url = this.s3.getSignedUrl("putObject",
            {
                Bucket: this.bucketName,
                Key: filePath,
                Expires: signedUrlExpireSeconds
            })
        return url;
    }


    async uploadObject(key: string, docs: Buffer, ftype: string) {

        const save = await this.s3.upload({
            Bucket: this.bucketName,
            Key: key,
            Body: docs,
            ACL: 'public-read',
            ContentType: ftype
        }

        ).promise()
        console.log(save);

        console.log("Save");
        console.log(save.Location);
    }

    getViewUrl(keyName: string): false | string {
        try {
            const imageUrl = `http://${this.bucketName}.s3.amazonaws.com/${keyName}`
            return imageUrl
        } catch (e) {
            console.log(e);
            return false
        }
    }

    async findFile(fileName: string): Promise<boolean> {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName,
            };
            const headData = await this.s3.headObject(params).promise();
            if (headData) {
                return true
            }
            return false
        } catch (e) {
            return false
        }
    }




}

export default S3BucketHelper