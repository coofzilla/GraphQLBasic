import {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  GraphQLList,
} from "graphql";

import axios from "axios";

//circular reference
const CompanyType = new GraphQLObjectType({
  name: "Company",
  //closure not executed until entire file
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      //parentValue is current company
      async resolve(parentValue, args) {
        const response = await axios.get(
          `http://localhost:3000/companies/${parentValue.id}/users`
        );
        return response.data;
      },
    },
  }),
});

const UserType: GraphQLType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValue, args) {
        const response = await axios.get(
          `http://localhost:3000/companies/${parentValue.companyId}`
        );
        return response.data;
      },
    },
  }),
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
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      async resolve(parentValue, args) {
        const response = await axios.get(
          `http://localhost:3000/companies/${args.id}`
        );
        return response.data;
      },
    },
  },
});

//mutation used to change/modify/delete data
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve() {},
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});

// use w/GraphiQL f/ spreading query params
// fragment companyDetails on Company {
//     id
//     name
//     description
// }
