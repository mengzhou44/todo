import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Service } from "typedi";
import { Todo, AddTodoInput } from "./todo.dto";
import { TodoService } from "./todo.service";

@Service()
@Resolver(Todo)
export class TodoResolver {
    constructor(private readonly todoService: TodoService) { }

    @Query(() => [Todo])
    async todos(): Promise<Todo[]> {
        return this.todoService.getTodos();
    }

    @Mutation(() => Todo)
    async addTodo(@Arg("input") input: AddTodoInput): Promise<Todo> {
        return this.todoService.addTodo(input);
    }

    @Mutation(() => Boolean)
    async deleteTodo(@Arg("id", () => ID) id: string): Promise<boolean> {
        return this.todoService.deleteTodo(id);
    }
}
