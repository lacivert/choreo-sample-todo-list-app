"use client"; // This is a client component

import { ToDo } from "@/types/todo";
import { PairPrice } from "@/types/price";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { useEffect, useState } from "react";
import checkList from "@/public/checklist.png";
import addIcon from "@/public/addIcon.png";
import deleteIcon from "@/public/delete.png";

interface TodoItemProps {
  todo: ToDo;
  onDelete: (id: number) => void;
  handleToggleDone: (id: number) => void;
}

interface PriceItemProps {
  price: PairPrice;
}

const PriceItem = (props: PriceItemProps) => {
  const { price } = props;
  const { myOffer, bid0, ticker, toFixed } = price;

  return (
    <div className="flex justify-between rounded-full p-1 w-2/5">
      <table className="rounded-full">
        <thead>
          <tr>
            <th>Pair</th>
            <th>My Offer</th>
            <th>Bid</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>{ticker}</td>
            <td>{myOffer.toFixed(2)}</td>
            <td>{toFixed ? bid0.toFixed(2) : bid0}</td>
          </tr>
        </tbody>
      </table>
      <br />
      {/* <li
        key={pair}
        className="relative rounded-md py-3 px-5 flex items-center gap-x-3"
      >
        <h2
          className={
            myOffer
              ? "text-md font-medium leading-5 text-gray-700"
              : "text-md font-medium leading-5 text-gray-700"
          }
        >
          {pair}
        </h2>
        <br />
        <h2
          className={
            myOffer
              ? "text-md font-medium leading-5 text-gray-700"
              : "text-md font-medium leading-5 text-gray-700"
          }
        >
          {myOffer}
        </h2>
        <br />
        <h2
          className={
            myOffer
              ? "text-md font-medium leading-5 text-gray-700"
              : "text-md font-medium leading-5 text-gray-700"
          }
        >
          {bid0}
        </h2>
      </li> */}
    </div>
  );
}

const TodoItem = (props: TodoItemProps) => {
  const { todo, onDelete, handleToggleDone } = props;
  return (
    <div className="flex justify-between bg-white rounded-full p-1 w-2/5">
      <li
        key={todo.id}
        className="relative rounded-md py-3 px-5 flex items-center gap-x-3"
      >
        <input
          type="checkbox"
          checked={todo.done}
          className="size-6"
          onChange={() => handleToggleDone(todo.id!)}
        />
        <h2
          className={
            todo.done
              ? "text-md font-medium leading-5 text-gray-700 line-through"
              : "text-md font-medium leading-5 text-gray-700"
          }
        >
          {todo.task}
        </h2>
      </li>
      <button
        className="float-right bg-red-500 text-white rounded-full self-center text-xs p-2 mr-2"
        onClick={() => onDelete(todo.id!)}
      >
        <Image src={deleteIcon} alt="delete icon" />
      </button>
    </div>
  );
};

export default function Home() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [prices, setPrice] = useState<PairPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(5);

  // let time: number = 0; // Initialize 'time' variable with a default value

  let t1 = 5;
  useEffect(() => {
    setLoading(true);
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .finally(() => setLoading(false));


    setInterval(() => {
      t1 = t1-1
      setTime(t1)
    }, 1000);
  }, []);

  useEffect(() => {
    
    setInterval(() => {
      // setLoading(true);
      t1 = 5;
      setTime(t1)
      fetch("/api/price")
        .then((response) => response.json())
        .then((data) => setPrice(data))
        .catch((error) => console.error(error))
        // .finally(() => setLoading(false));
    }, 5000);

  }, []);

 

  const handleDeleteTodo = (id: number) => {
    fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  const handleToggleDone = (id: number) => {
    fetch("/api/todos", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then(() =>
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
          )
        )
      );
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-24 w-screen h-screen">

      {prices.map((price: PairPrice) => (
        <PriceItem key={price.ticker} price={price} />
      ))}


      <div className="flex gap-x-4  my-24 items-center">
        <Image src={checkList} alt="checklist icon" />
        <h1 className="text-5xl font-bold text-gray-700">ToDo List </h1>
      </div>

      

      {/* <div className="mb-32 mx-auto flex-col flex gap-y-2 justify-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          My Offer: {prices?.myOffer.toFixed(2)}
        </h2>
        <h2 className="text-2xl font-semibold text-gray-700">
          Bid: {prices?.bid0}
        </h2>

        <h2 className="text-2xl font-semibold text-gray-700">
          {time}
        </h2>
      </div> */}

      <div className="mb-32 mx-auto flex-col flex gap-y-2 w-full justify-center">
        {loading ? (
          <div className="flex justify-center gap-x-4">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <div className="text-lg font-semibold text-white">
              Fetching ToDos...
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-col flex gap-y-2 w-full justify-center items-center">
              {todos.map((todo: ToDo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  handleToggleDone={handleToggleDone}
                />
              ))}
            </ul>
            {todos.length == 0 && (
              <div className="text-center">No ToDos Found</div>
            )}
          </>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/create"
            className="inline-block bg-blue-900 border-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-700 mx-auto"
          >
            <div className="flex items-center gap-x-2">
              <Image src={addIcon} alt="checklist icon" />
              Create New
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
