// Function to add a budget
function addBudget() {
  const limit = document.getElementById("limit").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (limit && category) {
    const budget = {
      limit,
      category,
      description,
    };

    // Save the budget data to local storage
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    budgets.push(budget);
    localStorage.setItem("budgets", JSON.stringify(budgets));

    // Add the budget tablet to the list
    const budgetList = document.getElementById("budget-list");
    const budgetDiv = document.createElement("div");
    budgetDiv.className = "budget";

    // Display the budget content
    budgetDiv.innerHTML = `
                  <div style="color: #222b4a;"><strong>Category:</strong> ${category}</div>
                  <div style="color: #222b4a;"><strong>Spending Limit:</strong> ${limit}</div>
                  <div style="color: #222b4a;"><strong>Description:</strong> ${description}</div>
                  <div>
                      <i class="fa-regular fa-pen-to-square" onclick="editBudget(this)" style="color: #ad927a; cursor: pointer;"></i>
                      <i class="fa-solid fa-delete-left" onclick="deleteBudget(this)" style="color: #212c42; cursor: pointer;"></i>
                  </div>
              `;

    budgetList.appendChild(budgetDiv);

    // Clear the form fields
    document.getElementById("budget-form").reset();
  }
}

// Function to delete a budget
function deleteBudget(button) {
  const budgetDiv = button.closest(".budget");
  const budgetList = document.getElementById("budget-list");
  budgetList.removeChild(budgetDiv);

  // Remove the budget data from local storage
  const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
  const category = budgetDiv
    .querySelector("div:first-child")
    .textContent.split(": ")[1];
  const updatedBudgets = budgets.filter(
    (budget) => budget.category !== category
  );
  localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
}

// Function to edit a budget
function editBudget(button) {
  const budgetDiv = button.closest(".budget");
  const category = budgetDiv
    .querySelector("div:first-child")
    .textContent.split(": ")[1];
  const limit = budgetDiv
    .querySelector("div:nth-child(2)")
    .textContent.split(": ")[1];
  const description = budgetDiv
    .querySelector("div:last-child")
    .textContent.split(": ")[1];

  // Fill the form fields with the budget data
  document.getElementById("category").value = category;
  document.getElementById("limit").value = limit;
  document.getElementById("description").value = description;

  // Delete the budget tablet
  deleteBudget(button);
}

// Event listener for adding a budget
document.getElementById("add-budget").addEventListener("click", addBudget);

// Load and display existing budgets from local storage
const storedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];
const budgetList = document.getElementById("budget-list");

storedBudgets.forEach((budget) => {
  const budgetDiv = document.createElement("div");
  budgetDiv.className = "budget";

  budgetDiv.innerHTML = `
              <div style="color: #222b4a;"><strong>Category:</strong> ${budget.category}</div>
              <div style="color: #222b4a;"><strong>Spending Limit:</strong> ${budget.limit}</div>
              <div style="color: #222b4a;"><strong>Description:</strong> ${budget.description}</div>
              <div>
                  <i class="fa-regular fa-pen-to-square" onclick="editBudget(this)" style="color: #ad927a; cursor: pointer;"></i>
                  <i class="fa-solid fa-delete-left" onclick="deleteBudget(this)" style="color: #212c42; cursor: pointer;"></i>
              </div>
          `;

  budgetList.appendChild(budgetDiv);
});

// Function to get the spending limit from financewatch.html
function getSpendingLimit(category) {
  const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
  const budget = budgets.find((b) => b.category === category);
  return budget ? parseFloat(budget.limit) : null;
}
