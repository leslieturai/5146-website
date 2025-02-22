// Importing function to create new expense items in HTML via JS
import addExpenseItem from "./expenseItem.js"

// Importing relevant firebase functions
import { getBudget, deleteSavedBudget, setBudget } from "../src/firebaseConfig.js"

// Reference for where the expenses will be appended
const budgetItemContainer = document.querySelector("#content-row-two")

// Budget input field
const budgetInput = document.querySelector("#budget-input")

// Budget display in expenses tab
const expenseBudget = document.querySelector("#expense-budget")

// Remainder display
const remainder = document.querySelector("#budget-remainder")

// Total expense display
const expenseTotal = document.querySelector("#expense-total-display")

// Elements to add expense
const newExpName = document.querySelector("#expense-name-field")
const newExpCost = document.querySelector("#expense-cost-field")
const addExpBtn = document.querySelector("#add-expense-btn")
const saveExpBtn = document.querySelector("#save-expense-btn")

const errorDisplay = document.querySelector("#error-display")

// Remove expense buttons
var removeExpBtn = []

var budget = [] // Local copy of budget data

// Function to clear all expenses in HTML, simply deleted, used to reset the list if necessary before rerendering
function clearExpenses () {
    document.querySelectorAll(".expense-item").forEach(element => element.remove())
}

// Functions to calculate remaining cash
function calculateRemainder (arr) {
    let tempSum = 0
    if (arr == null) {
        return
    }
    for (let i = 0; i < arr.length; i++) {
        tempSum = tempSum + arr[i].cost
    }
    return tempSum
}

function calculateTotalExpenses (arr) {
    let tempTotal = 0
    if (arr == null) {
        return
    }
    for (let i = 0; i < arr.length; i++) {
        tempTotal += Number(arr[i].cost)
    }
    expenseTotal.innerHTML = "Total Expenses: " + "$" + tempTotal
}

// Function to render expenses
function renderExpenses() {
    // Currently rendered expenses are removed
    document.querySelectorAll(".expense-item").forEach(element => element.remove())
    if (budget.userBudget.expenses == null) {
        console.log("No expenses to render")
        return
    }
    // Creating, appending, and rendering a new expense item for every element in the expenses array of the budget object
    for (let i = 0; i < budget.userBudget.expenses.length; i++) {
        addExpenseItem(budget.userBudget.expenses[i].label, budget.userBudget.expenses[i].cost, budgetItemContainer);
    }

    attachRemoveEventListeners(); // Reattach event listeners for remove buttons after rendering
    calculateTotalExpenses(budget.userBudget.expenses) // Calculating total expenses and displaying the amount
}

// Function to attach and handle event listeners for the remove remove 
function attachRemoveEventListeners() {
    removeExpBtn = document.querySelectorAll(".expense-remove-btn") // nodeList reference for all remove buttons
    // Attach an event listener on each button
    removeExpBtn.forEach((element, i) => {
        element.addEventListener("click", () => {
            // The nodeList and expenses array indices are backwards when compared, so the correct index of the task
            // which corresponds to its expense index needs to be calculated
            // The amount of buttons (length of nodeList converted to Array) - the index of the element in the spreaded nodeList - 1 (to offset zero-index)
            let tempIndex = ([...removeExpBtn].length - [...removeExpBtn].indexOf(element) - 1)
            /* 
                Ex: 3rd element in the nodeList out of 4 has its remove button clicked,
                4 - 2 - 1 = 1
                1 is that corresponding expense's index representation in the expenses array in budget, so it is spliced and the expenses rerendered below
            */

            budget.userBudget.expenses.splice(tempIndex, 1);
            renderExpenses() // Rerender the list after removing an item
            calculateTotalExpenses(budget.userBudget.expenses)
            remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.expenses))
        })
    })
}

// Function to quickly set displays to zero if there is no budget
function handleNoBudget () {
    expenseBudget.innerHTML = "Budget:" + " " + "$" + 0
    remainder.innerHTML = "Remainder: " + " " + "$" + 0
    expenseTotal.innerHTML = "Total Expenses: " + "$" + 0
}

// Async function to check if there is a budget
async function fetchBudget() {
    budget = await getBudget();
    if (!budget || budget.userBudget.expenses == null) {
        // Intializing displays to zero if not found
        handleNoBudget()
        budget = {
            "userBudget": {
                "setBudget": 0,
                "expenses": [ 
                    
                ]
            }
        }
    } else {
        renderExpenses() // Data is rendered
        // Budget, expenses, and remainder are calculated
        expenseBudget.innerHTML = "Budget:" + " " + "$" + budget.userBudget.setBudget
        remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.setBudget))
        calculateTotalExpenses(budget.userBudget.expenses)
    }
  
}
// Calling fetchBudget
fetchBudget()

// Functionality to add expenses
function addExpense (_id, _label, _cost) {
    if (newExpName.value && newExpCost.value) {
        // As long as the expense has content, a new object is simply pushed to expense array
        budget.userBudget.expenses.push(
            {
                id: _id,
                label: _label,
                cost: Number(_cost)
            }
        )
        
    } else {
        console.log("Error")
        return
    }
}


// Button Event Handlers below

// Event listener for handling budget input
budgetInput.addEventListener("input", (event) => {
    event.preventDefault()
    if (budget.userBudget.expenses == null || budget == null) {
        budget = {
            "userBudget": {
                "setBudget": 0,
                "expenses": [ 
        
                ]
            }
          }
        // Setting setBudget to user input directly
        budget.userBudget.setBudget = Number(budgetInput.value)
        // Displaying and updating budget and remainder as they type
        expenseBudget.innerHTML = "Budget: " + "$" + budget.userBudget.setBudget
        remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.expenses))
    } else if (budget) {
         // Setting setBudget to user input directly
         budget.userBudget.setBudget = Number(budgetInput.value)
         // Displaying and updating budget and remainder as they type
         expenseBudget.innerHTML = "Budget: " + "$" + budget.userBudget.setBudget
         remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.expenses))
    }

    // Displaying and updating budget and remainder as they type
    expenseBudget.innerHTML = "Budget: " + "$" + budget.userBudget.setBudget
    remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.expenses))
})

// Event listener for "Add" button to add an expense
addExpBtn.addEventListener("click", (event) => {
    event.preventDefault()
    // Error handling
    // Error messages are displayed via changing the class
    // of an element and modifying its displayed message
   if (newExpName.value == "") {
        errorDisplay.innerHTML = "Error: please enter an expense name"
        errorDisplay.setAttribute("class", "error")
        return
    } else if (newExpCost.value == "" || newExpCost.value < 0) {
        errorDisplay.innerHTML = "Error: please enter an expense cost"
        errorDisplay.setAttribute("class", "error")
        return
    }
    // Add the expense
    addExpense(budget.userBudget.expenses.length + 1, newExpName.value, newExpCost.value)
    console.log(budget)
    // Delete rendered expenses
    clearExpenses()
    // Rerender expenses
    for (let i = 0; i < budget.userBudget.expenses.length; i++) {
        addExpenseItem(budget.userBudget.expenses[i].label, budget.userBudget.expenses[i].cost, budgetItemContainer)
    }
    // Update event listeners of rerendered list for their remove buttons
    attachRemoveEventListeners()
    // Setting error display to a success message
    errorDisplay.innerHTML = "Expense added!"
    errorDisplay.setAttribute("class", "success")
    // Total expeneses recalculated
    calculateTotalExpenses(budget.userBudget.expenses)
    // Input fields cleared
    //budgetInput.value = ""
    newExpName.value = ""
    newExpCost.value = ""   
    // Calculating remainder upon update
    remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budget.userBudget.expenses))
    // Setting the error/success message to disappear after 5 seconds via another class change
    setTimeout(function () {
        errorDisplay.innerHTML = ""
        errorDisplay.setAttribute("class", "hidden")
    }, 5000)
})

// Event listener for the "Save" button for saving data to firebase
saveExpBtn.addEventListener("click", (event) => {
    event.preventDefault()
    deleteSavedBudget()
    // Saving the new budget object to firebase
    setBudget(budget)
    // Clearing rendered expenses
    clearExpenses()
    // Fetching the saved data from the database directly to refresh
    fetchBudget()
    // Resetting input fields
    budgetInput.value = ""
    newExpName.value = ""
    newExpCost.value = ""
})