import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import path from "path";
import { TodoResolver } from "./modules/todo/todo.resolver";

async function bootstrap() {
    const schema = await buildSchema({
        resolvers: [TodoResolver],
        container: Container,
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    });

    const app = express();

    const server = new ApolloServer({
        schema,
    });

    await server.start();
    server.applyMiddleware({
        app: app as any,
        cors: {
            origin: "*",
            credentials: true
        }
    });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}

bootstrap().catch(console.error);
