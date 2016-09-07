/**
 * Created by alex on 05.09.16.
 */

function addTaskToDB(obj) {
    var currentTask = obj;//localStorage.getItem('tasks') || {};
    var currentTime = new Date();

    currentTask.currentState = {
        date: currentTime,
        blocked: true
    };

    localStorage.setItem(obj.blockedSite, JSON.stringify(currentTask));
}

window.addEventListener("load", function () {

    //$.alwaysUseJsonInStorage(true);

    var blockedUrl = $.url('hostname', window.location.hash.substr(1));
    $("#blockedSite").val(blockedUrl);
    $("#taskName").focus();

    $("#sub").click(function () {
        var taskData = {};
        $.each($("#taskForm").serializeArray(), function (i, e) {
            taskData[e.name] = e.value;
        });

        addTaskToDB(taskData);

        chrome.tabs.query({url: "http://"+taskData.blockedSite+"/*"}, function (tabs) {
            $.each($.makeArray(tabs), function (i, val) {
                chrome.tabs.reload(val.id);
            });
        });

        chrome.tabs.query({currentWindow: true, active : true}, function (tabs) {
            chrome.tabs.remove($.map($.makeArray(tabs), function (val, i) {
                return val.id;
            }));
        });
    });
});