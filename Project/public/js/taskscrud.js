$(document).ready(function() {
    // Function to display tasks
    function displayTasks() {
        $.ajax({
            url: "/tasks/all",
            method: "GET",
            dataType: "json",
            success: function(data) {
                var tasksList = $("#tasksDisplay");
                tasksList.empty();
                $.each(data.tasks, function(index, task) {
                    var taskHtml = `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${task.description}</h5>
                                <p class="card-text">${new Date(task.date).toLocaleDateString()}</p>
                                <button class="btn btn-info btn-sm btn-edit" data-id="${task._id}">Edit</button>
                                <button class="btn btn-danger btn-sm btn-del" data-id="${task._id}">Delete</button>
                            </div>
                        </div>
                    `;
                    tasksList.append(taskHtml);
                });
            },
            error: function(error) {
                console.error("Error fetching tasks:", error);
            }
        });
    }

    // Call to display tasks initially
    displayTasks();
    
    // Delete task event handler
    $(document).on("click", ".btn-del", function() {
        let taskId = $(this).data("id");
        $.ajax({
            url: "/tasks/delete/" + taskId, 
            method: "DELETE",
            success: function() {
                displayTasks();  // Refresh the task list
            },
            error: function(error) {
                console.error("Error deleting task:", error);
            },
        });
    });

    // Form submission event handler for adding/updating tasks
    $("#tasksForm").submit(function(event) {
        event.preventDefault();
        var taskId = $("#taskId").val();
        var description = $("#taskDescription").val();
        var date = $("#taskDate").val();
        var url = taskId ? "/tasks/update/" + taskId : "/tasks/add";
        var method = "POST"; // Use POST for both add and update for simplicity in handling

        $.ajax({
            url: url,
            method: method,
            data: { description: description, date: date, _id: taskId }, // Include _id for updates
            success: function() {
                displayTasks();
                resetForm();
            },
            error: function(error) {
                console.error("Error submitting task:", error);
            }
        });
    });

    // Reset form fields
    function resetForm() {
        $('#taskDescription').val('');
        $('#taskDate').val('');
        $('#taskId').val('');
        $('#createBtn').html("Create");
    }

    // Edit task event handler
    $(document).on("click", ".btn-edit", function() {
        let taskId = $(this).data("id");
        $.ajax({
            url: "/tasks/get/" + taskId,
            method: "GET",
            success: function(task) {
                $("#taskDescription").val(task.description);
                $("#taskDate").val(task.date.split('T')[0]); // Ensure date format is correct for input[type="date"]
                $("#taskId").val(taskId); // Store task ID to signify update
                $('#createBtn').html("Update"); // Change button text to indicate update
            },
            error: function(error) {
                console.error("Error fetching task data for editing:", error);
            }
        });
    });
});
