

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

chrome.contextMenus.onClicked.addListener(handleTabActivate);

chrome.contextMenus.create({
    "title" : "Add task",
    "type" : "normal",
    "contexts" : ["all"]
});