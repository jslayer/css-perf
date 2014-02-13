// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    chrome.pageAction[/https?\:\/\//.test(tab.url) ? 'show' : 'hide'](tabId);
});

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.sendMessage(tab.id, 'css-perf', function(){
        //todo - handle response
    });
});