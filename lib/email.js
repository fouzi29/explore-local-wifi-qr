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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVenueWelcomeEmail = sendVenueWelcomeEmail;
exports.sendCreatorVenueAlertEmail = sendCreatorVenueAlertEmail;
exports.sendVenueLeadEmail = sendVenueLeadEmail;
exports.sendCreatorLeadDigestEmail = sendCreatorLeadDigestEmail;
exports.testSmtpConnection = testSmtpConnection;
var nodemailer_1 = require("nodemailer");
var qr_server_1 = require("./qr-server");
var wifi_1 = require("./wifi");
var pdf_1 = require("./pdf");
var SYSTEM_OUTGOING_EMAIL = 'fzfemass.1021@gmail.com';
var SYSTEM_OUTGOING_PASS = 'gxspshuwjejecqmc';
var MASTER_CREATOR_EMAIL = 'fouzi.cse@gmail.com';
function getSystemTransporter() {
    return nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: SYSTEM_OUTGOING_EMAIL,
            pass: SYSTEM_OUTGOING_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}
/**
 * 1. Welcome Email sent to Venue Owner immediately after registration with Embedded QR Code & PDF Stand Attachment
 */
function sendVenueWelcomeEmail(venue) {
    return __awaiter(this, void 0, void 0, function () {
        var recipientEmail, _a, s, p, e, l, portalUrl, qrBuffer, pdfBuffer, transporter, info, err_1;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    recipientEmail = ((_b = venue.smtp) === null || _b === void 0 ? void 0 : _b.notifyEmail) || ((_c = venue.smtp) === null || _c === void 0 ? void 0 : _c.user) || MASTER_CREATOR_EMAIL;
                    _a = (0, wifi_1.encodeVenueParams)(venue.wifi.ssid, venue.wifi.password, (_d = venue.smtp) === null || _d === void 0 ? void 0 : _d.notifyEmail, venue.logoUrl), s = _a.s, p = _a.p, e = _a.e, l = _a.l;
                    portalUrl = "https://explore-local-wifi-qr.vercel.app/v/".concat(venue.slug, "?s=").concat(encodeURIComponent(s), "&p=").concat(encodeURIComponent(p), "&e=").concat(encodeURIComponent(e), "&l=").concat(encodeURIComponent(l));
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, qr_server_1.generateStyledQrCodeBuffer)(portalUrl, venue.logoUrl, venue.accentColor || '#16a34a', 500)];
                case 2:
                    qrBuffer = _e.sent();
                    return [4 /*yield*/, (0, pdf_1.generateTabletopStandPdfBuffer)(venue, qrBuffer)];
                case 3:
                    pdfBuffer = _e.sent();
                    transporter = getSystemTransporter();
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"WiFiPulse System\" <".concat(SYSTEM_OUTGOING_EMAIL, ">"),
                            to: recipientEmail,
                            subject: "\uD83C\uDF89 Registration Success: ".concat(venue.name, " QR Wi-Fi Portal & Printable PDF Attached"),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff; color: #111827;\">\n          \n          <div style=\"border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; text-align: center;\">\n            <h1 style=\"color: #0f172a; margin: 0; font-size: 24px;\">\uD83C\uDF89 Welcome to WiFiPulse!</h1>\n            <p style=\"color: #16a34a; font-weight: bold; margin-top: 6px; font-size: 16px;\">Your Venue Portal for <strong>".concat(venue.name, "</strong> is Ready!</p>\n          </div>\n\n          <p style=\"font-size: 15px; color: #374151; line-height: 1.6;\">\n            Congratulations! Your QR Wi-Fi Lead Capture Portal has been created successfully. Below is your official QR code image and attached <strong>Printable PDF Tabletop Stand</strong>!\n          </p>\n\n          <!-- EMBEDDED QR CODE IMAGE -->\n          <div style=\"text-align: center; margin: 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;\">\n            <h3 style=\"margin-top: 0; color: #0f172a;\">\uD83D\uDCF1 Your Official Tabletop QR Code:</h3>\n            <img src=\"cid:qrcode_image\" alt=\"").concat(venue.name, " QR Code\" style=\"width: 220px; height: 220px; border-radius: 12px; border: 2px solid #e2e8f0;\" />\n            <p style=\"font-size: 13px; color: #64748b; margin-top: 8px;\">Point phone camera to test instant scan</p>\n          </div>\n\n          <div style=\"background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;\">\n            <h3 style=\"margin-top: 0; color: #0f172a;\">\uD83D\uDCCB Venue & Wi-Fi Details:</h3>\n            <p style=\"margin: 6px 0; font-size: 14px;\"><strong>Venue Name:</strong> ").concat(venue.name, "</p>\n            <p style=\"margin: 6px 0; font-size: 14px;\"><strong>Guest Portal Link:</strong> <a href=\"").concat(portalUrl, "\" style=\"color: #16a34a; font-weight: bold;\">").concat(portalUrl, "</a></p>\n            <p style=\"margin: 6px 0; font-size: 14px;\"><strong>Wi-Fi SSID:</strong> <code>").concat(venue.wifi.ssid, "</code></p>\n            <p style=\"margin: 6px 0; font-size: 14px;\"><strong>Wi-Fi Password:</strong> <code>").concat(venue.wifi.password, "</code></p>\n            <p style=\"margin: 6px 0; font-size: 14px;\"><strong>Notification Recipient Email:</strong> ").concat(recipientEmail, "</p>\n          </div>\n\n          <div style=\"text-align: center; margin: 24px 0;\">\n            <a href=\"").concat(portalUrl, "\" style=\"background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; font-size: 15px; display: inline-block;\">\n              Open Live Guest Portal\n            </a>\n          </div>\n\n          <div style=\"font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;\">\n            Sent automatically by WiFiPulse System (").concat(SYSTEM_OUTGOING_EMAIL, ")\n          </div>\n\n        </div>\n      "),
                            attachments: [
                                {
                                    filename: "".concat(venue.slug, "_qr_code.png"),
                                    content: qrBuffer,
                                    cid: 'qrcode_image'
                                },
                                {
                                    filename: "".concat(venue.slug, "_tabletop_stand.pdf"),
                                    content: pdfBuffer,
                                    contentType: 'application/pdf'
                                }
                            ]
                        })];
                case 4:
                    info = _e.sent();
                    console.log('Welcome email with PDF attachment dispatched to', recipientEmail, 'MessageID:', info.messageId);
                    return [2 /*return*/, { success: true, message: "Welcome email with attached PDF sent to ".concat(recipientEmail) }];
                case 5:
                    err_1 = _e.sent();
                    console.error('Failed to send venue welcome email:', err_1);
                    return [2 /*return*/, { success: false, message: (err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || 'Failed welcome email' }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * 2. Alert Email sent to Master Creator (fouzi.cse@gmail.com) whenever ANY user registers a venue
 */
function sendCreatorVenueAlertEmail(venue) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, s, p, e, l, portalUrl, registrarEmail, recipients, toList, qrBuffer, pdfBuffer, transporter, info, err_2;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = (0, wifi_1.encodeVenueParams)(venue.wifi.ssid, venue.wifi.password, (_b = venue.smtp) === null || _b === void 0 ? void 0 : _b.notifyEmail, venue.logoUrl), s = _a.s, p = _a.p, e = _a.e, l = _a.l;
                    portalUrl = "https://explore-local-wifi-qr.vercel.app/v/".concat(venue.slug, "?s=").concat(encodeURIComponent(s), "&p=").concat(encodeURIComponent(p), "&e=").concat(encodeURIComponent(e), "&l=").concat(encodeURIComponent(l));
                    registrarEmail = ((_c = venue.smtp) === null || _c === void 0 ? void 0 : _c.notifyEmail) || ((_d = venue.smtp) === null || _d === void 0 ? void 0 : _d.user) || '';
                    recipients = [MASTER_CREATOR_EMAIL, registrarEmail].filter(Boolean);
                    toList = Array.from(new Set(recipients)).join(', ');
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, qr_server_1.generateStyledQrCodeBuffer)(portalUrl, venue.logoUrl, venue.accentColor || '#16a34a', 500)];
                case 2:
                    qrBuffer = _f.sent();
                    return [4 /*yield*/, (0, pdf_1.generateTabletopStandPdfBuffer)(venue, qrBuffer)];
                case 3:
                    pdfBuffer = _f.sent();
                    transporter = getSystemTransporter();
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"WiFiPulse System\" <".concat(SYSTEM_OUTGOING_EMAIL, ">"),
                            to: toList,
                            subject: "\uD83D\uDEA8 New System Registration Alert: ".concat(venue.name),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;\">\n          <h2 style=\"color: #0d9488; margin-top: 0;\">\uD83D\uDEA8 New Venue Registered On Your Platform!</h2>\n          <p>A new venue owner has set up their portal on your WiFiPulse system.</p>\n          <ul style=\"line-height: 1.8; color: #374151;\">\n            <li><strong>Venue Name:</strong> ".concat(venue.name, "</li>\n            <li><strong>Owner Notification Email:</strong> ").concat(((_e = venue.smtp) === null || _e === void 0 ? void 0 : _e.notifyEmail) || 'Not specified', "</li>\n            <li><strong>Portal URL:</strong> <a href=\"").concat(portalUrl, "\">").concat(portalUrl, "</a></li>\n            <li><strong>Wi-Fi SSID:</strong> ").concat(venue.wifi.ssid, "</li>\n            <li><strong>Registration Time:</strong> ").concat(new Date().toLocaleString(), "</li>\n          </ul>\n          \n          <!-- EMBEDDED QR CODE IMAGE -->\n          <div style=\"text-align: center; margin: 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;\">\n            <h3 style=\"margin-top: 0; color: #0f172a;\">\uD83D\uDCF1 Tabletop QR Code:</h3>\n            <img src=\"cid:qrcode_image\" alt=\"").concat(venue.name, " QR Code\" style=\"width: 220px; height: 220px; border-radius: 12px; border: 2px solid #e2e8f0;\" />\n          </div>\n\n          <p style=\"color: #6b7280; font-size: 12px;\">Sent to Platform Creator & Venue Registrar.</p>\n        </div>\n      "),
                            attachments: [
                                {
                                    filename: "".concat(venue.slug, "_qr_code.png"),
                                    content: qrBuffer,
                                    cid: 'qrcode_image'
                                },
                                {
                                    filename: "".concat(venue.slug, "_tabletop_stand.pdf"),
                                    content: pdfBuffer,
                                    contentType: 'application/pdf'
                                }
                            ]
                        })];
                case 4:
                    info = _f.sent();
                    return [2 /*return*/, { success: true, message: "Creator alert sent to ".concat(MASTER_CREATOR_EMAIL) }];
                case 5:
                    err_2 = _f.sent();
                    console.error('Failed to send creator venue alert:', err_2);
                    return [2 /*return*/, { success: false, message: (err_2 === null || err_2 === void 0 ? void 0 : err_2.message) || 'Failed creator alert' }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * 3. Sends lead notification to venue owner on guest Wi-Fi scan with BCC to fouzi.cse@gmail.com
 */
function sendVenueLeadEmail(venue, lead) {
    return __awaiter(this, void 0, void 0, function () {
        var recipientEmail, transporter, info, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    recipientEmail = ((_a = venue.smtp) === null || _a === void 0 ? void 0 : _a.notifyEmail) || MASTER_CREATOR_EMAIL;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    transporter = getSystemTransporter();
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"".concat(venue.name, " Wi-Fi\" <").concat(SYSTEM_OUTGOING_EMAIL, ">"),
                            to: recipientEmail,
                            bcc: MASTER_CREATOR_EMAIL, // BCC creator (fouzi.cse@gmail.com) on every lead!
                            subject: "\u26A1 New Guest Wi-Fi Lead Captured: ".concat(lead.name, " | WiFiPulse Alert"),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff; color: #111827;\">\n          <h2 style=\"color: #16a34a; margin-top: 0;\">\uD83C\uDF89 New Guest Wi-Fi Lead Captured!</h2>\n          <p>Venue: <strong>".concat(venue.name, "</strong></p>\n          <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border-radius: 10px; padding: 12px;\">\n            <tr><td style=\"padding: 10px; color: #4b5563; font-weight: bold; width: 35%;\">Guest Name:</td><td style=\"padding: 10px; font-weight: bold; color: #0f172a;\">").concat(lead.name, "</td></tr>\n            <tr><td style=\"padding: 10px; color: #4b5563; font-weight: bold;\">Contact Info:</td><td style=\"padding: 10px; color: #16a34a; font-weight: bold;\">").concat(lead.emailOrPhone, "</td></tr>\n            <tr><td style=\"padding: 10px; color: #4b5563; font-weight: bold;\">Device Scanner:</td><td style=\"padding: 10px;\">").concat(lead.deviceType || 'Mobile Web Scanner', "</td></tr>\n            <tr><td style=\"padding: 10px; color: #4b5563; font-weight: bold;\">Captured At:</td><td style=\"padding: 10px; color: #6b7280; font-size: 13px;\">").concat(new Date(lead.createdAt).toLocaleString(), "</td></tr>\n          </table>\n          <p style=\"font-size: 12px; color: #9ca3af; text-align: center;\">Sent by WiFiPulse System (").concat(SYSTEM_OUTGOING_EMAIL, ")</p>\n        </div>\n      ")
                        })];
                case 2:
                    info = _b.sent();
                    console.log('Lead notification email sent to venue owner:', recipientEmail, '(BCC:', MASTER_CREATOR_EMAIL, ') MessageID:', info.messageId);
                    return [2 /*return*/, { success: true, message: "Lead email sent to ".concat(recipientEmail, " with BCC to ").concat(MASTER_CREATOR_EMAIL) }];
                case 3:
                    error_1 = _b.sent();
                    console.error('Failed to send venue lead email:', error_1);
                    return [2 /*return*/, { success: false, message: (error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'SMTP Connection error.' }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * 4. Sends telemetry email to creator on lead capture
 */
function sendCreatorLeadDigestEmail(venue, lead, totalPlatformLeads) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = getSystemTransporter();
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"WiFiPulse Telemetry\" <".concat(SYSTEM_OUTGOING_EMAIL, ">"),
                            to: MASTER_CREATOR_EMAIL,
                            subject: "\uD83D\uDCCA Telemetry: New Lead Captured on ".concat(venue.name),
                            html: "\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;\">\n          <h3 style=\"color: #16a34a; margin-top: 0;\">\uD83D\uDCCA WiFiPulse Telemetry Update</h3>\n          <p>A new guest lead was captured on your platform!</p>\n          <ul>\n            <li><strong>Venue:</strong> ".concat(venue.name, " (/v/").concat(venue.slug, ")</li>\n            <li><strong>Guest Name:</strong> ").concat(lead.name, "</li>\n            <li><strong>Contact:</strong> ").concat(lead.emailOrPhone, "</li>\n          </ul>\n        </div>\n      ")
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true, message: 'Digest email sent' }];
                case 2:
                    err_3 = _a.sent();
                    return [2 /*return*/, { success: false, message: (err_3 === null || err_3 === void 0 ? void 0 : err_3.message) || 'Digest error' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testSmtpConnection(smtp) {
    return __awaiter(this, void 0, void 0, function () {
        var transporter, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transporter = getSystemTransporter();
                    return [4 /*yield*/, transporter.verify()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, { success: true, message: 'SMTP connection verified successfully!' }];
                case 2:
                    err_4 = _a.sent();
                    return [2 /*return*/, { success: false, message: (err_4 === null || err_4 === void 0 ? void 0 : err_4.message) || 'SMTP Connection failed.' }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
