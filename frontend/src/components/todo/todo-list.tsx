import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      isCompleted
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export const TodoList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  if (loading) return <div className="p-4 text-center text-muted-foreground">Loading tasks...</div>;
  if (error) return <div className="p-4 text-center text-destructive">Error loading tasks!</div>;

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Task Description</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.todos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                No tasks found. Add a new task above.
              </TableCell>
            </TableRow>
          ) : (
            data.todos.map((todo: any) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">{todo.text}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo({ variables: { id: todo.id } })}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
