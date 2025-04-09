import { useState, useEffect } from "react";
import useStore from "../Store";

const ExpenseTracker = () => {
  const { expenses, addExpense, removeExpense } = useStore();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const formattedTime = `${
        monthNames[now.getMonth()]
      } ${now.getDate()}, ${now.getFullYear()}`;
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("expenses");
    if (storedData) {
      const formatted: typeof expenses = JSON.parse(storedData);
      formatted.forEach((expense: any) => {
        addExpense(expense);
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (description.trim() === "" || amount === "") return;

    const Expense = {
      id: Date.now(),
      displayId: currentTime,
      description,
      amount: +amount,
    };

    addExpense(Expense);

    setAmount("");
    setDescription("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg sm:m-10 m-2">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-700">
          Expense Tracker
        </h1>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Expense Description"
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Amount"
            className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
          />

          <button
            onClick={handleAddExpense}
            className="w-full px-4 py-2 bg-purple-600 rounded-lg text-white font-bold text-lg shadow-md hover:bg-purple-700 transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            Add Expense
          </button>
        </div>

        <ul className="space-y-4 mb-6">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex justify-between items-center bg-purple-100 p-4 rounded-lg shadow-sm transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <span className="text-gray-800 font-semibold">
                {expense.description} :{" "}
                <span className="text-purple-600">
                  $ {expense.amount.toFixed(2)}
                </span>
              </span>

              <button
                onClick={() => removeExpense(expense.id)}
                className="px-3 py-1 text-white bg-red-500 rounded-lg font-bold focus:outline-none cursor-pointer hover:bg-red-600 transition duration-200 shadow-md"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-purple-700">
            Total Expenses :{" "}
            <span className="text-purple-600">
              ${" "}
              {expenses
                .reduce((total, expense) => total + expense.amount, 0)
                .toFixed(2)}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
