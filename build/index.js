"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./schema/schema");
const app = (0, express_1.default)();
//middleware
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema_1.schema,
    graphiql: true,
}));
app.listen(4000, () => {
    console.log("LISTENING ON 4000");
});
