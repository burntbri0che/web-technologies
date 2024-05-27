$(document).ready(function() {
   
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

    
    displayTasks();
    
   
    $(document).on("click", ".btn-del", function() {
        let taskId = $(this).data("id");
        $.ajax({
            url: "/tasks/delete/" + taskId, 
            method: "DELETE",
            success: function() {
                displayTasks();  
            },
            error: function(error) {
                console.error("Error deleting task:", error);
            },
        });
    });

    
    $("#tasksForm").submit(function(event) {
        event.preventDefault();
        var taskId = $("#taskId").val();
        var description = $("#taskDescription").val();
        var date = $("#taskDate").val();
        var url = taskId ? "/tasks/update/" + taskId : "/tasks/add";
        var method = "POST"; 

        $.ajax({
            url: url,
            method: method,
            data: { description: description, date: date, _id: taskId }, 
            success: function() {
                displayTasks();
                resetForm();
            },
            error: function(error) {
                console.error("Error submitting task:", error);
            }
        });
    });

 
    function resetForm() {
        $('#taskDescription').val('');
        $('#taskDate').val('');
        $('#taskId').val('');
        $('#createBtn').html("Create");
    }

   
    $(document).on("click", ".btn-edit", function() {
        let taskId = $(this).data("id");
        $.ajax({
            url: "/tasks/get/" + taskId,
            method: "GET",
            success: function(task) {
                $("#taskDescription").val(task.description);
                $("#taskDate").val(task.date.split('T')[0]); 
                $("#taskId").val(taskId); 
                $('#createBtn').html("Update"); 
            },
            error: function(error) {
                console.error("Error fetching task data for editing:", error);
            }
        });
    });
});
