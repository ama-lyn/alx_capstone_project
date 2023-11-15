// Define a variable to track the currently edited row
let editRow = null;

// Define three variables to store the total income, total expenses and available balance
let totalIncome = 0;
let totalExpenses = 0;
let availableBalance = 0;

// Key for the budgets
const budgetKey = "budgets";

// Function to toggle between Expense and Income
function toggle() {
  const entryType = document.querySelector(
    'input[name="entryType"]:checked'
  ).value;
  const addButton = document.getElementById("addButton");
  if (entryType === "expense") {
    addButton.textContent = "Add Expense";
    addButton.style.backgroundColor = "#9caad6";
  } else if (entryType === "income") {
    addButton.textContent = "Add Income";
    addButton.style.backgroundColor = "#ac927b";
  }
}

// Function to add a new Expense/Income entry
function addEntry() {
  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value;
  // Get the value of the selected radio button for the entry type
  const type = document.querySelector('input[name="entryType"]:checked').value;

  if (editRow) {
    // Update the currently edited row
    editRow.querySelector(".col-1").textContent = date;
    editRow.querySelector(".col-2").textContent = category;
    editRow.querySelector(".col-3").textContent = description;
    editRow.querySelector(".col-4").textContent = amount.toFixed(2);
    editRow.querySelector(".col-5").textContent = type;

    // Reset the editRow variable and form
    editRow = null;
    document.getElementById("form").reset();
  } else {
    const table = document.getElementById("expenseTable");
    const newRow = document.createElement("li");
    newRow.className = "table-row";

    // Populate the row with data
    newRow.innerHTML = `
    <div class="col col-1">${date}</div>
    <div class="col col-2">${category}</div>
    <div class="col col-3">${description}</div>
    <div class="col col-4">${amount.toFixed(2)}</div>
    <div class="col col-5">${type
      .replace("income", "Income")
      .replace("expense", "Expense")}</div>
    <div class="col col-6">
       <i class="fa-regular fa-pen-to-square" onclick="editExpense(this)" style="color: #212c42; cursor:pointer;"></i>   
       <i class="fa-solid fa-delete-left"  onclick="deleteExpense(this)" style="color: #ad927a; cursor:pointer;"></i>
    </div>
  `;

    // Add the row to the table
    table.appendChild(newRow);
  }

  // Update the values of the total income, total expenses and available balance
  if (type === "income") {
    totalIncome += amount;
  } else if (type === "expense") {
    totalExpenses += amount;
  }
  availableBalance = totalIncome - totalExpenses;

  // Check if the user has exceeded the spending limit and display a popup message if necessary
  const limit = getSpendingLimit(category); // Call getSpendingLimit to retrieve the limit
  if (limit !== null && type === "expense" && amount > limit) {
    alert(
      `You have exceeded the spending limit for the category "${category}"`
    );
  }

  // Display the values of the total income, total expenses and available balance
  document.getElementById("total-income").textContent =
    "Total Income: " + totalIncome.toFixed(2);
  document.getElementById("total-expenses").textContent =
    "Total Expenses: " + totalExpenses.toFixed(2);
  document.getElementById("available-balance").textContent =
    "Available Balance: " + availableBalance.toFixed(2);

  // Reset the form fields
  document.getElementById("form").reset();

  // Save the data to localStorage
  saveData();
}

// Function to delete an Expense/Income entry
function deleteExpense(i) {
  const row = i.parentNode.parentNode;
  const type = row.querySelector(".col-5").textContent;
  const amount = parseFloat(row.querySelector(".col-4").textContent);

  // Update the totals based on the deleted entry
  if (type === "Income") {
    totalIncome -= amount;
  } else if (type === "Expense") {
    totalExpenses -= amount;
  }
  availableBalance = totalIncome - totalExpenses;

  // Update the displayed totals
  document.getElementById("total-income").textContent =
    "Total Income: " + totalIncome.toFixed(2);
  document.getElementById("total-expenses").textContent =
    "Total Expenses: " + totalExpenses.toFixed(2);
  document.getElementById("available-balance").textContent =
    "Available Balance: " + availableBalance.toFixed(2);

  row.parentNode.removeChild(row);

  // Save the data to localStorage
  saveData();
}

// Function to edit an Expense/Income entry
function editExpense(i) {
  // Set the editRow variable to the row being edited
  editRow = i.parentNode.parentNode;
  const type = editRow.querySelector(".col-5").textContent;
  const amount = parseFloat(editRow.querySelector(".col-4").textContent);

  // Update the totals based on the original entry's value
  if (type === "Income") {
    totalIncome -= amount;
  } else if (type === "Expense") {
    totalExpenses -= amount;
  }

  // Populate the form fields with the data from the selected row
  document.getElementById("date").value =
    editRow.querySelector(".col-1").textContent;
  document.getElementById("category").value =
    editRow.querySelector(".col-2").textContent;
  document.getElementById("amount").value = amount.toFixed(2);
  document.getElementById("description").value =
    editRow.querySelector(".col-3").textContent;

  // Select the corresponding radio button for the entry type
  document.querySelector(`input[value="${type.toLowerCase()}"]`).checked = true;
}

// Function to get Spending limit from (Finance Watch page)
function getSpendingLimit(category) {
  const budgets = JSON.parse(localStorage.getItem(budgetKey)) || [];
  const budget = budgets.find((b) => b.category === category);
  return budget ? parseFloat(budget.limit) : null;
}

// Function to save data to localStorage
function saveData() {
  try {
    // Get all the table rows except the header
    const rows = document.querySelectorAll(".table-row");
    // Create an empty array to store the data
    const data = [];
    // Loop through each row and get the values of each column
    rows.forEach((row) => {
      const date = row.querySelector(".col-1").textContent;
      const category = row.querySelector(".col-2").textContent;
      const description = row.querySelector(".col-3").textContent;
      const amount = parseFloat(row.querySelector(".col-4").textContent);
      const type = row.querySelector(".col-5").textContent;
      // Create an object with the values and push it to the array
      const entry = { date, category, description, amount, type };
      data.push(entry);
    });
    // Convert the array into a string and store it in localStorage
    localStorage.setItem("entries", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
}

// Function to load data from localStorage
function loadData() {
  try {
    // Get the data from localStorage and parse it into an array
    const data = JSON.parse(localStorage.getItem("entries"));
    // Check if the data is not null or empty
    if (data && data.length > 0) {
      data.forEach((entry) => {
        const table = document.getElementById("expenseTable");
        const newRow = document.createElement("li");
        newRow.className = "table-row";
        newRow.innerHTML = `
        <div class="col col-1">${entry.date}</div>
        <div class="col col-2">${entry.category}</div>
        <div class="col col-3">${entry.description}</div>
        <div class="col col-4">${entry.amount.toFixed(2)}</div>
        <div class="col col-5">${entry.type}</div>
        <div class="col col-6">
          <i class="fa-regular fa-pen-to-square" onclick="editExpense(this)" style="color: #212c44; cursor:pointer;"></i>   
          <i class="fa-solid fa-delete-left" onclick="deleteExpense(this)" style="color: #ac927b; cursor:pointer;"></i>
        </div>
      `;

        table.appendChild(newRow);
        if (entry.type === "Income") {
          totalIncome += entry.amount;
        } else if (entry.type === "Expense") {
          totalExpenses += entry.amount;
        }
      });

      availableBalance = totalIncome - totalExpenses;

      document.getElementById("total-income").textContent =
        "Total Income: " + totalIncome.toFixed(2);
      document.getElementById("total-expenses").textContent =
        "Total Expenses: " + totalExpenses.toFixed(2);
      document.getElementById("available-balance").textContent =
        "Available Balance: " + availableBalance.toFixed(2);
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
}

// Call the load function when the page loads
window.onload = loadData;
