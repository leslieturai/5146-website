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


var budget;

// Get data from db
// Display loaded data
// Allow user to update loaded, local data
// Allow user to save/upload updated local data to db
    /* 
        Store updates in local copy
        Delete data in db
        Save updated data in db
    */
// loop


var budgetArray = []


function renderExpenses () {
    for (let i = 0; i < budgetArray.expenses.length; i++) {
        addExpenseItem(budgetArray.expenses[i].label, budgetArray.expenses[i].cost, budgetItemContainer)
    }
}

function clearExpenses () {
    const elements = document.getElementsByClassName(".expense-item")
    document.querySelectorAll(".expense-item").forEach(element => element.remove())
}

async function fetchBudget() {
    budget = await getBudget()
    budgetArray = budget.userBudget
    console.log(budgetArray)
}

fetchBudget().then((res) => {
    renderExpenses()
})

console.log("here again")




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







//remainder.innerHTML = "Remainder: " + Number(budget - calculateRemainder())



budgetInput.addEventListener("input", (event) => {
    event.preventDefault()
    budget = budgetInput.value
    expenseBudget.innerHTML = "Budget: " + "$" + budget
    //remainder.innerHTML = budget - calculateRemainder()

})

addExpBtn.addEventListener("click", (event) => {
    event.preventDefault()
    addExpense(budgetArray.expenses.length + 1, newExpName.value, newExpCost.value)
    clearExpenses()
    renderExpenses()
})

saveExpBtn.addEventListener("click", (event) => {
    event.preventDefault()
    deleteSavedBudget()
    setBudget(budget)
    //
    clearExpenses()
    fetchBudget().then((res) => {
        renderExpenses()
        
    })


})