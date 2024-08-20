"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// const { default: mongoose } = require("mongoose");
const mongoose_1 = __importStar(require("mongoose"));
const userProfileScheme = {
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        required: false
    },
    location: {
        type: {
            latitude: {
                type: mongoose_1.default.Types.Decimal128,
                required: true
            },
            longitude: {
                type: mongoose_1.default.Types.Decimal128,
                required: true
            }
        },
        required: false
    },
    contact_update: {
        email: {
            new_email_id: {
                type: String,
            },
            otp: {
                type: Number,
            },
            otp_expire_time: {
                type: Number,
            }
        },
        phone_number: {
            new_phone_number: {
                type: String,
                required: false
            },
            otp: {
                type: Number,
            },
            otp_expire_time: {
                type: Number,
            }
        }
    },
    phone_number: {
        type: String,
        required: true
    },
    profile_id: {
        type: String,
        required: true,
        unique: true
    },
    blood_donor_id: {
        type: String,
    }
};
const schemeModel = new mongoose_1.Schema(userProfileScheme);
const UserProfileModel = mongoose_1.default.model("user_profile", schemeModel, "user_profile");
exports.default = UserProfileModel;
