// function written by The Chromium Authors
function focusOrCreateTab(url) {
    chrome.windows.getAll({"populate":true}, function(windows) {
        var existing_tab = null;
        for (var i in windows) {
            var tabs = windows[i].tabs;
            for (var j in tabs) {
                var tab = tabs[j];
                if (tab.url == url) {
                    existing_tab = tab;
                    break;
                }
            }
        }
        if (existing_tab) {
            chrome.tabs.update(existing_tab.id, {"selected":true});
        } else {
            chrome.tabs.create({"url":url, "selected":true});
        }
    });
}


// handle clicking on context menu
function handleTabActivate(info, tab) {
        if(tab) {
            var addTaskUrl = chrome.extension.getURL("html/addTask.html#" + tab.url);
            focusOrCreateTab(addTaskUrl);
        }
}

// check, must we block site today or not
function checkDay(task) {
    var currentTime = new Date();
    var currentDay = currentTime.getDay();
    var numToDays = {
        0: "daySunday",
        1: "dayMonday",
        2: "dayTuesday",
        3: "dayWednesday",
        4: "dayThursday",
        5: "dayFriday",
        6: "daySaturday"
    };

    if(task[numToDays[currentDay]] === "on") {
        return true;
    } else {
        return false;
    }
}

// check, is this day is a rest of appropriate day
function isThisARestOfTheDay(task) {
    var endTime = new Date(task.currentState.date);
    var currentDate = new Date();

    if(endTime.getFullYear() === currentDate.getFullYear() &&
       endTime.getMonth() === currentDate.getMonth() &&
       endTime.getDate() === currentDate.getDate()) {
        return true;
    } else {
        return false;
    }
}

//check, is unblocking time is over
function isTimeOver(task) {
    var startDate = new Date(task.currentState.date);
    var currentDate = new Date();
    var freeTime = parseInt(task.taskTime, 10);
    var endTime = startDate;
    endTime.setHours(endTime.getHours() + freeTime);

    if( currentDate - endTime > 0 ) {
        return true;
    } else {
        return false;
    }
}

//update date in task in localstorage
function updateDate(task) {
    var currentTime = new Date();

    var newTaskState = task;
    newTaskState.currentState.date = currentTime;

    localStorage.setItem(task.blockedSite, JSON.stringify(newTaskState));
}

//update current task state in localstorage
function updateBlocking(task, block) {
    var currentTime = new Date();

    var newTaskState = task;
    newTaskState.currentState.blocked = block;
    newTaskState.currentState.date = currentTime;

    localStorage.setItem(task.blockedSite, JSON.stringify(newTaskState));
}

// handle incoming request
function handleRequest(url) {
    var currentUrl = $.url('hostname', url);
    if(!localStorage.getItem(currentUrl)) return false;

    var currentTask = JSON.parse(localStorage.getItem(currentUrl));

    if(!checkDay(currentTask)) {
        updateBlocking(currentTask, false);
        return false;
    }

    if(currentTask.currentState.blocked) {
        updateDate(currentTask);
        return true;
    } else {
        if(currentTask.taskType === "rest") {
            if(isThisARestOfTheDay(currentTask)) {
                return false;
            } else {
                updateBlocking(currentTask, true);
                return true;
            }
        } else if(currentTask.taskType === "time") {
            if(isTimeOver(currentTask)) {
                updateBlocking(currentTask, true);
                return true;
            } else {
                return false;
            }
        }
    }
    return false;
}

chrome.contextMenus.onClicked.addListener(handleTabActivate);

chrome.contextMenus.create({
    "title" : "Add task",
    "type" : "normal",
    "contexts" : ["all"]
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if(handleRequest(details.url)) {
        return { redirectUrl: chrome.extension.getURL("html/blockPlug.html#" + details.url) };
    } else {
        return {cancel: false};
    }
}, {
    urls: ["<all_urls>"]
}, ["blocking"]);