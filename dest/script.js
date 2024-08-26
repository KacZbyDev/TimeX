"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils"));
const refreshTime = 100;
let refreshInterval;
let miliseconds = 1000;
let ul;
window.addEventListener('load', () => {
    ul = document.getElementById('list-content');
    if (ul) {
        ul.textContent = (0, utils_1.default)(miliseconds);
        refreshInterval = setInterval(updateTime, refreshTime);
    }
});
function updateTime() {
    miliseconds -= refreshTime;
    if (miliseconds > 0)
        ul.textContent = (0, utils_1.default)(miliseconds);
    else
        refreshIntervalFinished();
}
function refreshIntervalFinished() {
    ul.textContent = "finished";
    clearInterval(refreshInterval);
}
//# sourceMappingURL=script.js.map