/**
 * Created by alex on 09.09.16.
 */

window.addEventListener("load", function(){
    $("#manageButton").click(function () {
        chrome.tabs.create({"url":chrome.extension.getURL("html/list.html"), "selected":true});
    });
});