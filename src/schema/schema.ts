import {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

import axios from "axios";
import { response } from "express";

const users = [
  { id: "23", firstName: "Bill", age: 30 },
  { id: "47", firstName: "Sam", age: 21 },
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(
          `http://localhost:3000/users/${args.id}`
        );
        return response.data;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
