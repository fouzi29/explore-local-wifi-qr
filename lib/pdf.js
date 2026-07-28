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
exports.generateTabletopStandPdfBuffer = generateTabletopStandPdfBuffer;
var pdfkit_1 = require("pdfkit");
function getLogoBuffer(logoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var url, base64Data, res, arrayBuffer, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!logoUrl || !logoUrl.trim())
                        return [2 /*return*/, null];
                    url = logoUrl.trim();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (url.startsWith('data:image/')) {
                        base64Data = url.split(',')[1];
                        if (base64Data) {
                            return [2 /*return*/, Buffer.from(base64Data, 'base64')];
                        }
                    }
                    if (!(url.startsWith('http://') || url.startsWith('https://'))) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.arrayBuffer()];
                case 3:
                    arrayBuffer = _a.sent();
                    return [2 /*return*/, Buffer.from(arrayBuffer)];
                case 4: return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error('Failed to load logo buffer for PDF:', err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Generates a high-quality PDF Buffer for the printable tabletop QR stand
 */
function generateTabletopStandPdfBuffer(venue, qrBuffer) {
    return __awaiter(this, void 0, void 0, function () {
        var logoBuffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getLogoBuffer(venue.logoUrl)];
                case 1:
                    logoBuffer = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            try {
                                var doc = new pdfkit_1.default({
                                    size: 'A4',
                                    margin: 40,
                                    info: {
                                        Title: "".concat(venue.name, " - Tabletop QR Stand"),
                                        Author: 'WiFiPulse System'
                                    }
                                });
                                var buffers_1 = [];
                                doc.on('data', buffers_1.push.bind(buffers_1));
                                doc.on('end', function () {
                                    var pdfData = Buffer.concat(buffers_1);
                                    resolve(pdfData);
                                });
                                var pageWidth = doc.page.width;
                                var cardWidth = 420;
                                var cardHeight = 560;
                                var cardX = (pageWidth - cardWidth) / 2;
                                var cardY = 50;
                                // Draw Outer Card Container
                                doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 20)
                                    .lineWidth(2)
                                    .strokeColor('#cbd5e1')
                                    .fillColor('#ffffff')
                                    .fillAndStroke();
                                // Header Banner Box
                                var accentColor = venue.accentColor || '#16a34a';
                                doc.roundedRect(cardX + 20, cardY + 20, cardWidth - 40, 80, 14)
                                    .fillColor('#0f172a')
                                    .fill();
                                // Header Text / Logo positioning
                                var titleY = cardY + 36;
                                if (logoBuffer) {
                                    try {
                                        // Render venue logo inside header banner box
                                        var logoWidth = 100;
                                        var logoHeight = 35;
                                        var logoX = (pageWidth - logoWidth) / 2;
                                        doc.image(logoBuffer, logoX, cardY + 25, {
                                            fit: [logoWidth, logoHeight],
                                            align: 'center',
                                            valign: 'center'
                                        });
                                        titleY = cardY + 62;
                                    }
                                    catch (e) {
                                        // If logo buffer fails, keep standard text alignment
                                    }
                                }
                                // Venue Title Text inside Banner
                                doc.fillColor('#ffffff')
                                    .fontSize(18)
                                    .font('Helvetica-Bold')
                                    .text(venue.name.toUpperCase(), cardX + 20, titleY, {
                                    width: cardWidth - 40,
                                    align: 'center'
                                });
                                // Tagline
                                if (!logoBuffer) {
                                    doc.fillColor(accentColor)
                                        .fontSize(10)
                                        .font('Helvetica-Bold')
                                        .text((venue.tagline || 'FREE GUEST WI-FI ACCESS').toUpperCase(), cardX + 20, cardY + 65, {
                                        width: cardWidth - 40,
                                        align: 'center'
                                    });
                                }
                                // Main Headline
                                doc.fillColor('#0f172a')
                                    .fontSize(22)
                                    .font('Helvetica-Bold')
                                    .text('FREE HIGH-SPEED WI-FI', cardX + 20, cardY + 120, {
                                    width: cardWidth - 40,
                                    align: 'center'
                                });
                                // Instruction Subtitle
                                doc.fillColor('#64748b')
                                    .fontSize(11)
                                    .font('Helvetica')
                                    .text('Point your smartphone camera to scan & unlock internet', cardX + 20, cardY + 150, {
                                    width: cardWidth - 40,
                                    align: 'center'
                                });
                                // Center QR Code Image Box
                                var qrSize = 220;
                                var qrX = (pageWidth - qrSize) / 2;
                                var qrY = cardY + 185;
                                // Light background box behind QR
                                doc.roundedRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16)
                                    .fillColor('#f8fafc')
                                    .strokeColor('#cbd5e1')
                                    .lineWidth(1.5)
                                    .fillAndStroke();
                                // Embed QR PNG Buffer
                                doc.image(qrBuffer, qrX, qrY, {
                                    width: qrSize,
                                    height: qrSize
                                });
                                // Embed Center Logo over QR Code if logo is present
                                if (logoBuffer) {
                                    try {
                                        var qrLogoSize = 44;
                                        var qrLogoX = (pageWidth - qrLogoSize) / 2;
                                        var qrLogoY = qrY + (qrSize - qrLogoSize) / 2;
                                        var pad = 6;
                                        // White rounded background box behind center logo on QR
                                        doc.roundedRect(qrLogoX - pad, qrLogoY - pad, qrLogoSize + (pad * 2), qrLogoSize + (pad * 2), 8)
                                            .fillColor('#ffffff')
                                            .strokeColor('#cbd5e1')
                                            .lineWidth(1)
                                            .fillAndStroke();
                                        doc.image(logoBuffer, qrLogoX, qrLogoY, {
                                            fit: [qrLogoSize, qrLogoSize],
                                            align: 'center',
                                            valign: 'center'
                                        });
                                    }
                                    catch (e) {
                                        // Fallback if logo fails
                                    }
                                }
                                // Wi-Fi Details Box at Bottom
                                var detailsY = cardY + 445;
                                doc.moveTo(cardX + 30, detailsY)
                                    .lineTo(cardX + cardWidth - 30, detailsY)
                                    .lineWidth(1)
                                    .strokeColor('#e2e8f0')
                                    .stroke();
                                doc.fillColor('#334155')
                                    .fontSize(12)
                                    .font('Helvetica-Bold')
                                    .text("Network (SSID): ".concat(venue.wifi.ssid), cardX + 30, detailsY + 16, {
                                    width: cardWidth - 60,
                                    align: 'center'
                                });
                                doc.fillColor('#334155')
                                    .fontSize(12)
                                    .font('Helvetica-Bold')
                                    .text("Password: ".concat(venue.wifi.password), cardX + 30, detailsY + 36, {
                                    width: cardWidth - 60,
                                    align: 'center'
                                });
                                // Footer branding
                                doc.fillColor('#94a3b8')
                                    .fontSize(9)
                                    .font('Helvetica')
                                    .text('Powered by WiFiPulse • https://explore-local-wifi-qr.vercel.app', cardX + 20, cardY + cardHeight - 25, {
                                    width: cardWidth - 40,
                                    align: 'center'
                                });
                                doc.end();
                            }
                            catch (err) {
                                reject(err);
                            }
                        })];
            }
        });
    });
}
