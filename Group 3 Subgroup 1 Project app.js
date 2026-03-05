require("dotenv").config(); //This line loads environment variables from a .env file into process.env, allowing you to use environment-specific configurations without hardcoding them in your code. In this case, it is used to access the port number for the server from an environment variable.


const express = require("express"); //
const app = express();
const port = process.env.port;


app.use(express.json()); //This middleware is used to parse JSON bodies of incoming requests, making it easier to access data sent by clients in the request body. If not included, the server would not be able to read JSON data from requests, leading to issues when trying to create or update expenses.


let expenses = [
  { id: 1, date: "27-02-2026", amount: "$10", category: "Utility" },
  { id: 2, date: "27-02-2026", amount: "$5.65", category: "Food" },
  { id: 3, date: "02-03-2026", amount: "$500", category: "Gadget Purchase" },
]; //In-memory data store for expenses, initialized with some sample data. Each expense has an id, date, amount, and category. This array serves as a simple database for the application, allowing us to perform CRUD operations on the expenses without needing a separate database setup.



//To list all expenses
app.get("/expenses/all", (req, res) => {
  res.status(200).json(expenses);
}); //This route handler listens for GET requests to the "/expenses/all" endpoint and responds with a JSON array of all expenses. It uses the res.status(200) method to set the HTTP status code to 200 (OK) and res.json(expenses) to send the expenses data as a JSON response. This allows clients to retrieve the complete list of expenses stored in the server.



//To get specific expense by id
app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((e) => e.id === parseInt(req.params.id));
  if (!expense) return res.status(404).json({ error: "Expense not found." });
  res.status(200).json(expense);
}); //This route handler listens for GET requests to the "/expenses/:id" endpoint, where ":id" is a placeholder for the expense ID. It uses the find method to search for an expense with the matching ID in the expenses array. If no expense is found, it responds with a 404 status code and an error message. If an expense is found, it responds with a 200 status code and the expense data in JSON format. This allows clients to retrieve specific expenses by their unique IDs.



//To get expenses by date
app.get("/expenses/date/:date", (req, res) => {
  const expensebyDate = expenses.filter((e) => e.date === req.params.date);
  if (!expensebyDate || expensebyDate.length === 0) return res.status(404).json({ error: "No expenses found for the given date." });
  res.status(200).json(expensebyDate);
}); //This route handler listens for GET requests to the "/expenses/date/:date" endpoint, where ":date" is a placeholder for the date of the expenses. It uses the filter method to create an array of expenses that match the specified date. If no expenses are found for that date, it responds with a 404 status code and an error message. If expenses are found, it responds with a 200 status code and the array of expenses in JSON format. This allows clients to retrieve all expenses that occurred on a specific date.



//To add
app.post("/expenses", (req, res) => {
  const { date, amount, category } = req.body; //This line uses destructuring assignment to extract the date, amount, and category properties from the request body (req.body). This allows us to easily access these values when creating a new expense. The client is expected to send a JSON object with these fields when making a POST request to create a new expense.
  
  if (!date || !amount || !category)
    return res.status(400).json({ error: "All fields required." }); //This validation checks if any of the required fields (date, amount, category) are missing from the request body. If any of these fields are not provided, it responds with a 400 status code and an error message indicating that all fields are required. This ensures that the server receives all necessary information to create a new expense before proceeding.
 
  if (isNaN(parseFloat(amount.replace("$",""))))
    return res.status(400).json({ error: "Amount must be a number." }); //This validation checks if the amount field is a valid number after removing any dollar signs. It uses parseFloat to attempt to convert the amount string to a number, and isNaN to check if the result is not a number. If the amount is invalid, it responds with a 400 status code and an error message. This ensures that the amount field contains a valid numeric value before creating a new expense.
  
  const newExpense = { id: expenses.length + 1, date, amount, category };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
}); //This route handler listens for POST requests to the "/expenses" endpoint. It first extracts the date, amount, and category from the request body. It then performs validation to ensure that all required fields are present and that the amount is a valid number. If any validation fails, it responds with a 400 status code and an appropriate error message. If validation passes, it creates a new expense object with a unique ID (based on the current length of the expenses array), adds it to the expenses array, and responds with a 201 status code (Created) along with the newly created expense in JSON format. This allows clients to add new expenses to the server's data store.



//To update
app.patch("/expenses/:id", (req, res) => {
  const expense = expenses.find((e) => e.id === parseInt(req.params.id));
  if (!expense) return res.status(404).json({ error: "Expense not found." });
  Object.assign(expense, req.body);
  res.status(200).json(expense);
}); //This route handler listens for PATCH requests to the "/expenses/:id" endpoint, where ":id" is a placeholder for the expense ID. It first searches for the expense with the specified ID in the expenses array. If the expense is not found, it responds with a 404 status code and an error message. If the expense is found, it uses Object.assign to update the expense object with any fields provided in the request body (req.body). Finally, it responds with a 200 status code and the updated expense in JSON format. This allows clients to update specific fields of an existing expense by its ID.



//To delete
app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = expenses.length;
  expenses = expenses.filter((e) => e.id !== id);
  if (expenses.length === initialLength)
    return res.status(404).json({ error: "Expense not found." });
  res.status(204).send("Expense deleted.");
}); //This route handler listens for DELETE requests to the "/expenses/:id" endpoint, where ":id" is a placeholder for the expense ID. It first parses the ID from the request parameters and stores the initial length of the expenses array. It then filters the expenses array to remove the expense with the specified ID. If the length of the expenses array remains unchanged after filtering, it means that no expense with that ID was found, and it responds with a 404 status code and an error message. If an expense was successfully deleted, it responds with a 204 status code (No Content) and a message indicating that the expense was deleted. This allows clients to delete specific expenses by their unique IDs.



//Error handling for invalid routes
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Server error." });
});



app.listen(port, () => {
  console.log(`Group 3 Subgroup 1 Project app is running on port ${port}`);
});
