"use strict";
exports.__esModule = true;
exports.Icon = void 0;
var react_1 = require("react");
var GlyphKitProvider_1 = require("./GlyphKitProvider");
var Icon = function (_a) {
    var name = _a.name, _b = _a.size, size = _b === void 0 ? 24 : _b, _c = _a.color, color = _c === void 0 ? 'currentColor' : _c, className = _a.className;
    var _d = (0, GlyphKitProvider_1.useGlyphKit)(), icons = _d.icons, isLoading = _d.isLoading, error = _d.error;
    if (isLoading)
        return null;
    if (error)
        return null;
    var icon = icons.find(function (i) { return i.name === name; });
    if (!icon)
        return null;
    return (<svg width={size} height={size} fill={color} className={className} viewBox="0 0 24 24">
      <use href={"".concat(icon.path, "#").concat(icon.id)}/>
    </svg>);
};
exports.Icon = Icon;
