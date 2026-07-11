import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import UserDevice from "../models/UserDevice.js";
import createmailTemplate from "./mail.js";

const SAFE_USER_FIELDS = [
    "_id",
    "name",
    "email",
    "role",
    "login_type",
    "mobile_number",
    "country_code",
    "profile_image",
    "skills",
    "jobRole",
    "steps",
    "created_at",
    "updated_at",
    "is_active",
];

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "30m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

const toObject = (doc) => {
    if (!doc) return null;
    if (typeof doc.toObject === "function") return doc.toObject();
    return doc;
};

const buildDeviceData = (userId, request = {}) => ({
    userId,
    device_token: request.device_token || null,
    device_type: request.device_type || null,
    device_name: request.device_name || null,
    device_model: request.device_model || null,
    os_version: request.os_version || null,
    uuid: request.uuid || null,
    ip: request.ip || null,
    last_active_at: new Date(),
    is_active: true,
    is_delete: false,
});


const common = {
    sanitizeUser(userDoc) {
        const user = toObject(userDoc);
        if (!user) return null;

        const sanitized = {};
        for (const field of SAFE_USER_FIELDS) {
            if (Object.prototype.hasOwnProperty.call(user, field)) {
                sanitized[field] = user[field];
            }
        }

        return sanitized;
    },

    async checkUniqueEmail(email) {
        try {
            if (!email) return null;
            const result = await User.findOne({
                email: email,
                is_active : true,
                is_delete: false,
            }).lean();
            return result || null;
        } catch (error) {
            console.error("Error checking unique email: ", error);
            throw error;
        }
    },

    async checkUniquemobile(mobile_number, country_code) {
        try {
            if (!mobile_number || !country_code) return null;
            const result = await User.findOne({
                country_code: country_code,
                mobile_number: mobile_number,
                is_active : true,
                is_delete: false,
            }).lean();
            return result || null;
        } catch (error) {
            console.error("Error checking unique mobile: ", error);
            throw error;
        }
    },

    async checkUniquesocial(social_id, login_type) {
        try {
            const result = await User.findOne({
                social_id: social_id,
                login_type: login_type,
                is_delete: false,
                is_active: true,
            }).lean();
            return result || null;
        } catch (error) {
            console.error("Error checking unique social: ", error);
            throw error;
        }
    },

    async getUserDetails(request) {
        try {
            if (request?.id) {
                const result = await User.findOne({
                    _id: request.id,
                    is_delete: false,
                    is_active: true,
                }).lean();
                return common.sanitizeUser(result);
            } else {
                const result = await User.find({
                    is_active: true,
                    is_delete: false,
                }).sort({ created_at: -1 }).lean();
                return (result || []).map((user) => common.sanitizeUser(user));
            }
        } catch (error) {
            console.error("Error fetching user details: ", error);
            return null;
        }
    },

    generateAccessToken(user) {
        const normalizedUser = Array.isArray(user) ? user[0] : user;
        if (!normalizedUser || !normalizedUser._id) {
            throw new Error("Invalid user data for access token generation");
        }

        const payload = {
            id: normalizedUser._id,
            name: normalizedUser.name || null,
            email: normalizedUser.email || null,
            role: normalizedUser.role || null,
            login_type: normalizedUser.login_type || null,
        };

        return jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    },

    generateRefreshToken(user) {
        const normalizedUser = Array.isArray(user) ? user[0] : user;
        if (!normalizedUser || !normalizedUser._id) {
            throw new Error("Invalid user data for refresh token generation");
        }

        const refreshSecret = process.env.JWT_REFRESH_TOKEN || process.env.JWT_WEB_TOKEN;
        return jwt.sign({ id: normalizedUser._id }, refreshSecret, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    },

    async createUserSession(user, request = {}) {
        try {
            const normalizedUser = Array.isArray(user) ? user[0] : user;

            if (!normalizedUser || !normalizedUser._id) {
                throw new Error("Invalid user data for session generation");
            }

            const accessToken = common.generateAccessToken(normalizedUser);
            const refreshToken = common.generateRefreshToken(normalizedUser);

            const refreshPayload = jwt.decode(refreshToken);

            const userDeviceData = {
                ...buildDeviceData(normalizedUser._id, request),
                token: accessToken,
                refresh_token: refreshToken,
                refresh_token_expires_at: refreshPayload?.exp ? new Date(refreshPayload.exp * 1000) : null,
            };

            await UserDevice.create(userDeviceData);

            return { accessToken, refreshToken };

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async refreshUserSession(refreshToken, request = {}) {
        const refreshSecret = process.env.JWT_REFRESH_TOKEN || process.env.JWT_WEB_TOKEN;
        let decoded;

        try {
            decoded = jwt.verify(refreshToken, refreshSecret);
        } catch (error) {
            throw new Error("Invalid refresh token");
        }

        const session = await UserDevice.findOne({
            userId: decoded.id,
            refresh_token: refreshToken,
            is_active: true,
            is_delete: false,
        });

        if (!session) {
            throw new Error("Refresh session not found");
        }

        const user = await User.findOne({ _id: decoded.id, is_active: true, is_delete: false }).lean();
        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = common.generateAccessToken(user);
        const newRefreshToken = common.generateRefreshToken(user);
        const refreshPayload = jwt.decode(newRefreshToken);

        await UserDevice.updateOne(
            { _id: session._id },
            {
                $set: {
                    ...buildDeviceData(decoded.id, request),
                    token: accessToken,
                    refresh_token: newRefreshToken,
                    refresh_token_expires_at: refreshPayload?.exp ? new Date(refreshPayload.exp * 1000) : null,
                },
            }
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: common.sanitizeUser(user),
        };
    },

    async revokeSessionByAccessToken(accessToken) {
        if (!accessToken) return;
        await UserDevice.updateMany(
            { token: accessToken, is_delete: false },
            {
                $set: {
                    is_active: false,
                    token: null,
                    refresh_token: null,
                    refresh_token_expires_at: null,
                },
            }
        );
    },

    async revokeSessionByRefreshToken(refreshToken) {
        if (!refreshToken) return;
        await UserDevice.updateMany(
            { refresh_token: refreshToken, is_delete: false },
            {
                $set: {
                    is_active: false,
                    token: null,
                    refresh_token: null,
                    refresh_token_expires_at: null,
                },
            }
        );
    },

    generateToken: async function (user, request = {}) {
        const session = await common.createUserSession(user, request);
        return session.accessToken;
    },

     async configEmail(data , mailSubject) {
        if (!data?.email) return;
        
        const html = createmailTemplate({
           applicationId : data.applicationId,
           fullName : data.fullName,
           jobTitle : data.jobTitle,
           status : data.status,
           createdAt : data.createdAt,
        });
        
        const subject = mailSubject
        
        const mailResult = await common.sendMail({
            toEmail: data.email,
            subject,
            htmlMessage: html,
        });
        
        if (mailResult?.skipped) {
            console.warn("Email skipped:", mailResult.reason);
        }
    },

    async sendMail({ toEmail, subject, htmlMessage }) {
 
        if (!toEmail || !subject || !htmlMessage) {
        return { skipped: true, reason: "Missing toEmail/subject/htmlMessage" };
        }
    
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
        const mailFrom = process.env.MAIL_FROM || smtpUser;
    
        if (!mailFrom || !smtpUser || !smtpPass) {
        return { skipped: true, reason: "Mail env is not configured" };
        }
    
        const smtpHost =
        process.env.SMTP_HOST && process.env.SMTP_HOST !== "smtp.example.com"
            ? process.env.SMTP_HOST
            : "smtp.gmail.com";
    
        const isGmail = smtpHost === "smtp.gmail.com";
        const transportConfig = {
            host: smtpHost,
            port: Number(process.env.SMTP_PORT || (isGmail ? 465 : 587)),
            secure: isGmail ? true : (Number(process.env.SMTP_PORT) === 465),
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        };
        
        if (isGmail) {
            transportConfig.service = "gmail";
        }

        const transporter = nodemailer.createTransport(transportConfig);
    
        const info = await transporter.sendMail({
        from: mailFrom,
        to: toEmail,
        subject,
        html: htmlMessage,
        });
    
        return { skipped: false, messageId: info.messageId };
    },
}

export default common;