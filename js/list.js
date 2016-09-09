/**
 * Created by alex on 09.09.16.
 */

function deleteTask(url) {
    if(confirm("Are you sure, you want to delete this task?")) {
        localStorage.removeItem(url);
        chrome.tabs.query({currentWindow: true, active : true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }
}

function editTask(url) {
    chrome.tabs.create({"url": chrome.extension.getURL("html/addTask.html?edit#" + url) , "selected":true});
}

window.addEventListener("load", function () {
    var data = [];

    for(var i = 0; i < localStorage.length; i++) {
        var ttask = JSON.parse(localStorage.getItem(localStorage.key(i)));
        var taskToForm = {};

        taskToForm.site = ttask.blockedSite;
        taskToForm.name = ttask.taskName;
        taskToForm.description = ttask.taskDescription;
        taskToForm.blocked = ttask.currentState.blocked ? "Blocked" : "Open";

        data.push(taskToForm);
    }

    var tmpl = $.templates("#listItemTemplate");

    $("#tasksList").html( tmpl.render(data) );
    
    $(".deleteButton").click(function () {
        deleteTask($(this).data("site"));
    });

    $(".editButton").click(function () {
        editTask($(this).data("site"));
    });
});