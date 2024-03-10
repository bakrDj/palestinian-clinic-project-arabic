"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var createAppSlice_1 = require("./createAppSlice");
var createUserSlice_1 = require("./createUserSlice");
var createNotificationSlice_1 = require("./createNotificationSlice");
var middleware_1 = require("zustand/middleware");
var zustand_1 = require("zustand");
var useStore = (0, zustand_1["default"])((0, middleware_1.devtools)(function (set, get) { return (__assign(__assign(__assign({}, (0, createAppSlice_1["default"])(set, get)), (0, createUserSlice_1["default"])(set, get)), (0, createNotificationSlice_1["default"])(set, get))); }));
exports["default"] = useStore;
