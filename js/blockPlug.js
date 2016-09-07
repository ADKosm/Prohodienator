/**
 * Created by alex on 05.09.16.
 */

function unblockSite(task) {
    task.currentState.blocked = false;
    task.currentState.date = new Date();

    localStorage.setItem(task.blockedSite, JSON.stringify(task));
};

window.addEventListener("load", function () {
    var blockedUrl = $.url('hostname', window.location.hash.substr(1));
    var currentTask = JSON.parse(localStorage.getItem(blockedUrl));
    $("#name").html(currentTask.taskName);
    $("#description").html(currentTask.taskDescription);

    $("#taskSuccess").click(function () {
        var blockedUrl = $.url('hostname', window.location.hash.substr(1));
        var currentTask = JSON.parse(localStorage.getItem(blockedUrl));
        unblockSite(currentTask);
        window.location = "http://" + currentTask.blockedSite;
    });

    $("#taskUncomplete").click(function () {
        chrome.tabs.query({currentWindow: true, active : true}, function (tabs) {
                chrome.tabs.remove($.map($.makeArray(tabs), function (val, i) {
                return val.id;
            }));
        });
    });
});