import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./schema/schema";

const app = express();

//middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("LISTENING ON 4000");
});
