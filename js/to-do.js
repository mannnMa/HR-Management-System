const inputTask = document.getElementById("input-task");
const listContainer = document.getElementById("list-container");

//add button functionality
function addTask() {
  if (inputTask.value === "") {
    alert("Please enter a task.");
  }
  else {
    let li = document.createElement("li");
    li.innerHTML = inputTask.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7"; // Unicode for a cross mark
    li.appendChild(span);
  }
  inputTask.value = "";
  saveTasks();
}

//check off task functionality
listContainer.addEventListener("click", function(e){
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveTasks();
  }
  else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveTasks();  
  }
}, false);

//saving data to local storage 
function saveTasks() {
  localStorage.setItem("data", listContainer.innerHTML);
}

//show tasks from local storage on page load
function showTasks() {
  listContainer.innerHTML = localStorage.getItem("data");
}
showTasks();