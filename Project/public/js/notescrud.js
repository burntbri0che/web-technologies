$(document).ready(function() {
    function fetchNotes() {
        $.ajax({
            url: "/notes/all",
            method: "GET",
            success: function(notes) {
                $('#notesDisplay').empty();
                notes.forEach(function(note) {
                    $('#notesDisplay').append('<div class="note-item mb-3"><p>' + note + '</p></div>');
                });
            },
            error: function() {
                console.error("Error loading notes");
            }
        });
    }

    $('#noteForm').submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: "/notes/add",
            method: "POST",
            data: $(this).serialize(),
            success: function() {
                fetchNotes();
                $('#noteInput').val(''); // Clear the input after saving
            },
            error: function() {
                console.error("Error saving note");
            }
        });
    });

    fetchNotes(); // Initial fetch of notes
});