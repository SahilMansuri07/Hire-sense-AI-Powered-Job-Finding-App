import localizify from "localizify";
import Codes from "../config/status_codes.js";
const { default: local , t } = localizify;
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserDevice from "../models/UserDevice.js";
import es from "../languages/es.js";
import fr from "../languages/fr.js";
import en from "../languages/en.js";
import hn from "../languages/hn.js";

dotenv.config();

local
  .add("en", en)
  .add("es", es)
  .add("fr", fr)
  .add("hn", hn);

let is_lang = "en";

const bypassRoutes = [
    "/api/v1/auth/login",
    "/api/v1/auth/signup",
    "/api/v1/auth/validate-user",
    "/api/v1/auth/refresh",
    "/api/v1/recruiter/debug-jobs",
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

    res.status(httpStatus);
    res.json(responsejson);
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
    //   console.log("Token from headers: ", token);
        if (!token) {
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_TOKEN,
                "Invalid_or_missing_token",
                null
            );
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
        // console.log("Decoded token: ", decoded);
        // console.log("Bearer token: ", bearerToken);

        // Verify user exists and is active in MongoDB
        const userToken = await UserDevice.findOne({
            userId: decoded.id, 
            token: bearerToken,
            is_active: true,
            is_delete: false,
        }).lean();
        // console.log("userToken: ", userToken);

        if (!userToken) {
            return sendApiResponse(res, Codes.UNAUTHORIZED, Codes.INVALID_TOKEN, "Invalid_or_missing_token", null);
        }
        
        if(userToken.is_active === false) {
            return sendApiResponse(
                res,
                Codes.UNAUTHORIZED,
                Codes.INVALID_TOKEN,
                "Token_expired_Please_login_again",
                null
            );
        }

        req.loginUser = decoded;
        next();
}

const allowedRoles = (...roles) => {
    // console.log("roles: ", roles);   
    return (req, res, next) => {
        if(!roles.includes(req.loginUser.role)){
            return sendApiResponse(res, Codes.UNAUTHORIZED, Codes.INVALID_TOKEN, "Access_Denied", null);
        }
        next();
    };
};

export default {
    // sendResponse,
    // allowedRoles,
    resolveMessage,
    getMessage ,
    extractHeaderLanguage,
    getHeaderLanguage,
    sendApiResponse ,
    allowedRoles,
    tokenMiddleware,
    validateJoi,
}