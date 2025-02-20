import addExpenseItem from "./expenseItem.js"
import { getBudget, deleteSavedBudget, setBudget } from "../src/firebaseConfig.js"

const budgetItemContainer = document.querySelector("#content-row-two")

// Budget input field
const budgetInput = document.querySelector("#budget-input")

// Budget display in expenses tab
const expenseBudget = document.querySelector("#expense-budget")

// Remainder display
const remainder = document.querySelector("#budget-remainder")

// Elements to add expense
const newExpName = document.querySelector("#expense-name-field")
const newExpCost = document.querySelector("#expense-cost-field")
const addExpBtn = document.querySelector("#add-expense-btn")
const saveExpBtn = document.querySelector("#save-expense-btn")

const errorDisplay = document.querySelector("#error-display")

// Remove expense button
var removeExpBtn = []

var budget;

var budgetArray = []



/* function renderExpenses () {
    for (let i = 0; i < budgetArray.expenses.length; i++) {
        addExpenseItem(budgetArray.expenses[i].label, budgetArray.expenses[i].cost, budgetItemContainer)
    }
} */

function clearExpenses () {
    const elements = document.getElementsByClassName(".expense-item")
    document.querySelectorAll(".expense-item").forEach(element => element.remove())
}

// Function to calculate remaining cash
function calculateRemainder (arr) {
    let tempSum = 0
    for (let i = 0; i < arr.length; i++) {
        tempSum = tempSum + arr[i].cost
    }
    return tempSum
}

function renderExpenses() {
    document.querySelectorAll(".expense-item").forEach(element => element.remove())

    for (let i = 0; i < budgetArray.expenses.length; i++) {
        addExpenseItem(budgetArray.expenses[i].label, budgetArray.expenses[i].cost, budgetItemContainer);
    }

    attachRemoveEventListeners(); // Reattach event listeners after rendering
}

function attachRemoveEventListeners() {
    removeExpBtn = document.querySelectorAll(".expense-remove-btn");

    removeExpBtn.forEach((element, i) => {
        element.addEventListener("click", () => {
            let tempIndex = ([...removeExpBtn].length - [...removeExpBtn].indexOf(element) - 1)

            budgetArray.expenses.splice(tempIndex, 1);
            renderExpenses(); // Re-render the list after removing an item
        });
    });
}

async function fetchBudget() {
    budget = await getBudget();
    
    budgetArray = budget.userBudget;
    renderExpenses();

    expenseBudget.innerHTML = "Budget:" + " " + "$" + budget.userBudget.setBudget
    remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budgetArray.expenses))
}

fetchBudget();

// Functionality to add expenses
function addExpense (_id, _label, _cost, _budget) {
    if (newExpName.value && newExpCost) {
        console.log("valid expense")

        budgetArray.expenses.push(
            {
                id: _id,
                label: _label,
                cost: Number(_cost)
            }
        )

        console.log(budgetArray)

    } else {
        console.log("Error")
        return
    }

    
}




// budgetArray.map((record) => console.log(record.cost))

export function getExpenseLabels () {
    let tempLabels = []
    for (let i = 0; i < budgetArray.length; i++) {
        tempLabels.push(budgetArray[i].label)
    }
    return tempLabels
}

export function getCosts () {
    let tempCosts = []
    for (let i = 0; i < budgetArray.length; i++) {
        tempCosts.push(budgetArray[i].cost)
    }
    return tempCosts
}










budgetInput.addEventListener("input", (event) => {
    

    event.preventDefault()

    budget.userBudget.setBudget = Number(budgetInput.value)

    expenseBudget.innerHTML = "Budget: " + "$" + budget.userBudget.setBudget
    remainder.innerHTML = "Remainder: " + " " + "$" + String(budget.userBudget.setBudget - calculateRemainder(budgetArray.expenses))


})

addExpBtn.addEventListener("click", (event) => {
    event.preventDefault()

    // Expense error handling
    if (budgetInput.value == "" || budgetInput.value < 0) {
        errorDisplay.innerHTML = "Error: please enter a budget"
        errorDisplay.setAttribute("class", "error")
        return
    } else if (newExpName.value == "") {
        errorDisplay.innerHTML = "Error: please enter an expense name"
        errorDisplay.setAttribute("class", "error")
        return
    } else if (newExpCost.value == "" || newExpCost.value < 0) {
        errorDisplay.innerHTML = "Error: please enter an expense cost"
        errorDisplay.setAttribute("class", "error")
        return
    }



    addExpense(budgetArray.expenses.length + 1, newExpName.value, newExpCost.value)
    clearExpenses()
    for (let i = 0; i < budgetArray.expenses.length; i++) {
        addExpenseItem(budgetArray.expenses[i].label, budgetArray.expenses[i].cost, budgetItemContainer)
    }
    attachRemoveEventListeners()

    errorDisplay.innerHTML = "Expense added!"
    errorDisplay.setAttribute("class", "success")


    budgetInput.value = ""
    newExpName.value = ""
    newExpCost.value = ""

    setTimeout(function () {
        errorDisplay.innerHTML = ""
        errorDisplay.setAttribute("class", "hidden")
    }, 5000)
    
})

saveExpBtn.addEventListener("click", (event) => {



    event.preventDefault()
    //
    budgetInput.value = ""
    newExpName.value = ""
    newExpCost.value = ""

    //

    deleteSavedBudget()
    setBudget(budget)
    //
    clearExpenses()
    fetchBudget()


})