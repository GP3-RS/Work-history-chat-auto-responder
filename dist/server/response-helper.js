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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Configuration, OpenAIApi } from "openai";
import { fileURLToPath } from "url";
import cache from "./cache.js";
//Import our series of messages to help train chatGPT before each response so that it answers correctly
import { messages } from "../messages.js";
console.log("messages import: ", messages ? "PASS" : "FAIL");
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
//Import resume file for ChatGPT to know my work history
var resume = fs.readFileSync(path.resolve(__dirname + "../../../resume"), {
    encoding: "utf8",
    flag: "r",
});
console.log("resume import: ", resume ? "PASS" : "FAIL");
//Initialize and configure OpenAI API
var openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
}));
console.log("openai configuration: ", openai ? "PASS" : "FAIL");
var responseHelper = {
    generateAndPost: function (data) {
        console.log("hitting responseHelper.generateAndPost");
        return new Promise(function (resolve, reject) {
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var responseMessage, responseObj, cacheResults, err_1, err_2, err_3, err_4;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 20, , 21]);
                            responseMessage = void 0;
                            responseObj = void 0;
                            cacheResults = void 0;
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 6, , 7]);
                            if (!(process.env.CACHE === 'Redis')) return [3 /*break*/, 3];
                            return [4 /*yield*/, cache.get(data.question)];
                        case 2:
                            cacheResults = _c.sent();
                            return [3 /*break*/, 5];
                        case 3:
                            if (!(process.env.CACHE === 'DynamoDB')) return [3 /*break*/, 5];
                            return [4 /*yield*/, cache.get(data.question)];
                        case 4:
                            cacheResults = (_a = (_c.sent()).props) === null || _a === void 0 ? void 0 : _a.value;
                            _c.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            err_1 = _c.sent();
                            console.log("Error with cache.get(data.question): ", err_1);
                            reject(err_1);
                            return [3 /*break*/, 7];
                        case 7:
                            if (!!cacheResults) return [3 /*break*/, 18];
                            console.log(process.env.CACHE + " cache miss");
                            _c.label = 8;
                        case 8:
                            _c.trys.push([8, 10, , 11]);
                            return [4 /*yield*/, openai.createChatCompletion({
                                    model: "gpt-3.5-turbo",
                                    messages: __spreadArray(__spreadArray([
                                        { role: "system", content: process.env.PROMPT },
                                        {
                                            role: "user",
                                            content: "Do not lie and make things up. If you don't have 100% confidence in the truthfulness of your response, ask the user to email Gahl.",
                                        },
                                        {
                                            role: "user",
                                            content: "here is Gahl's resume, answer questions as if you are him, using his resume: " +
                                                resume,
                                        }
                                    ], messages, true), [
                                        { role: "user", content: data.question },
                                    ], false),
                                    temperature: 0.1,
                                    max_tokens: 400,
                                    top_p: 0.5,
                                })];
                        case 9:
                            responseObj = _c.sent();
                            return [3 /*break*/, 11];
                        case 10:
                            err_2 = _c.sent();
                            console.log("Error with openai.createChatCompletion: ", err_2);
                            reject(err_2);
                            return [2 /*return*/];
                        case 11:
                            if (!!responseObj) return [3 /*break*/, 12];
                            console.log("No response from openai.generate response invocation");
                            reject(new Error("no response"));
                            return [2 /*return*/];
                        case 12:
                            if (!((_b = responseObj === null || responseObj === void 0 ? void 0 : responseObj.data) === null || _b === void 0 ? void 0 : _b.error)) return [3 /*break*/, 13];
                            console.log("ERROR with generating a response: ", responseObj.data.error);
                            reject(new Error(responseObj.data.error));
                            return [2 /*return*/];
                        case 13:
                            responseMessage = responseObj.data.choices[0].message.content
                                .trim()
                                .replace(/(\r\n|\n|\r)/gm, "");
                            _c.label = 14;
                        case 14:
                            _c.trys.push([14, 16, , 17]);
                            return [4 /*yield*/, cache.set(data.question, process.env.CACHE === "Redis"
                                    ? responseMessage
                                    : { value: responseMessage })];
                        case 15:
                            _c.sent();
                            return [3 /*break*/, 17];
                        case 16:
                            err_3 = _c.sent();
                            console.log("Error with cache.set method: ", err_3);
                            reject(err_3);
                            return [2 /*return*/];
                        case 17: return [3 /*break*/, 19];
                        case 18:
                            responseMessage =
                                "Someone has asked this question before (i.e. it's a cache hit). The previously generated response was: \n" +
                                    cacheResults;
                            console.log(process.env.CACHE + " cache hit");
                            _c.label = 19;
                        case 19:
                            if (data.platform === "slack") {
                                responseHelper.postToSlack(responseMessage);
                            }
                            else if (data.platform === "website") {
                                responseHelper.postToWebsite(responseMessage);
                            }
                            resolve(); // Resolve the Promise when the operation is complete
                            return [3 /*break*/, 21];
                        case 20:
                            err_4 = _c.sent();
                            reject(err_4); // Reject the Promise if there's an error
                            return [2 /*return*/];
                        case 21: return [2 /*return*/];
                    }
                });
            }); })().catch(function (e) { return console.log("Caught error in promise: " + e); });
        });
    },
    postToSlack: function (text) {
        console.log("SENDING RESPONSE TO SLACK");
        var payload = {
            channel: process.env.CHANNEL_NAME,
            text: text,
        };
        fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: "Bearer ".concat(process.env.SLACK_BOT_TOKEN),
                Accept: "application/json",
            },
        })
            .then(function (resp) {
            if (!(resp === null || resp === void 0 ? void 0 : resp.ok)) {
                console.log("Response not OK: ", resp);
                throw new Error("Response not OK: " + resp.status);
            }
        })
            .catch(function (error) {
            console.log("ERROR IN POSTMESSAGE:", error);
        });
        return;
    },
    postToWebsite: function (text) {
        return;
    }
};
export default responseHelper;
