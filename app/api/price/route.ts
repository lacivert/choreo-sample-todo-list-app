import { ToDo } from "@/types/todo";
import axios from "axios";

let todos: ToDo[] = [
  {
    id: 1,
    task: "Buy Milk",
    done: true,
  },
  {
    id: 2,
    task: "Pay Utility Bills",
    done: false,
  },
  {
    id: 3,
    task: "Pick up Randy after Soccer",
    done: false,
  },
];

let price = 0;

export async function GET() {
  console.log("GET");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  const pairs = [{ticker:"BTCTRY"}, {ticker:"ETHTRY"}, {ticker:"TRXTRY", noToFixed: true}];

  const promises = pairs.map(async (pair) => {
    const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${pair.ticker}`, requestOptions)
      .catch((error) => console.error(error));

    const res2 = await res?.text();

    const result = res2 ? JSON.parse(res2) : undefined;

    const bid0 = result?.bids[0][0] * 1;
    const myOffer = bid0 ? bid0 * 0.95 : 0;

    return {
      ticker: pair.ticker,
      bid0,
      myOffer,
      toFixed: pair.noToFixed ? false : true
    };
  });

  const results = await Promise.all(promises);

  console.log("results", results);

  return Response.json(results, { status: 200 });

  // const res = await fetch("https://api.binance.com/api/v3/depth?symbol=BTCTRY", requestOptions)
  //   .catch((error) => console.error(error));

  // const res2 = await res?.text();

  //   const result = res2 ? JSON.parse(res2) : undefined;

  //   const bid0 = result?.bids[0][0];
  //   const myOffer = bid0 ? bid0 * 0.95 : 0;

  //   const a = {
  //     bid0,
  //     myOffer 
  //   }

  //   console.log("result", a);

  // return Response.json(a, { status: 200 });
}

export async function POST(req: Request) {
  const { id, task } = await req.json();
  const newTodo: ToDo = { id, task, done: false };
  todos.push(newTodo);
  return Response.json(newTodo, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  todos = todos.filter((todo) => todo.id !== id);
  return Response.json(
    { message: "Todo deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(req: Request) {
  const { id } = await req.json();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    todos[index].done = !todos[index].done;
    return Response.json(
      { message: "Todo updated successfully" },
      { status: 200 }
    );
  } else {
    return Response.json({ error: "Todo not found" }, { status: 404 });
  }
}
