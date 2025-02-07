
// Budget input field
const budgetInput = document.querySelector("#budget-input")
// Budget text label
const budgetText = document.querySelector("#budget-text")

// Variable for initial budget
var userBudget = 0


// function to set budget
function setBudget (newBudget) {
    userBudget = Number(newBudget)
    budgetText.innerHTML = "Your budget is:" + "$" + userBudget
}

// Initialize to 0
window.onload = (event) => {
    setBudget(0)
}

budgetInput.addEventListener("input", (event) => {
    setBudget(budgetInput.value)
})

