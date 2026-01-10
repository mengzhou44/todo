import fs from "fs-extra";
import path from "path";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { Todo, AddTodoInput } from "./todo.dto";

const DATA_FILE = path.join(process.cwd(), "data", "todos.json");

@Service()
export class TodoService {
    private async readData(): Promise<Todo[]> {
        try {
            if (!fs.existsSync(DATA_FILE)) {
                await fs.writeJson(DATA_FILE, []);
                return [];
            }
            return await fs.readJson(DATA_FILE);
        } catch (error) {
            console.error("Error reading todos:", error);
            return [];
        }
    }

    private async writeData(todos: Todo[]): Promise<void> {
        await fs.writeJson(DATA_FILE, todos, { spaces: 2 });
    }

    async getTodos(): Promise<Todo[]> {
        return this.readData();
    }

    async addTodo(input: AddTodoInput): Promise<Todo> {
        const todos = await this.readData();
        const newTodo: Todo = {
            id: uuidv4(),
            text: input.text,
            isCompleted: false,
        };
        todos.push(newTodo);
        await this.writeData(todos);
        return newTodo;
    }

    async deleteTodo(id: string): Promise<boolean> {
        const todos = await this.readData();
        const filtered = todos.filter((t) => t.id !== id);
        if (filtered.length === todos.length) return false;
        await this.writeData(filtered);
        return true;
    }
}
