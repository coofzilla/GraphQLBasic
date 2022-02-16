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
exports.schema = void 0;
const graphql_1 = require("graphql");
const axios_1 = __importDefault(require("axios"));
const users = [
    { id: "23", firstName: "Bill", age: 30 },
    { id: "47", firstName: "Sam", age: 21 },
];
const CompanyType = new graphql_1.GraphQLObjectType({
    name: "Company",
    fields: {
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
    },
});
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: graphql_1.GraphQLString },
        firstName: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.get(`http://localhost:3000/companies/${parentValue.companyId}`);
                    return response.data;
                });
            },
        },
    },
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: graphql_1.GraphQLString } },
            resolve(parentValue, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.get(`http://localhost:3000/users/${args.id}`);
                    return response.data;
                });
            },
        },
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
});
