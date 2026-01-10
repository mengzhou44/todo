import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ADD_TODO = gql`
  mutation AddTodo($input: AddTodoInput!) {
    addTodo(input: $input) {
      id
      text
      isCompleted
    }
  }
`;

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      isCompleted
    }
  }
`;

export const TodoInput: React.FC = () => {
  const [text, setText] = useState('');
  const [addTodo, { loading }] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addTodo({ variables: { input: { text } } });
      setText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe the task..."
        className="flex-1 bg-white"
      />
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#00598E] hover:bg-[#004a75] text-white min-w-[120px]"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </form>
  );
};
