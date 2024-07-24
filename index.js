
var d = window.localStorage.getItem("sal");
var dd = JSON.parse(d);
var total = 0;
var balance = dd.key; // Initialize balance with income value
var max = 0;
var currentEditRow, currentEditCategoryCell, currentEditAmountCell, currentEditTotalCell;

// Object to store total expenses per category
var categoryTotals = {};

// Initialize pie chart
var expenseChart = null;

// Function to update the pie chart
function updateChart() {
  var labels = [];
  var data = [];
  var colors = [];

  // Populate data with current categories and totals
  for (var category in categoryTotals) {
    labels.push(category);
    data.push(categoryTotals[category]);
    colors.push(getRandomColor());
  }

  // Add remaining balance to chart
  data.push(balance);
  labels.push("Remaining Balance");
  colors.push("#32CD32");

  var ctx = document.getElementById('expenseChart').getContext('2d');

  if (expenseChart) {
    expenseChart.destroy(); // Destroy existing chart to prevent duplicates
  }

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true
    }
  });
}

// Function to generate random color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Event listener for the expense form submission
document.getElementById("expenseForm").addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();

  var category = e.target.category.value;
  var expenses = parseFloat(e.target.amount.value);

  if (isNaN(expenses) || expenses <= 0) {
    alert("Enter a valid Amount");
    return;
  }

  // Create new table row for the expense
  var trr = document.createElement("tr");
  document.querySelector(".table table tbody").appendChild(trr); // Appending to tbody to avoid header row

  var categoryTd = document.createElement("td");
  categoryTd.innerText = category;
  trr.appendChild(categoryTd);

  var amountTd = document.createElement("td");
  amountTd.innerText = expenses;
  trr.appendChild(amountTd);

  total += expenses;
  var totalCell = document.createElement("td");
  totalCell.innerText = total;
  trr.appendChild(totalCell);

  balance = dd.key - total;
  document.getElementById("balancee").innerText = balance;

  var actionCell = document.createElement("td");
  actionCell.classList.add("action-buttons"); // Add a class to style action buttons

  // Create delete button
  var deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("btn", "btn-danger", "mr-2"); // Add Bootstrap classes and margin-right
  deleteBtn.addEventListener("click", () => {
    balance += expenses;
    total -= expenses;

    document.getElementById("balancee").innerText = balance;
    trr.remove();

    // Remove from categoryTotals
    if (categoryTotals[category]) {
      delete categoryTotals[category];
    }

    updateMaxExpense();
    updateChart();
  });
  actionCell.appendChild(deleteBtn);

  // Create edit button
  var editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "btn-success");
  editBtn.setAttribute("data-toggle", "modal");
  editBtn.setAttribute("data-target", "#editModal");
  editBtn.addEventListener("click", () => {
    currentEditRow = trr;
    currentEditCategoryCell = categoryTd;
    currentEditAmountCell = amountTd;
    currentEditTotalCell = totalCell;
    document.getElementById("editCategory").value = category;
    document.getElementById("editAmount").value = expenses;
  });
  actionCell.appendChild(editBtn);

  trr.appendChild(actionCell);

  // Update categoryTotals
  if (categoryTotals[category]) {
    categoryTotals[category] += expenses;
  } else {
    categoryTotals[category] = expenses;
  }

  updateMaxExpense();
  updateChart();

  // Clear form inputs after submission
  e.target.reset();
}

// Function to update the max expense and balance
function updateMaxExpense() {
  var rows = document.querySelectorAll(".table table tbody tr");
  max = 0;
  rows.forEach((row, index) => {
    if (index > 0) { // Skip the header row
      var expense = parseFloat(row.cells[1].innerText);
      if (expense > max) {
        max = expense;
      }
    }
  });
  // Update any UI elements if needed
}

// Event listener for saving changes in edit modal
document.getElementById("saveChanges").addEventListener("click", () => {
  var newCategory = document.getElementById("editCategory").value;
  var newAmount = parseFloat(document.getElementById("editAmount").value);

  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Enter a valid Amount");
    return;
  }

  var oldAmount = parseFloat(currentEditAmountCell.innerText);
  var oldCategory = currentEditCategoryCell.innerText;

  balance = balance + oldAmount - newAmount;
  total = total - oldAmount + newAmount;

  if (oldCategory === newCategory) {
    categoryTotals[oldCategory] = categoryTotals[oldCategory] - oldAmount + newAmount;
  } else {
    categoryTotals[oldCategory] -= oldAmount;
    if (categoryTotals[newCategory]) {
      categoryTotals[newCategory] += newAmount;
    } else {
      categoryTotals[newCategory] = newAmount;
    }
  }

  currentEditCategoryCell.innerText = newCategory;
  currentEditAmountCell.innerText = newAmount;
  currentEditTotalCell.innerText = total;

  document.getElementById("balancee").innerText = balance;

  updateMaxExpense();
  updateChart();

  $('#editModal').modal('hide'); // Hide the modal after saving changes
});

// Set the income value in the table
document.getElementsByClassName("income")[0].innerText = dd.key;

// Initial call to updateChart to display the pie chart with initial data
updateChart();
































































































































































// var d = window.localStorage.getItem("sal");
// var dd = JSON.parse(d);
// var total = 0;
// var balance = dd.key; // Initialize balance with income value
// var max = 0;
// var currentEditRow, currentEditCategoryCell, currentEditAmountCell, currentEditTotalCell;

// // Object to store total expenses per category
// var categoryTotals = {};

// // Initialize pie chart
// var expenseChart = null;

// // Function to update the pie chart
// function updateChart() {
//   var labels = [];
//   var data = [];
//   var colors = [];

//   // Populate data with current categories and totals
//   for (var category in categoryTotals) {
//     labels.push(category);
//     data.push(categoryTotals[category]);
//     colors.push(getRandomColor());
//   }

//   // Add remaining balance to chart
//   data.push(balance);
//   labels.push("Remaining Balance");
//   colors.push(getRandomColor());

//   var ctx = document.getElementById('expenseChart').getContext('2d');

//   if (expenseChart) {
//     expenseChart.destroy(); // Destroy existing chart to prevent duplicates
//   }

//   expenseChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: colors
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });
// }

// // Function to generate random color
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// // Event listener for the expense form submission
// document.getElementById("expenseForm").addEventListener("submit", handleSubmit);

// function handleSubmit(e) {
//   e.preventDefault();

//   var category = e.target.category.value;
//   var expenses = parseFloat(e.target.amount.value);

//   if (isNaN(expenses) || expenses <= 0) {
//     alert("Enter a valid Amount");
//     return;
//   }

//   // Create new table row for the expense
//   var trr = document.createElement("tr");
//   document.querySelector(".table table tbody").appendChild(trr); // Appending to tbody to avoid header row

//   var categoryTd = document.createElement("td");
//   categoryTd.innerText = category;
//   trr.appendChild(categoryTd);

//   var amountTd = document.createElement("td");
//   amountTd.innerText = expenses;
//   trr.appendChild(amountTd);

//   total += expenses;
//   var totalCell = document.createElement("td");
//   totalCell.innerText = total;
//   trr.appendChild(totalCell);

//   balance = dd.key - total;
//   document.getElementById("balancee").innerText = balance;

//   var actionCell = document.createElement("td");

//   // Create delete button
//   var deleteBtn = document.createElement("button");
//   deleteBtn.innerText = "Delete";
//   deleteBtn.addEventListener("click", () => {
//     balance += expenses;
//     total -= expenses;

//     document.getElementById("balancee").innerText = balance;
//     trr.remove();

//     // Remove from categoryTotals
//     if (categoryTotals[category]) {
//       delete categoryTotals[category];
//     }

//     updateMaxExpense();
//     updateChart();
//   });
//   actionCell.appendChild(deleteBtn);

//   // Create edit button
//   var editBtn = document.createElement("button");
//   editBtn.innerText = "Edit";
//   editBtn.setAttribute("data-toggle", "modal");
//   editBtn.setAttribute("data-target", "#editModal");
//   editBtn.addEventListener("click", () => {
//     currentEditRow = trr;
//     currentEditCategoryCell = categoryTd;
//     currentEditAmountCell = amountTd;
//     currentEditTotalCell = totalCell;
//     document.getElementById("editCategory").value = category;
//     document.getElementById("editAmount").value = expenses;
//   });
//   actionCell.appendChild(editBtn);

//   trr.appendChild(actionCell);

//   // Update categoryTotals
//   if (categoryTotals[category]) {
//     categoryTotals[category] += expenses;
//   } else {
//     categoryTotals[category] = expenses;
//   }

//   updateMaxExpense();
//   updateChart();

//   // Clear form inputs after submission
//   e.target.reset();
// }

// // Function to update the max expense and balance
// function updateMaxExpense() {
//   var rows = document.querySelectorAll(".table table tbody tr");
//   max = 0;
//   rows.forEach((row, index) => {
//     if (index > 0) { // Skip the header row
//       var expense = parseFloat(row.cells[1].innerText);
//       if (expense > max) {
//         max = expense;
//       }
//     }
//   });
//   // Update any UI elements if needed
// }

// // Event listener for saving changes in edit modal
// document.getElementById("saveChanges").addEventListener("click", () => {
//   var newCategory = document.getElementById("editCategory").value;
//   var newAmount = parseFloat(document.getElementById("editAmount").value);

//   if (isNaN(newAmount) || newAmount <= 0) {
//     alert("Enter a valid Amount");
//     return;
//   }

//   var oldAmount = parseFloat(currentEditAmountCell.innerText);
//   var oldCategory = currentEditCategoryCell.innerText;

//   balance = balance + oldAmount - newAmount;
//   total = total - oldAmount + newAmount;

//   if (oldCategory === newCategory) {
//     categoryTotals[oldCategory] = categoryTotals[oldCategory] - oldAmount + newAmount;
//   } else {
//     categoryTotals[oldCategory] -= oldAmount;
//     if (categoryTotals[newCategory]) {
//       categoryTotals[newCategory] += newAmount;
//     } else {
//       categoryTotals[newCategory] = newAmount;
//     }
//   }

//   currentEditCategoryCell.innerText = newCategory;
//   currentEditAmountCell.innerText = newAmount;
//   currentEditTotalCell.innerText = total;

//   document.getElementById("balancee").innerText = balance;

//   updateMaxExpense();
//   updateChart();

//   $('#editModal').modal('hide'); // Hide the modal after saving changes
// });

// // Set the income value in the table
// document.getElementsByClassName("income")[0].innerText = dd.key;

// // Initial call to updateChart to display the pie chart with initial data
// updateChart();













































































































































// var dd = JSON.parse(window.localStorage.getItem("sal"));
// var total = 0;
// var balance = dd.key; // Initialize balance with income value
// var max = 0;
// var currentEditRow, currentEditCategoryCell, currentEditAmountCell, currentEditTotalCell;

// // Object to store total expenses per category
// var categoryTotals = {};

// // Initialize pie chart
// var expenseChart = null;

// // Function to update the pie chart
// function updateChart() {
//   var labels = [];
//   var data = [];
//   var colors = [];

//   // Populate data with current categories and totals
//   for (var category in categoryTotals) {
//     labels.push(category);
//     data.push(categoryTotals[category]);
//     colors.push(getRandomColor());
//   }

//   // Add remaining balance to chart
//   data.push(balance);
//   labels.push("Remaining Balance");
//   colors.push(getRandomColor());

//   var ctx = document.getElementById('expenseChart').getContext('2d');

//   if (expenseChart) {
//     expenseChart.destroy(); // Destroy existing chart to prevent duplicates
//   }

//   expenseChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: colors
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });
// }

// // Function to generate random color
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// // Event listener for the expense form submission
// document.getElementById("expenseForm").addEventListener("submit", handleSubmit);

// function handleSubmit(e) {
//   e.preventDefault();

//   var category = e.target.category.value;
//   var expenses = parseFloat(e.target.amount.value);

//   if (isNaN(expenses) || expenses <= 0) {
//     alert("Enter a valid Amount");
//     return;
//   }

//   // Create new table row for the expense
//   var trr = document.createElement("tr");
//   document.querySelector(".table table tbody").appendChild(trr); // Appending to tbody to avoid header row

//   var categoryTd = document.createElement("td");
//   categoryTd.innerText = category;
//   trr.appendChild(categoryTd);

//   var amountTd = document.createElement("td");
//   amountTd.innerText = expenses;
//   trr.appendChild(amountTd);

//   total += expenses;
//   var totalCell = document.createElement("td");
//   totalCell.innerText = total;
//   trr.appendChild(totalCell);

//   balance = dd.key - total;
//   document.getElementById("balancee").innerText = balance;

//   var actionCell = document.createElement("td");

//   // Create delete button
//   var deleteBtn = document.createElement("button");
//   deleteBtn.innerText = "Delete";
//   deleteBtn.addEventListener("click", () => {
//     balance += expenses;
//     total -= expenses;

//     document.getElementById("balancee").innerText = balance;
//     trr.remove();

//     // Remove from categoryTotals
//     if (categoryTotals[category]) {
//       delete categoryTotals[category];
//     }

//     updateMaxExpense();
//     updateChart();
//   });
//   actionCell.appendChild(deleteBtn);

//   // Create edit button
//   var editBtn = document.createElement("button");
//   editBtn.innerText = "Edit";
//   editBtn.setAttribute("data-toggle", "modal");
//   editBtn.setAttribute("data-target", "#editModal");
//   editBtn.addEventListener("click", () => {
//     currentEditRow = trr;
//     currentEditCategoryCell = categoryTd;
//     currentEditAmountCell = amountTd;
//     currentEditTotalCell = totalCell;
//     document.getElementById("editCategory").value = category;
//     document.getElementById("editAmount").value = expenses;
//   });
//   actionCell.appendChild(editBtn);

//   trr.appendChild(actionCell);

//   // Update categoryTotals
//   if (categoryTotals[category]) {
//     categoryTotals[category] += expenses;
//   } else {
//     categoryTotals[category] = expenses;
//   }

//   updateMaxExpense();
//   updateChart();

//   // Clear form inputs after submission
//   e.target.reset();
// }

// // Function to update the max expense and balance
// function updateMaxExpense() {
//   var rows = document.querySelectorAll(".table table tbody tr");
//   max = 0;
//   rows.forEach((row, index) => {
//     if (index > 0) { // Skip the header row
//       var expense = parseFloat(row.cells[1].innerText);
//       if (expense > max) {
//         max = expense;
//       }
//     }
//   });
//   // Update any UI elements if needed
// }

// // Event listener for saving changes in edit modal
// document.getElementById("saveChanges").addEventListener("click", () => {
//   var newCategory = document.getElementById("editCategory").value;
//   var newAmount = parseFloat(document.getElementById("editAmount").value);

//   if (isNaN(newAmount) || newAmount <= 0) {
//     alert("Enter a valid Amount");
//     return;
//   }

//   var oldAmount = parseFloat(currentEditAmountCell.innerText);
//   var oldCategory = currentEditCategoryCell.innerText;

//   balance = balance + oldAmount - newAmount;
//   total = total - oldAmount + newAmount;

//   if (oldCategory === newCategory) {
//     categoryTotals[oldCategory] = categoryTotals[oldCategory] - oldAmount + newAmount;
//   } else {
//     categoryTotals[oldCategory] -= oldAmount;
//     if (categoryTotals[newCategory]) {
//       categoryTotals[newCategory] += newAmount;
//     } else {
//       categoryTotals[newCategory] = newAmount;
//     }
//   }

//   currentEditCategoryCell.innerText = newCategory;
//   currentEditAmountCell.innerText = newAmount;
//   currentEditTotalCell.innerText = total;

//   document.getElementById("balancee").innerText = balance;

//   updateMaxExpense();
//   updateChart();

//   $('#editModal').modal('hide'); // Hide the modal after saving changes
// });

// // Initial call to updateChart to display the pie chart with initial data
// updateChart();






























































































































































































// var d = window.localStorage.getItem("sal");
// var dd = JSON.parse(d);
// var incomee = document.getElementsByClassName("income");
// incomee[0].innerText = dd.key;

// var table = document.getElementsByTagName("table");
// var total = 0;
// var balance = dd.key; // Initialize balance with income value
// var max = 0;
// var currentEditRow, currentEditCategoryCell, currentEditAmountCell, currentEditTotalCell;

// var categoryTotals = {}; // Object to store total expenses per category

// //Initialize pie chart
// var expenseChart = null;


// // Function to update the pie chart
// function updateChart() {
//   var labels = [];
//   var data = [];
//   var colors = [];

//   // Clear existing data
//   labels = [];
//   data = [];
//   colors = [];

//   // Populate data with current categories and totals
//   for (var category in categoryTotals) {
//     labels.push(category);
//     data.push(categoryTotals[category]);
//     colors.push(getRandomColor());
//   }

//   var ctx = document.getElementById('expenseChart').getContext('2d');

//   if (expenseChart) {
//     expenseChart.destroy(); // Destroy existing chart to prevent duplicates
//   }

//   expenseChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: colors
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });
// }

// // Function to generate random color
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// document.getElementById("expenseForm").addEventListener("submit", handleSubmit);

// function handleSubmit(e) {
//   e.preventDefault();

//   var category = e.target.category.value;
//   var expenses = parseFloat(e.target.amount.value);

//   if (isNaN(expenses) || expenses <= 0) {
//     alert("Enter a valid Amount");
//     return;
//   }

//   var trr = document.createElement("tr");
//   table[1].querySelector("tbody").appendChild(trr); // Appending to tbody to avoid header row

//   var categoryTd = document.createElement("td");
//   categoryTd.innerText = category;
//   trr.appendChild(categoryTd);

//   var amountTd = document.createElement("td");
//   amountTd.innerText = expenses;
//   trr.appendChild(amountTd);

//   total += expenses;
//   var totalCell = document.createElement("td");
//   totalCell.innerText = total;
//   trr.appendChild(totalCell);

//   balance = dd.key - total;
//   document.getElementById("balancee").innerText = balance;

//   var actionCell = document.createElement("td");

//   var deleteBtn = document.createElement("button");
//   deleteBtn.innerText = "Delete";
//   deleteBtn.addEventListener("click", () => {
//     balance += expenses;
//     total -= expenses;

//     document.getElementById("balancee").innerText = balance;
//     trr.remove();

//     updateMaxExpense();
//     updateChart();
//   });
//   actionCell.appendChild(deleteBtn);

//   var editBtn = document.createElement("button");
//   editBtn.innerText = "Edit";
//   editBtn.setAttribute("data-toggle", "modal");
//   editBtn.setAttribute("data-target", "#editModal");
//   editBtn.addEventListener("click", () => {
//     currentEditRow = trr;
//     currentEditCategoryCell = categoryTd;
//     currentEditAmountCell = amountTd;
//     currentEditTotalCell = totalCell;
//     document.getElementById("editCategory").value = category;
//     document.getElementById("editAmount").value = expenses;
//   });
//   actionCell.appendChild(editBtn);

//   trr.appendChild(actionCell);

//   if (categoryTotals[category]) {
//     categoryTotals[category] += expenses;
//   } else {
//     categoryTotals[category] = expenses;
//   }

//   updateMaxExpense();
//   updateChart();

//   // Clear form inputs after submission
//   e.target.reset();
// }

// // Function to update the max expense and balance
// function updateMaxExpense() {
//   var rows = document.querySelectorAll(".table table tbody tr");
//   max = 0;
//   rows.forEach((row, index) => {
//     if (index > 0) { // Skip the header row
//       var expense = parseFloat(row.cells[1].innerText);
//       if (expense > max) {
//         max = expense;
//       }
//     }
//   });
//   // Update any UI elements if needed
// }

//   var oldAmount = parseFloat(currentEditAmountCell.innerText);
//   var oldCategory = currentEditCategoryCell.innerText;

//   balance = balance + oldAmount - newAmount;
//   total = total - oldAmount + newAmount;

//   if (oldCategory === newCategory) {
//     categoryTotals[oldCategory] = categoryTotals[oldCategory] - oldAmount + newAmount;
//   } else {
//     categoryTotals[oldCategory] -= oldAmount;
//     if (categoryTotals[newCategory]) {
//       categoryTotals[newCategory] += newAmount;
//     } else {
//       categoryTotals[newCategory] = newAmount;
//     }
//   }

//   currentEditCategoryCell.innerText = newCategory;
//   currentEditAmountCell.innerText = newAmount;
//   currentEditTotalCell.innerText = total;

//   document.getElementById("balancee").innerText = balance;

//   updateMaxExpense();
//   updateChart();

//   $('#editModal').modal('hide'); // Hide the modal after saving changes
// });

// function updateMaxExpense() {
//   var maxExpense = 0;
//   for (var category in categoryTotals) {
//     if (categoryTotals[category] > maxExpense) {
//       maxExpense = categoryTotals[category];
//     }
//   }
//   max = maxExpense;
// }

// function updateChart() {
//   var labels = [];
//   var data = [];
//   var colors = [];

//   for (var category in categoryTotals) {
//     labels.push(category);
//     data.push(categoryTotals[category]);
//     colors.push(getRandomColor());
//   }

//   data.push(balance);
//   labels.push("Remaining Balance");
//   colors.push(getRandomColor());

//   if (expenseChart) {
//     expenseChart.destroy();
//   }

//   var ctx = document.getElementById('expenseChart').getContext('2d');
//   expenseChart = new Chart(ctx, {
//     type: 'pie',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: colors
//       }]
//     },
//     options: {
//       responsive: true
//     }
//   });
// }

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// var expenseChart;
 








































































































//  var d = window.localStorage.getItem("sal");
//  var dd = JSON.parse(d);
//  var incomee = document.getElementsByClassName("income");
//  incomee[0].innerText = dd.key;

//  var table = document.getElementsByTagName("table");
// var total = 0;
// var balance = dd.key; // Initialize balance with income value
// var max = 0;
// var currentEditRow, currentEditCategoryCell, currentEditAmountCell, currentEditTotalCell;



// document.getElementById("expenseForm").addEventListener("submit", handleSubmit);

// function handleSubmit(e) {
//   e.preventDefault();

//   var expenses = parseFloat(e.target.amount.value);

//    if (isNaN(expenses) || expenses <= 0) {
//     alert("Enter a valid Amount"); 
//     return;
//  }

//    var trr = document.createElement("tr");
//   table[1].querySelector("tbody").appendChild(trr); // Appending to tbody to avoid header row

//   var category = document.createElement("td");
//   category.innerText = e.target.category.value;
//    trr.appendChild(category);

//    var amount = document.createElement("td");
//    amount.innerText = e.target.amount.value;
//   trr.appendChild(amount);

//    total += Number(e.target.amount.value);
//    var totalCell = document.createElement("td");
//   totalCell.innerText = total;
//   trr.appendChild(totalCell);
//   balance = dd.key - total;
//   document.getElementById("balancee").innerText = balance;

//   var actionCell = document.createElement("td");

//   var deleteBtn = document.createElement("button");
//    deleteBtn.innerText = "Delete";
//   deleteBtn.addEventListener("click", () => {
//     balance += Number(amount.innerText);
//     total -= Number(amount.innerText);

//     document.getElementById("balancee").innerText = balance;
//     trr.remove();

//      updateMaxExpense();
//   });
//    actionCell.appendChild(deleteBtn);

//    var editBtn = document.createElement("button");
//    editBtn.innerText = "Edit";
//    editBtn.setAttribute("data-toggle", "modal");
//    editBtn.setAttribute("data-target", "#editModal");
//  editBtn.addEventListener("click", () => {
//    currentEditRow = trr;
//     currentEditCategoryCell = category;
//      currentEditAmountCell = amount;
//     currentEditTotalCell = totalCell;
//     document.getElementById("editCategory").value = category.innerText;
//     document.getElementById("editAmount").value = amount.innerText;
//    });
//     actionCell.appendChild(editBtn);

//   trr.appendChild(actionCell);

//    updateMaxExpense();

// // Clear form inputs after submission
//    e.target.reset();
//   }
 

//  document.getElementById("saveChanges").addEventListener("click", () => {
//    var newCategory = document.getElementById("editCategory").value;
//   var newAmount = parseFloat(document.getElementById("editAmount").value);
//   if (isNaN(newAmount) || newAmount <= 0) {
//     alert("Enter a valid Amount");
//      return;
//   }

//   balance = balance + Number(currentEditAmountCell.innerText) - newAmount;
//    total = total - Number(currentEditAmountCell.innerText) + newAmount;

//    currentEditCategoryCell.innerText = newCategory;
//   currentEditAmountCell.innerText = newAmount;
//   currentEditTotalCell.innerText = total;
//   document.getElementById("balancee").innerText = balance;
//   $('#editModal').modal('hide');
//    updateMaxExpense();
//  });

//  function updateMaxExpense() {
//    var rows = document.querySelectorAll("table.second tr");
//    max = 0;
//   rows.forEach((row, index) => {
//     if (index > 0) { // Skip the header row
//        var expense = parseFloat(row.cells[1].innerText);
//      if (expense > max) {
//          max = expense;
//        }
//      }
//    });
//  document.getElementById("expenses2").innerText = `Expenses: ${max}`; }




























































































































































































// var d=window.localStorage.getItem("sal")
// var dd=JSON.parse(d)
// var incomee=document.getElementsByClassName("income")
// incomee[0].innerText=dd.key;

// var table=document.getElementsByTagName("table")
// var total=0;
// var balance=0;
// var arr=[]
// var arr2=[]
// var max=0;
// var maxExp=0;
// var maxCat="";
// document.forms[0].addEventListener("submit",(e)=>{
//  e.preventDefault();

//    // console.log("category:",e.target[0].value)
//     //console.log("Amount:",e.target[1].value)
//     var expenses=parseFloat(e.target[1].value)
//     expenses.innerText="amount";


//     //amount validation
//     if(isNaN(expenses) || expenses<=0){
//         alert("Enter a valid Amount")
//         return;
//     }

//     arr.push(expenses)

//      //table row
//     var trr=document.createElement("tr")
//     table[1].appendChild(trr)

//         //Categorycell
//     var Catagory=document.createElement("td")
//     Catagory.innerText=e.target[0].value;
//     trr.appendChild(Catagory)

//         //amountcell
//     var amount=document.createElement("td")
//     amount.innerText=e.target[1].value;
//     trr.appendChild(amount)

//         //totalcell
//     total=total+Number(e.target[1].value)
//     var totalCell=document.createElement("td")
//     totalCell.innerText=total
//     trr.appendChild(totalCell)

//         //balance
//   balance=dd.key-total
//   var Balance=document.getElementById("balancee")
//   Balance.innerText=balance

//     //deletebtn
// var deleteCell=document.createElement("td")

// var deleteBtn=document.createElement("button")
// deleteBtn.innerText="Delete"

// deleteCell.appendChild(deleteBtn)
// trr.appendChild(deleteCell)

// deleteBtn.addEventListener("click",(e)=>{
//  balance=balance+Number(amount.innerText)
// total=dd.key-balance

// document.getElementById("balancee").innerText=balance
// document.getElementById("total").innerText=total
// trr.remove();

// var totall=document.getElementById("total")
// totall.innerText="Total"


// })

// for(i of arr){
//     if(i>max){
//         max=i
//     }
// }
// document.getElementById("expenses2").innerText=`Expenses:${max}`

//  if (expenses > maxExp) {
//     maxExp = expenses;
//     maxCat = Catagory;

//     document.getElementById("category2").innerText=`Category: ${Catagory.innerText}`;

// }


//  })

