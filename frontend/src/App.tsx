import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { TodoInput } from './components/todo/todo-input';
import { TodoList } from './components/todo/todo-list';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          <Card className="shadow-lg border-t-4 border-t-[#00598E]">
            <CardHeader className="pb-4 border-b mb-6">
              <CardTitle className="text-2xl font-bold text-gray-800">Task Management</CardTitle>
              <CardDescription>
                Manage your daily tasks efficiently via the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TodoInput />
              <TodoList />
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
