"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const S3BucketHelper_1 = __importDefault(require("../helper/S3BucketHelper"));
const utilHelper_1 = __importDefault(require("../helper/utilHelper"));
const UtilEnum_1 = require("../util/types/Enum/UtilEnum");
class ImageService {
    createPresignedUrl(fileName, bucket, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const utilHelper = new utilHelper_1.default();
            const s3Helper = new S3BucketHelper_1.default(bucket, folderName);
            const key = `${utilHelper.createRandomText(5)}_${fileName}`;
            const presigned_url = yield s3Helper.generatePresignedUrl(key);
            if (presigned_url) {
                return {
                    msg: "Presigned url created",
                    status: true,
                    statusCode: UtilEnum_1.StatusCode.CREATED,
                    data: {
                        url: presigned_url
                    }
                };
            }
            else {
                return {
                    msg: "Url create failed",
                    status: false,
                    statusCode: UtilEnum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
}
exports.default = ImageService;
