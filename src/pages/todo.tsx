import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

const Todo: NextPage = () => {
  const [todoInput, setTodoInput] = useState<string>("");
  const { data: sessionData } = useSession();
  const { data: todos, refetch: refetchTodos } = api.todo.todoList.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  const createTodo = api.todo.addTodo.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  const handleAddTodo = () => {
    createTodo.mutate({
      name: todoInput,
    });
    setTodoInput("");
  };

  return (
    <div className="h-screen w-screen bg-gray-100 p-4">
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
        Back to home page
      </Link>
      <div className="mt-10 flex items-center justify-center font-medium">
        <div className="flex h-full flex-grow items-center justify-center  text-gray-600">
          <div className="w-96 max-w-full rounded-lg bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center">
              <svg
                className="h-8 w-8 stroke-current text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h4 className="ml-3 text-lg font-semibold">Todo List</h4>
            </div>
            {todos &&
              todos.length > 0 &&
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  name={todo.name}
                  id={todo.id}
                  complete={todo.complete}
                />
              ))}
            <div className="mt-4 flex items-center justify-between gap-2">
              <input
                className="ml-4 h-8 w-full flex-grow bg-transparent font-medium focus:outline-none"
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="add a new task"
              />
              <button
                onClick={handleAddTodo}
                disabled={!todoInput}
                type="button"
                className="mr-2 inline-flex items-center rounded-full bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="h-5 w-5 fill-current text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="sr-only">add button</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TodoItem: NextPage<{
  name: string;
  complete: boolean;
  id: string;
}> = ({ name, complete, id }) => {
  const [isDone, setIsDone] = useState<boolean>(complete);
  const [debouncedValue, setDebouncedValue] = useState<boolean>(complete);
  const { data: sessionData } = useSession();
  const { refetch: refetchTodos } = api.todo.todoList.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  const deleteTodo = api.todo.deleteTodo.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });
  const updateTodoStatus = api.todo.updateTodoStatus.useMutation({
    onSuccess: () => {
      void refetchTodos();
    },
  });

  const handelDeleteTodo = () => {
    deleteTodo.mutate({
      id: id,
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(isDone);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [isDone]);

  useEffect(() => {
    updateTodoStatus.mutate({
      id: id,
      complete: debouncedValue,
    });
  }, [debouncedValue]);

  return (
    <div className="flex items-center justify-between">
      <div onClick={() => setIsDone((prev) => !prev)}>
        <input
          className="hidden"
          type="checkbox"
          id={id}
          checked={isDone}
          onChange={() => setIsDone((prev) => !prev)}
        />
        <label
          className="flex h-10 cursor-pointer items-center rounded px-2 hover:bg-gray-100"
          htmlFor="task_5"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 text-transparent">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span className="ml-4 text-sm">{name}</span>
        </label>
      </div>
      <button
        onClick={handelDeleteTodo}
        type="button"
        className="font-small rounded-lg bg-transparent px-5 py-2.5 text-sm text-red-500  hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default Todo;
