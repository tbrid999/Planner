
const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const imageInput = document.getElementById("image-input");


const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

// add or update a task
const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

 
  let imageBase64 = "";
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      imageBase64 = reader.result;
      saveTask(imageBase64);
    };

    reader.readAsDataURL(file);
  } else {
    saveTask(imageBase64);  
  }
};

// save a task (after image conversion)
const saveTask = (imageBase64) => {
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
    image: imageBase64, 
  };

  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
};

// update the task container with tasks from localStorage
const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(({ id, title, date, description, image }) => {
    tasksContainer.innerHTML += `
      <div class="task" id="${id}">
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${image ? `<img src="${image}" alt="Task Image" class="task-image" />` : ""}
        <button onclick="editTask(this)" type="button" class="btn">Edit</button>
        <button onclick="deleteTask(this)" type="button" class="btn">Delete</button> 
      </div>
    `;
  });
};

// delete a task
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
};

// edit a task
const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  if (currentTask.image) {
    // Display the current image
    const image = new Image();
    image.src = currentTask.image;
    image.className = 'task-image';
    document.querySelector('.task-form').appendChild(image);
  }

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");
};

// reset the form
const reset = () => {
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  imageInput.value = "";  
  taskForm.classList.toggle("hidden");
  currentTask = {};
};

// check and show dialogs before closing the form
const checkFormInputs = () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
};

// open task form
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

// close task form with confirmation if changes are made
closeTaskFormBtn.addEventListener("click", checkFormInputs);

// cancel close dialog
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

// discard changes and close dialog
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Check for empty title and description before adding or updating task
  if (!titleInput.value) {
    document.getElementById("empty-title-warning-dialog").showModal();
    return;
  }
  if (!descriptionInput.value) {
    document.getElementById("empty-description-warning-dialog").showModal();
    return;
  }

  addOrUpdateTask();
});

// empty title warning dialog confirm button
document.getElementById("confirm-title-btn").addEventListener("click", () => {
  document.getElementById("empty-title-warning-dialog").close();
  titleInput.focus();
});

// empty description warning dialog add button
document.getElementById("add-description-btn").addEventListener("click", () => {
  document.getElementById("empty-description-warning-dialog").close();
  descriptionInput.focus();
});

// empty description warning dialog proceed button
document.getElementById("proceed-without-description-btn").addEventListener("click", () => {
  document.getElementById("empty-description-warning-dialog").close();
  addOrUpdateTask();
});

// Initialize task container
if (taskData.length) {
  updateTaskContainer();
}

// Weather App Script
document.getElementById('fetchWeatherBtn').addEventListener('click', function() {
  const city = document.getElementById('cityInput').value;
  const apiKey = 'f9608dbe1adb20171e7a27256fa07354'; // Your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        const weatherHtml = `
          <h2>${data.name}</h2>
          <p>${data.weather[0].description}</p>
          <p>Temperature: ${data.main.temp}°C</p>
          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
        `;
        document.getElementById('weatherInfo').innerHTML = weatherHtml;
      } else {
        document.getElementById('weatherInfo').innerHTML = `<p>${data.message}</p>`;
      }
    })
    .catch(error => {
      document.getElementById('weatherInfo').innerHTML = `<p>Failed to fetch weather data.</p>`;
    });
});

document.getElementById('clearWeatherBtn').addEventListener('click', function() {
  document.getElementById('weatherInfo').innerHTML = ''; // Clear weather data
});
