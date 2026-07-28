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
exports.generateStyledQrCodeBuffer = generateStyledQrCodeBuffer;
var qrcode_1 = require("qrcode");
var sharp_1 = require("sharp");
function fetchLogoBuffer(logoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var base64Data, res, arrayBuffer, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (logoUrl.startsWith('data:image/')) {
                        base64Data = logoUrl.split(',')[1];
                        if (base64Data)
                            return [2 /*return*/, Buffer.from(base64Data, 'base64')];
                    }
                    if (!(logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(logoUrl)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.arrayBuffer()];
                case 2:
                    arrayBuffer = _a.sent();
                    return [2 /*return*/, Buffer.from(arrayBuffer)];
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Failed to fetch logo for QR code:', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Generates a high-resolution QR code Buffer with an optional centered logo image for the Server
 */
function generateStyledQrCodeBuffer(text_1, logoUrl_1) {
    return __awaiter(this, arguments, void 0, function (text, logoUrl, accentColor, size) {
        var qrBuffer, logoBuffer, logoSize, pad, boxSize, rectSvg, resizedLogo, err_2;
        if (accentColor === void 0) { accentColor = '#16a34a'; }
        if (size === void 0) { size = 500; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, qrcode_1.default.toBuffer(text, {
                        width: size,
                        margin: 1,
                        color: {
                            dark: accentColor || '#16a34a',
                            light: '#ffffff'
                        }
                    })];
                case 1:
                    qrBuffer = _a.sent();
                    if (!logoUrl || !logoUrl.trim()) {
                        return [2 /*return*/, qrBuffer];
                    }
                    return [4 /*yield*/, fetchLogoBuffer(logoUrl.trim())];
                case 2:
                    logoBuffer = _a.sent();
                    if (!logoBuffer) {
                        return [2 /*return*/, qrBuffer];
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    logoSize = Math.floor(size * 0.22);
                    pad = Math.floor(logoSize * 0.15);
                    boxSize = logoSize + (pad * 2);
                    rectSvg = Buffer.from("<svg width=\"".concat(boxSize, "\" height=\"").concat(boxSize, "\">\n        <rect x=\"0\" y=\"0\" width=\"").concat(boxSize, "\" height=\"").concat(boxSize, "\" rx=\"12\" ry=\"12\" fill=\"#ffffff\" />\n      </svg>"));
                    return [4 /*yield*/, (0, sharp_1.default)(logoBuffer)
                            .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
                            .toBuffer()];
                case 4:
                    resizedLogo = _a.sent();
                    return [4 /*yield*/, (0, sharp_1.default)(qrBuffer)
                            .composite([
                            { input: rectSvg, gravity: 'center' },
                            { input: resizedLogo, gravity: 'center' }
                        ])
                            .png()
                            .toBuffer()];
                case 5: 
                // Composite the background and the logo over the QR code
                return [2 /*return*/, _a.sent()];
                case 6:
                    err_2 = _a.sent();
                    console.error('Failed to composite QR code with logo:', err_2);
                    return [2 /*return*/, qrBuffer]; // Fallback to base QR
                case 7: return [2 /*return*/];
            }
        });
    });
}
