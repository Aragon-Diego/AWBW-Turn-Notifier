const host = 'https://awbw.amarriner.com/index.php';
chrome.runtime.onInstalled.addListener(({
    reason
}) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            apiSuggestions: ["scripting", "cookies", "notifications", "alarms"]
        });
    }
});


const notificationToLogIn = (callback) => {
    chrome.notifications.create({
        iconUrl: 'images/icon-128.png',
        type: 'basic',
        message: 'you need to login into AWBW and click the extention to restart',
        title: 'AWBW Notifier'
    }, e => {
        callback();
    })
}


const notificationOfTurn = (username, callback) => {
    chrome.notifications.create({
        iconUrl: 'images/icon-128.png',
        type: 'basic',
        message: 'Hey ' + username +  ' :)\nIt\'s your turn',
        title: 'AWBW Notifier'
    }, e => {
        callback();
    })
}


const notificationNonTurn = (callback) => {
    chrome.notifications.create({
        iconUrl: 'images/icon-128.png',
        type: 'basic',
        message: 'It\'s not your turn',
        title: 'AWBW Notifier'
    }, e => {
        callback();
    })
}


const fetchHtml = async () => {
    const response = await fetch(host, {
        method: 'GET'
    });
    return await response.text();
}


const start = (action) => {
    chrome.cookies.get({
        url: 'http://awbw.amarriner.com',
        name: 'PHPSESSID'
    }, cookie => {
        if (cookie) {
            const phpsessid = cookie.value;
            chrome.cookies.get({
                url: 'http://awbw.amarriner.com',
                name: 'awbw_username'
            }, async cookie => {
                if (cookie) {
                    const username = cookie.value;
                    const html = await fetchHtml();
                    const alerts = html.match(/<span class="total-alerts">[0-9]*<\/span>/);
                    if (alerts && Array.isArray(alerts)) {
                        notificationOfTurn(username, ()=>{});
                    } else if(action == 'reset') {
                        notificationNonTurn(()=>{});
                    }
                } else {
                    notificationToLogIn(()=>{});
                }
            });
        } else {
            notificationToLogIn(()=>{});
        }
    });
}
start();


chrome.action.onClicked.addListener(tab => {
    if (tab) {
        start('reset');
    }
});


chrome.alarms.create("2min", {
    delayInMinutes: 2,
    periodInMinutes: 2
});


chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "2min") {
        start();
    }
});