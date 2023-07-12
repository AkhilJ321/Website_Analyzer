"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenShotModel = void 0;
const mongoose_1 = require("mongoose");
const ScreenShot = new mongoose_1.Schema({
    url: String,
    publicId: String,
    photoUrl: String
});
const ScreenShotModel = (0, mongoose_1.model)('ScreenShot', ScreenShot);
exports.ScreenShotModel = ScreenShotModel;
