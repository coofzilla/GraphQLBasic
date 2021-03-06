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
//circular reference
const CompanyType = new graphql_1.GraphQLObjectType({
    name: "Company",
    //closure not executed until entire file
    fields: () => ({
        id: { type: graphql_1.GraphQLString },
        name: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        users: {
            type: new graphql_1.GraphQLList(UserType),
            //parentValue is current company
            resolve(parentValue, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.get(`http://localhost:3000/companies/${parentValue.id}/users`);
                    return response.data;
                });
            },
        },
    }),
});
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: () => ({
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
    }),
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
        company: {
            type: CompanyType,
            args: { id: { type: graphql_1.GraphQLString } },
            resolve(parentValue, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.get(`http://localhost:3000/companies/${args.id}`);
                    return response.data;
                });
            },
        },
    },
});
//mutation used to change/modify/delete data
const mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                //NonNull must provide value or throw error
                firstName: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                age: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) },
                companyId: { type: graphql_1.GraphQLString },
            },
            resolve(parentValue, { firstName, age }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.post("http://localhost:3000/users", {
                        firstName,
                        age,
                    });
                    return response.data;
                });
            },
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                firstName: { type: graphql_1.GraphQLString },
                age: { type: graphql_1.GraphQLInt },
                companyId: { type: graphql_1.GraphQLString },
            },
            resolve(parentValue, args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.patch(`http://localhost:3000/users/${args.id}`, args);
                    return response.data;
                });
            },
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
            },
            resolve(parentValue, { id }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const response = yield axios_1.default.delete(`http://localhost:3000/users/${id}`);
                    return response.data;
                });
            },
        },
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation,
});
// use w/GraphiQL f/ spreading query params
// fragment companyDetails on Company {
//     id
//     name
//     description
// }
