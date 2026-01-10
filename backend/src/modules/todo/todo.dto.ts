import { ObjectType, Field, ID, InputType } from "type-graphql";

@ObjectType()
export class Todo {
    @Field(() => ID)
    id!: string;

    @Field()
    text!: string;

    @Field()
    isCompleted!: boolean;
}

@InputType()
export class AddTodoInput {
    @Field()
    text!: string;
}
