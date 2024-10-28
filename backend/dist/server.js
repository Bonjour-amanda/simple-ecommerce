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
Object.defineProperty(exports, "__esModule", { value: true });
const hapi_1 = require("@hapi/hapi");
const products_1 = require("./routes/products");
const adjustments_1 = require("./routes/adjustments");
const server = new hapi_1.Server({
    port: 3000,
    host: 'localhost'
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, products_1.productRoutes)(server); // Register routes here
    (0, adjustments_1.adjustmentRoutes)(server);
    yield server.start();
    console.log(`Server running on ${server.info.uri}`);
});
process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});
init();
