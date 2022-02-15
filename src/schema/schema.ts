import {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";

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
      resolve(parentValue, args) {
        return users.find((el) => el.id === args.id);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
