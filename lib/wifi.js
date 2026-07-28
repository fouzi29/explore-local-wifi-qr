"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWifiQrString = generateWifiQrString;
exports.encodeVenueParams = encodeVenueParams;
exports.decodeVenueParams = decodeVenueParams;
exports.downloadCsv = downloadCsv;
/**
 * Standard Wi-Fi QR Code string for direct camera scanning
 */
function generateWifiQrString(config) {
    var ssid = config.ssid, password = config.password, encryption = config.encryption, _a = config.hidden, hidden = _a === void 0 ? false : _a;
    if (encryption === 'nopass' || !password) {
        return "WIFI:S:".concat(escapeWifiField(ssid), ";T:nopass;;");
    }
    var encType = (encryption === 'WPA2' || encryption === 'WPA') ? 'WPA' : encryption;
    var hFlag = hidden ? 'H:true;' : '';
    return "WIFI:S:".concat(escapeWifiField(ssid), ";T:").concat(encType, ";P:").concat(escapeWifiField(password), ";").concat(hFlag, ";");
}
function escapeWifiField(str) {
    return str.replace(/([\\;:,"])/g, '\\$1');
}
/**
 * Safe Base64 helpers for encoding SSID, Password, Owner Email, and Logo URL in Tabletop QR URLs
 */
function encodeVenueParams(ssid, password, notifyEmail, logoUrl) {
    var safeBtoa = function (str) {
        if (!str)
            return '';
        try {
            return typeof window !== 'undefined' ? btoa(encodeURIComponent(str)) : Buffer.from(str).toString('base64');
        }
        catch (e) {
            return encodeURIComponent(str);
        }
    };
    return {
        s: safeBtoa(ssid),
        p: safeBtoa(password),
        e: safeBtoa(notifyEmail || ''),
        l: safeBtoa(logoUrl || '')
    };
}
function decodeVenueParams(sParam, pParam, eParam, lParam) {
    var safeAtob = function (str) {
        if (!str)
            return '';
        try {
            return typeof window !== 'undefined' ? decodeURIComponent(atob(str)) : Buffer.from(str, 'base64').toString('utf-8');
        }
        catch (e) {
            return decodeURIComponent(str);
        }
    };
    return {
        ssid: safeAtob(sParam),
        password: safeAtob(pParam),
        notifyEmail: safeAtob(eParam),
        logoUrl: safeAtob(lParam)
    };
}
function downloadCsv(filename, rows) {
    if (!rows || !rows.length)
        return;
    var headers = Object.keys(rows[0]);
    var csvContent = __spreadArray([
        headers.join(',')
    ], rows.map(function (row) {
        return headers.map(function (header) {
            var val = row[header] === undefined || row[header] === null ? '' : String(row[header]);
            return "\"".concat(val.replace(/"/g, '""'), "\"");
        }).join(',');
    }), true).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
