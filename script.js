// DOM ELEMENTS
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector(".task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector(".empty-state");
const customizeBtn = document.querySelector("#customize-btn");
const customizePanel = document.querySelector("#customize-panel");
const closePanel = document.querySelector("#close-panel");
const nameInput = document.querySelector("#name-input"); 
const quoteInput = document.querySelector("#quote-input"); 
const saveCustomization = document.querySelector("#save-customization"); 
const userName = document.querySelector("#user-name"); 
const dailyQuote = document.querySelector("#daily-quote");
const uploadImageBtn = document.querySelector("#upload-image-btn");
const imageUpload = document.querySelector("#image-upload");
const profileImage = document.querySelector("#profile-image");
const imagePlaceholder = document.querySelector("#image-placeholder");
const themeButtons = document.querySelectorAll(".theme-btn");


// TASK DATA
const tasks = [];

function saveTasks () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

 // Create the task on the page
function renderTask(task){
    const taskItem = document.createElement("li");

    if (task.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.classList.add("task-item");

    // Give the HTML element the same ID as the task
    taskItem.dataset.id = task.id;

    taskItem.innerHTML = `
        <span class="task-text">${task.text}</span>

        <div class="task-actions">
            <button class="complete-btn">Done</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    // Add task to the list
    taskList.appendChild(taskItem);
}

// UPDATE TASK UI
function updateTaskUI() {

    taskCount.textContent =
        tasks.length === 1
            ? "1 task"
            : `${tasks.length} tasks`;

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}




customizeBtn.addEventListener("click", function () {
    customizePanel.classList.add("open");
    customizePanel.setAttribute("aria-hidden", "false");

    nameInput.focus();
});

closePanel.addEventListener("click", function () {
    customizePanel.classList.remove("open");
    customizePanel.setAttribute("aria-hidden", "true");

    customizeBtn.focus();
});


// ADD TASK
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    // Create the task data
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    // Add task to our array
    tasks.push(task);

    // Save tasks to Local Storage
    saveTasks();

    renderTask(task);

    updateTaskUI();


    // Clear input
    taskInput.value = "";


    console.log("Task added:", task);
});


const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {

    const savedTaskList = JSON.parse(savedTasks);

    savedTaskList.forEach(function (task) {

        tasks.push(task);

        renderTask(task);

    });

}

updateTaskUI();


// COMPLETE + DELETE TASKS
taskList.addEventListener("click", function (event) {

    const clickedButton = event.target.closest("button");

    if (!clickedButton) {
        return;
    }

    const taskItem = clickedButton.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.id);


    // COMPLETE TASK
    if (clickedButton.classList.contains("complete-btn")) {

        const task = tasks.find(function (task) {
            return task.id === taskId;
        });

        if (task) {
            task.completed = !task.completed;

            taskItem.classList.toggle("completed");

            // Save updated tasks
            saveTasks();
        }
    }


    // DELETE TASK
    if (clickedButton.classList.contains("delete-btn")) {

        const taskIndex = tasks.findIndex(function (task) {
            return task.id === taskId;
        });

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);

            // Save updated tasks
            saveTasks();
        }

        taskItem.remove();

        updateTaskUI();
    }

});

saveCustomization.addEventListener("click", function () {
    userName.textContent = nameInput.value;
    dailyQuote.textContent = quoteInput.value;

    localStorage.setItem("userName", nameInput.value);
    localStorage.setItem("dailyQuote", quoteInput.value);

    customizePanel.classList.remove("open");
});

const savedName = localStorage.getItem("userName");

if (savedName) {
    userName.textContent = savedName;
    nameInput.value = savedName;
}

const savedQuote = localStorage.getItem("dailyQuote");

if (savedQuote) {
    dailyQuote.textContent = savedQuote;
    quoteInput.value = savedQuote;
}

uploadImageBtn.addEventListener ("click", function () {
    imageUpload.click ();
});


imageUpload.addEventListener("change", function () {

    const file = imageUpload.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function() {

        profileImage.src = reader.result;

        localStorage.setItem("profileImage", reader.result);

    };

    reader.readAsDataURL(file);

    profileImage.style.display = "block";
    imagePlaceholder.style.display = "none";
});

const savedImage = localStorage.getItem("profileImage");

if (savedImage) {
    profileImage.src = savedImage;
    profileImage.style.display = "block";
    imagePlaceholder.style.display = "none";
}

themeButtons.forEach(function (button) {
    
    button.addEventListener("click", function () {

        document.body.dataset.theme = button.dataset.theme;

        localStorage.setItem("theme", button.dataset.theme);

    });
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    document.body.dataset.theme = savedTheme;
}