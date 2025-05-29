const currentDate = document.querySelector(".current-date");
daysTag = document.querySelector(".days"),
prevNextIcon = document.querySelectorAll(".icons-calendar span");

//getting new data, current year, and month
let date = new Date(),
currentYear = date.getFullYear(),
currentMonth = date.getMonth();

//setting the current months
const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

const renderCalendar = () => {
  let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay(), //getting first day of the month
  lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate(), //getting last date of the month
  lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay(), //getting last day of the month
  lastDateofLastMonth = new Date(currentYear, currentMonth, 0).getDate(); //getting last date of the previous month
  let liTag = "";

  for (let i = firstDayofMonth; i > 0; i--) {  //creating li of the previous month last days
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`; 
  }

  for (let i = 1; i <= lastDateofMonth; i++) { //creating li of all days of the current month
    //adding active class to the current day
    let isToday = i === date.getDate() && currentMonth === new Date().getMonth()
        && currentYear === new Date().getFullYear() ? "active" : ""; //checking if the current day is today
    liTag += `<li class="${isToday}">${i}</li>`;
  }
 
  for (let i = lastDayofMonth; i < 6; i++) { //creating li of the next month first days
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerText = `${months[currentMonth]} ${currentYear}`;
  daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => {
  icon.addEventListener("click", () => { // add click event on both icons
    //if the clicked icon is previous icon, decrement current month by 1 else increment it by 1
     currentMonth = icon.id === "prev" ? currentMonth - 1 : currentMonth + 1; 
     renderCalendar(); // calling renderCalendar function
  });
});