import localizify from "localizify";
import Codes from "../config/status_codes.js";
const { default: local , t } = localizify;
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import common from "../config/common.js";
import User from "../models/User.js";
import UserDevice from "../models/UserDevice.js";
import es from "../languages/es.js";
import fr from "../languages/fr.js";
import en from "../languages/en.js";
import hn from "../languages/hn.js";
import { resumeupload } from "../config/multer.js";

dotenv.config();

local
  .add("en", en)
  .add("es", es)
  .add("fr", fr)
  .add("hn", hn);

let is_lang = "en";

const key = process.env.KEY || "";
const iv = process.env.IV || "";

const bypassRoutes = [
    "/api/v1/auth/login",
    "/api/v1/auth/signup",
    "/api/v1/auth/validate-user",
]

const resolveMessage = (responseMessage) => {
    if (!responseMessage) {
        return { keyword: '', components: {} };
    }
 
    if (typeof responseMessage === 'string') {
        const entry = Object.entries(en).find(([, value]) => value === responseMessage);
        return { keyword: entry ? entry[0] : responseMessage, components: {} };
    }
 
    if (typeof responseMessage === 'object') {
        return {
            keyword: responseMessage.keyword || responseMessage.message || '',
            components: responseMessage.components || {},
        };
    }
 
    return { keyword: '', components: {} };
};

const getMessage = (requestLanguage, keywords, components, callback) => {
    local.setLocale(requestLanguage || 'en');
    const returnmessage = t(keywords, components);
    callback(returnmessage);
};
 
const extractHeaderLanguage = (req, res, next) => {
    const headerLang = (req.headers['accept-language'] || 'en').split(',')[0].split('-')[0].toLowerCase();
    // console.log("Extracted header language: ", headerLang);
    req.lang = headerLang === 'es' || headerLang === 'fr' || headerLang === 'hn' ? headerLang : 'en';
    res.locals.language = req.lang;
    is_lang = req.lang;
    local.setLocale(req.lang);
    req.getTranslation = (key, components = {}) => t(key, components);
    next();
};
 
const getHeaderLanguage = () => {
    return is_lang;
};

const sendApiResponse = async (res, httpStatus = Codes.SUCCESS , resCode, msgKey, resData ) => {
    const language = (res.locals && res.locals.language) || "en";
    local.setLocale(language);
    const { keyword, components } = resolveMessage(msgKey);

    const responsejson = {
        code: resCode,
        message: t(keyword, components),
    };

    if (resData != null) {
        responsejson.data = resData;    
    }

    const encryptedResponse = await encryption(responsejson);
    res.status(httpStatus);
    res.json(encryptedResponse);
};

const validateJoi = (schema, allowEmpty = false) => {
    return (req, res, next) => {
        if (!allowEmpty && (!req.body || Object.keys(req.body).length === 0)) {
            return sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "rest_keywords_required_fields_missing",
                null,
            );
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = {};
            error.details.forEach((err) => {
                const field = err.path && err.path.length ? err.path[0] : "field";
                errors[field] = err.message.replace(/"/g, "");
            });

            return sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.MISSING_FIELD,
                "rest_keywords_required_fields_missing",
                errors,
            );
        }

        req.body = value;
        return next();
    };
};

async function tokenMiddleware (req, res, next) {
    // check if route should bypass
        const requestPath = (req.originalUrl || req.url || req.path || "").split("?")[0];
        if (bypassRoutes.some((route) => requestPath.startsWith(route))) {
            return next(); // skip token check
        }

      const token = req.headers['token'] || req.headers['authorization'];
      console.log("Token from headers: ", token);
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const bearerToken = token.replace("Bearer ", "").trim();
        
        let decoded;
        
        try {
            decoded = jwt.verify(bearerToken, process.env.JWT_WEB_TOKEN);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return sendApiResponse(
                    res,
                    Codes.UNAUTHORIZED,
                    Codes.INVALID_TOKEN,
                    "Token_expired_Please_login_again",
                    null,
                );
            }
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_TOKEN,
                "Invalid_token",
                null,
            );
        }
        console.log("Decoded token: ", decoded);
        console.log("Bearer token: ", bearerToken);

        // Verify user exists and is active in MongoDB
        const userToken = await UserDevice.findOne({
            userId: decoded.id, 
            token: bearerToken,
            is_active: true,
            is_delete: false,
        }).lean();
        console.log("userToken: ", userToken);

        if (!userToken) {
            return sendApiResponse(res, Codes.SUCCESS , Codes.UNAUTHORIZED, "rest_keywords_unauthorized", null);
        }
        
        if(userToken.is_active === false) {
            return sendApiResponse(
                res,
                Codes.SUCCESS,
                Codes.UNAUTHORIZED,
                "rest_keywords_your_session_has_been_expired",
                null
            );
        }

        req.loginUser = decoded;
        next();
}

const allowedRoles = (...roles) => {
    // console.log("roles: ", roles);   
    return (req, res, next) => {
    //    console.log(req.loginUser.role)
        if(!roles.includes(req.loginUser.role)){
            return sendApiResponse(res , 401, -1 , { keyword: "Access_Denied" , component : {} })
        }
        next();
    };
};

const checkApi = (req, res, next) => {
    try {
        const apiKey = req.headers['api-key'];
        if (!apiKey || apiKey !== process.env.API_KEY) {
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_APIKEY,
                "rest_keywords_unauthorized",
                null
            );
        }
        next();
    } catch (error) {
        console.log("Error in API key verification: ", error);
        return sendApiResponse(
            res,
            Codes.UNAUTHORIZED,
            Codes.INVALID_APIKEY,
            "rest_keywords_unauthorized",
            null
        );
    }
}

const resumeUploadMiddleware = (req, res, next) => {
    resumeupload.fields([
        { name: "resume", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ])(req, res, (err) => {
        if (!err) {
            
            return next();
        }
        return sendApiResponse(
            res,
            400,
            0,
            err.message,
            null,
        );
    });
};

const encryption = async (req) => {
    // Implement your encryption logic here
    try {
        const key = CryptoJS.enc.Utf8.parse(process.env.KEY || "");
        const iv = CryptoJS.enc.Utf8.parse(process.env.IV || "");

        if (!process.env.KEY || !process.env.IV) {
            throw new Error("Missing KEY or IV in environment variables");
        }

        if(typeof req === 'object') {
            req = JSON.stringify(req);
        }
        const encryptedData = CryptoJS.AES.encrypt(req, key, {
            iv: iv,
          }).toString();
        return encryptedData;
    } catch (error) {
        console.log("Error in encryption: ", error);
        throw new Error("Encryption failed");
    }
}

const decryption = (req, res, next) => {
    if (req.body && Object.keys(req.body).length !== 0) {
        let encryptedBody = "";

        if (typeof req.body === "string") {
            encryptedBody = req.body;
        } else if (typeof req.body.data === "string") {
            encryptedBody = req.body.data;
        } else if (typeof req.body.payload === "string") {
            encryptedBody = req.body.payload;
        } else {
            // Request body is plain JSON, so skip AES decryption.
            return next();
        }

        const decryptedData = CryptoJS.AES.decrypt(
            encryptedBody,
            CryptoJS.enc.Utf8.parse(key),
            { iv: CryptoJS.enc.Utf8.parse(iv) },
        ).toString(CryptoJS.enc.Utf8);
 
    let decryptionSend;
 
    try {
      decryptionSend = JSON.parse(decryptedData);
    } catch (error) {
      console.log("Error parsing decrypted data:", error.message);
      return sendApiResponse(
        res,
                Codes.SUCCESS,
                Codes.RESPONSE_ERROR,
                "rest_keywords_error",
        null,
      );
    }
 
    req.body = decryptionSend;
    return next();
  }
 
  return next();
};

export default {
    // sendResponse,
    // allowedRoles,
    resolveMessage,
    getMessage ,
    extractHeaderLanguage,
    getHeaderLanguage,
    sendApiResponse ,
    checkApi ,
    allowedRoles,
    tokenMiddleware,
    resumeUploadMiddleware,
    decryption,
    validateJoi,
}