import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import UserDevice from "../models/UserDevice.js";


const common = {
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
                return result || null;
            } else {
                const result = await User.find({
                    is_active: true,
                    is_delete: false,
                }).sort({ created_at: -1 }).lean();
                return result || [];
            }
        } catch (error) {
            console.error("Error fetching user details: ", error);
            return null;
        }
    },

    generateToken: async function (user, request = {}) {
        try {
            const normalizedUser = Array.isArray(user) ? user[0] : user;

            if (!normalizedUser || !normalizedUser._id) {
                throw new Error("Invalid user data for token generation");
            }

            const payload = {
                id: normalizedUser._id,
                name: normalizedUser.name || null,
                email: normalizedUser.email || null,
                role : normalizedUser.role || null,
                login_type: normalizedUser.login_type || null,
            };

            const token = jwt.sign(payload, process.env.JWT_WEB_TOKEN, { expiresIn: "365d" });

            const userDeviceData = {
                userId: normalizedUser._id,
                token: token,
                device_token: request.device_token || null,
                device_type: request.device_type || null,
                device_name: request.device_name || null,
                device_model: request.device_model || null,
                os_version: request.os_version || null,
                uuid: request.uuid || null,
                ip: request.ip || null,
            };

            const existingDevice = await UserDevice.findOne({
                userId: normalizedUser._id,
                token: token,
            });
            
            if (existingDevice) {
                await UserDevice.updateOne(
                    { _id: existingDevice._id },
                    { $set: { ...userDeviceData, is_active: true } }
                );
                return token;
            }

            const userDevice = new UserDevice(userDeviceData);
            await userDevice.save();

            return token;

        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    async sendOtpMail({ toEmail, subject, htmlMessage }) {
 
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
    
        const transporter = nodemailer.createTransport({
        service: "gmail",
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        });
    
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