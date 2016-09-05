/**
 * Created by alex on 05.09.16.
 */

function addTaskToDB(obj) {
    var currentTasks = $.localStorage.get('tasks') || {};
    currentTasks[obj.blockedSite] = obj;
    $.localStorage.set('tasks', currentTasks);
}

window.onload = function () {

    $.alwaysUseJsonInStorage(true);

    var blockedUrl = $.url('hostname', window.location.hash.substr(1));
    $("#blockedSite").val(blockedUrl);
    $("#taskName").focus();

    $("#sub").click(function () {
        var taskData = {};
        $.each($("#taskForm").serializeArray(), function (i, e) {
            taskData[e.name] = e.value;
        });

        addTaskToDB(taskData);
    });
};