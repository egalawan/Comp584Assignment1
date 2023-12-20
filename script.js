document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded successfully.');
    const tasksList = document.getElementById('tasks-list');

    // Initialize Draggable
    let draggable;

    function initializeDraggable() {
        // Check if draggable is already initialized, then destroy it
        if (draggable) {
            draggable.destroy();
        }

        draggable = new Draggable.Sortable(tasksList, {
            draggable: '.list-group-item',
            mirror: {
                constrainDimensions: true,
            },
        });

        // Listen for the drag:stop event to update display order
        draggable.on('drag:stop', function () {
            updateDisplayOrder();
        });
    }

    function fetchTasks() {
        // Simulate fetching tasks from local storage
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Clear the tasksList before adding new tasks
        tasksList.innerHTML = '';

        // Add each task to the tasksList
        savedTasks.forEach((task, index) => {
            addTaskToDOM(task, index);
        });

        // Initialize Draggable after tasks are added
        initializeDraggable();
    }

    function addTaskToDOM(task, index) {
        const taskElement = document.createElement('li');
        taskElement.classList.add('list-group-item', 'draggable');

        const titleElement = document.createElement('div');
        titleElement.textContent = `Title: ${task.title}`;

        const displayOrderElement = document.createElement('div');
        displayOrderElement.classList.add('display-order');
        displayOrderElement.textContent = `Display Order: #${index + 1}`;

        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.textContent = 'View Details';
        viewDetailsButton.classList.add('btn', 'btn-info', 'mt-2');
        viewDetailsButton.onclick = function () {
            // Add logic to view task details (e.g., comments and editable information)
            alert(`View details for task: ${task.title}`);
        };

        // Append elements to the task element
        taskElement.appendChild(titleElement);
        taskElement.appendChild(displayOrderElement);
        taskElement.appendChild(viewDetailsButton);

        // Append the task element to the tasks list
        tasksList.appendChild(taskElement);
    }

    function updateDisplayOrder() {
        const taskElements = document.querySelectorAll('.list-group-item');

        // Update the display order based on the actual order of tasks in the list
        taskElements.forEach((taskElement, index) => {
            const displayOrderElement = taskElement.querySelector('.display-order');
            if (displayOrderElement) {
                displayOrderElement.textContent = `Display Order: #${index + 1}`;
            }
        });

        // Update the order of tasks in local storage
        const tasksOrder = Array.from(taskElements).map(taskElement => {
            const title = taskElement.querySelector('div').textContent.replace('Title: ', '');
            return { title };
        });

        localStorage.setItem('tasks', JSON.stringify(tasksOrder));
    }

    function createTask() {
        const taskNameInput = document.getElementById('task-name');
        const taskDescriptionInput = document.getElementById('task-description');

        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();

        if (taskName !== '') {
            // Add the new task to local storage
            const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            savedTasks.push({ title: taskName, description: taskDescription });
            localStorage.setItem('tasks', JSON.stringify(savedTasks));

            // Add the new task to the DOM
            addTaskToDOM({ title: taskName, description: taskDescription }, savedTasks.length - 1);

            // Clear the input fields
            taskNameInput.value = '';
            taskDescriptionInput.value = '';

            // Close the modal
            $('#createTaskModal').modal('hide');
        }
    }

    // Expose the createTask function to the global scope
    window.createTask = createTask;

    // Fetch tasks and initialize Draggable
    fetchTasks();
});