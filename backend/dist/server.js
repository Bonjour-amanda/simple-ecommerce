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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const hapi_1 = __importDefault(require("@hapi/hapi"));
const inert_1 = __importDefault(require("@hapi/inert"));
const dotenv_1 = __importDefault(require("dotenv"));
const adjustments_1 = require("./routes/adjustments");
dotenv_1.default.config();
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const server = hapi_1.default.Server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });
    // Register plugins
    yield server.register(inert_1.default);
    // Register routes
    (0, adjustments_1.adjustmentRoutes)(server);
    // Start the server
    yield server.start();
    console.log(`Server running on ${server.info.uri}`);
    return server;
});
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
// Export the server for testing purposes
exports.server = init();
