require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;

app.use(express.json()); //This middleware is used to parse JSON bodies of incoming requests, making it easier to access data sent by clients in the request body. If not included, the server would not be able to read JSON data from requests, leading to issues when trying to create or update expenses.

let expenses = [
  { id: 1, date: "27-02-2026", amount: "$10", category: "Utility" },
  { id: 2, date: "27-02-2026", amount: "$5.65", category: "Food" },
  { id: 3, date: "02-03-2026", amount: "$500", category: "Gadget Purchase" },
];

//To list all expenses
app.get("/expenses/all", (req, res) => {
  res.status(200).json(expenses);
});

//To get specific expense by id
app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((e) => e.id === parseInt(req.params.id));
  if (!expense) return res.status(404).json({ error: "Expense not found." });
  res.status(200).json(expense);
});

//To get expenses by date
app.get("/expenses/date/:date", (req, res) => {
  const expensebyDate = expenses.filter((e) => e.date === req.params.date);
  if (!expensebyDate) return res.status(404).json({ error: "No expenses found for the given date." });
  res.status(200).json(expensebyDate);
});

//To add
app.post("/expenses", (req, res) => {
    const newExpense = { id: expenses.length + 1, ...req.body };
    expenses.push(newExpense);
    if (!newExpense.date || !newExpense.amount || !newExpense.category) {
        return res.status(400).json({error: "Missing required fields. Date, amount, and category are required."});
    };
    res.status(201).json(newExpense);
});

//To update
app.patch("/expenses/:id", (req, res) => {
  const expense = expenses.find((e) => e.id === parseInt(req.params.id));
  if (!expense) return res.status(404).json({ error: "Expense not found." });
  Object.assign(expense, req.body);
  res.status(200).json(expense);
});

//To delete
app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = expenses.length;
  expenses = expenses.filter((e) => e.id !== id);
  if (expenses.length === initialLength)
    return res.status(404).json({ error: "Expense not found." });
  res.status(204).send();
});

//Error handling for invalid routes
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error." });
});

app.listen(port, () => {
  console.log(`Group 3 Subgroup 1 Project app is running on port ${port}`);
});
