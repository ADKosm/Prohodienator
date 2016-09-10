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

function setValuesToForm(blockedUrl) {
    $("#blockedSite").val(blockedUrl);
    if(window.location.search.substr(1) === 'edit') {
        $("#headerLabel").html("Edit task: ");

        var days = [
            "daySunday",
            "dayMonday",
            "dayTuesday",
            "dayWednesday",
            "dayThursday",
            "dayFriday",
            "daySaturday"
        ];

        $.each(days, function (index, value) {
            $("#" + value).prop("checked", false);
        });

        var currentTask = JSON.parse(localStorage.getItem(blockedUrl));
        for(var key in currentTask) {
            if(currentTask.hasOwnProperty(key) ) {
                $("#" + key).val(currentTask[key]);
                $("#" + key).prop('checked', true);
            }
        }

        if(currentTask.taskType === 'time') {
            $("#certainTime").prop("checked", true);
        } else if (currentTask.taskType === 'rest') {
            $("#restOfDay").prop("checked", true);
        }
    }
}

window.addEventListener("load", function () {

    //$.alwaysUseJsonInStorage(true);

    var blockedUrl = $.url('hostname', window.location.hash.substr(1));

    setValuesToForm(blockedUrl);

    $("#taskName").focus();

    $("#sub").click(function () {
        var taskData = {};
        $.each($("#taskForm").serializeArray(), function (i, e) {
            taskData[e.name] = e.value;
        });

        addTaskToDB(taskData);

        chrome.tabs.query({url: "*://"+taskData.blockedSite+"/*"}, function (tabs) {
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