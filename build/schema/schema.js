"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const users = [
    { id: "23", firstName: "Bill", age: 30 },
    { id: "47", firstName: "Sam", age: 21 },
];
const UserType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: graphql_1.GraphQLString },
        firstName: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
    },
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: graphql_1.GraphQLString } },
            resolve(parentValue, args) {
                return users.find((el) => el.id === args.id);
            },
        },
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
});
