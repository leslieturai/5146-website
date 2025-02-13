import addExpenseItem from "./expenseItem.js"
import { getBudget } from "../src/firebaseConfig.js"

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
const addExpButton = document.querySelector("#add-expense-button")


var budget = 0
var expenses = 0

// Budget items array
/* var budgetArray = [
    {
        id: 0,
        label: "Groceries",
        cost: 350
    },
    {
        id: 1,
        label: "Train",
        cost: 5
    },
    {
        id: 2,
        label: "The Strokes Tickets",
        cost: 35
    },
]
 */

var budgetArray = []


function renderExpenses () {
    for (let i = 0; i < budgetArray.expenses.length; i++) {
        addExpenseItem(budgetArray.expenses[i].label, budgetArray.expenses[i].cost, budgetItemContainer)
    }
}

async function fetchBudget() {
    const budget = await getBudget()
    budgetArray = budget.userBudget
    //console.log(budgetArray)
    renderExpenses()
}

fetchBudget()

// Functionality to add expenses
function addExpense (_id, _label, _cost) {
    if (newExpName.value && newExpCost) {
        console.log("valid expense")

        budgetArray.expenses.push(
            {
                id: _id,
                label: _label,
                cost: _cost
            }
        )

        

        console.log(budgetArray)

    } else {
        console.log("Error")
        return
    }

    
}

// Function to calculate remaining cash
function calculateRemainder () {
    let tempSum = 0
    for (let i = 0; i < budgetArray.length; i++) {
        tempSum = tempSum + budgetArray[i].cost
    }
    return tempSum
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







remainder.innerHTML = "Remainder: " + Number(budget - calculateRemainder())



budgetInput.addEventListener("input", (event) => {
    budget = budgetInput.value
    expenseBudget.innerHTML = "Budget: " + "$" + budget
    remainder.innerHTML = budget - calculateRemainder()

})

addExpButton.addEventListener("click", (event) => {
    addExpense(budgetArray.expenses.length + 1, newExpName.value, newExpCost.value)
})
