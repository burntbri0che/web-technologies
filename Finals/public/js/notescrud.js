$(document).ready(function() {
    // var currentPage = 1;  // Current page number

    
    function displayNotes(searchQuery = '', page = 1) {
        let url = `/notes/search?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=6`;
    
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function(data) {
                var notesList = $("#notesDisplay");
                notesList.empty();
                var row = $('<div class="row">');
                $.each(data.notes, function(index, note) {
                    var cardHtml = `
                        <div class="col-md-4">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h5 class="card-title">${note.title}</h5>
                                    <p class="card-text">${note.body}</p>
                                    <div>
                                        <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${note._id}">Edit</button>
                                        <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${note._id}">Delete</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    row.append(cardHtml);
                    if ((index + 1) % 3 === 0) {
                        notesList.append(row);
                        row = $('<div class="row">');
                    }
                });
                if (data.notes.length % 3 !== 0) {
                    notesList.append(row);
                }
                updatePagination(data.totalPages, page); 
            },
            error: function(error) {
                console.error("Error fetching notes:", error);
            }
        });
    }

    $(document).on("click", "#pagination .page-link", function(e) {
        e.preventDefault();
        var selectedPage = $(this).text();
        displayNotes($('#searchInput').val(), selectedPage);
    });
    

    $('#searchButton').click(function() {
        var searchQuery = $('#searchInput').val();
        displayNotes(searchQuery); // Call to display notes with the search query
    });

    function updatePagination(totalPages, currentPage) {
    var pagination = $('#pagination');
    pagination.empty();
    for (let i = 1; i <= totalPages; i++) {
        var pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`);
        pageItem.on('click', function(e) {
            e.preventDefault();
            currentPage = i;
            displayNotes($('#searchInput').val()); // Pass the current search term
        });
        pagination.append(pageItem);
    }
}


    displayNotes();
    

    
    function deleteNote() {
        let noteId = $(this).attr("data-id");
        $.ajax({
            url: "/notes/delete/" + noteId, 
            method: "DELETE",
            success: function() {
                displayNotes();  
            },
            error: function(error) {
                console.error("Error deleting note:", error);
            },
        });
    }

    
    function handleFormSubmission(event) {
        event.preventDefault();
        var noteId = $("#noteId").val(); 
        var title = $("#noteTitle").val();
        var body = $("#noteInput").val();
        
        if (noteId) {
            
            $.ajax({
                url: "/notes/update/" + noteId,
                method: "PUT",
                data: { title: title, body: body },
                success: function() {
                    displayNotes(); 
                    resetForm(); 
                },
                error: function(error) {
                    console.error("Error updating note:", error);
                }
            });
        } else {
            
            $.ajax({
                url: "/notes/add",
                method: "POST",
                data: { title: title, body: body },
                success: function() {
                    displayNotes(); 
                    resetForm(); 
                },
                error: function(error) {
                    console.error("Error creating note:", error);
                }
            });
        }
    }

    function resetForm() {
        $('#noteTitle').val('');
        $('#noteInput').val('');
        $('#noteId').val(''); 
        $('#createBtn').html("Create"); 
    }

    
    function editNote() {
        let noteId = $(this).attr("data-id");
        $.ajax({
            url: "/notes/get/" + noteId,  
            method: "GET",
            success: function(note) {
                $("#noteTitle").val(note.title);
                $("#noteInput").val(note.body);
                $("#noteId").val(noteId); 
            },
            error: function(error) {
                console.error("Error fetching note data for editing:", error);
            }
        });
    }

    // displayNotes();
   
    $(document).on("click", ".btn-del", deleteNote);
    $(document).on("click", ".btn-edit", editNote);
    $("#noteForm").submit(handleFormSubmission);
});
