import {
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLType,
  GraphQLList,
  GraphQLNonNull,
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
        //NonNull must provide value or throw error
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      async resolve(parentValue, { firstName, age }) {
        const response = await axios.post("http://localhost:3000/users", {
          firstName,
          age,
        });
        return response.data;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValue, { id }) {
        const response = await axios.delete(
          `http://localhost:3000/users/${id}`
        );
        return response.data;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation,
});

// use w/GraphiQL f/ spreading query params
// fragment companyDetails on Company {
//     id
//     name
//     description
// }
