
// Function to create new expense item, append to dynamic parent
export default function addExpenseItem (label, cost, parent) {
    // Temporary expense div
    let tempDiv = document.createElement('div')
    tempDiv.setAttribute("class", "expense-item")
    // Temporary expense elements
    let tempLabel = document.createElement("p")
    tempLabel.setAttribute("class", "expense-label")

    let tempCost = document.createElement("p")
    tempCost.setAttribute("class", "expense-slice-cost")

    let tempButton = document.createElement("button")
    tempButton.setAttribute("class", "expense-remove-button")
    // Setting expense element values
    tempLabel.innerHTML = label
    tempCost.innerHTML = "$" + cost
    tempButton.innerHTML = "X"
    // Appending expense elemenents to expense container div
    tempDiv.appendChild(tempLabel)
    tempDiv.appendChild(tempCost)
    tempDiv.appendChild(tempButton)

    // Appending whole expense item to parent at top of node list
    parent.insertBefore(tempDiv, parent.firstChild)
}