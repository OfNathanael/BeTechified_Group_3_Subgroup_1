require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.port;

let expenses = [
    {id: 1, date: "27/02/2026", amount: "$10", category: "Utility"},
    {id: 2, date: "27/02/2026", amount: "$5.65", category: "Food"}
];

//To list
app.get("/expenses/all", (req, res) => {
    res.status(200).json(expenses);
});
//To add
app.post("/expenses/:id", (req, res) => {
    const newExpenses = {id: expenses.length + 1, ...req.body};
    expenses.push(newExpenses);
    if (!newExpenses.)
})
//To update

//To delete


app.listen(port, () => {
    console.log(`Group 3 Subgroup 1 Project app is running on port ${port}`);
});