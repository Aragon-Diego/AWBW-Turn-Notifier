const notificationToLogIn = (callback) => {
    chrome.notifications.create({
        iconUrl: 'images/icon-48.png',
        type: 'basic',
        message: 'you need to login into AWBW and restart the extention',
        title: 'AWBW Notifications'
    }, e => {
        callback();
    })
}


const start = () => {
    chrome.cookies.get({
        url: 'http://awbw.amarriner.com',
        name: 'PHPSESSID'
    }, cookie => {
        if (cookie) {
            const phpsessid = cookie.value;
            console.log("🚀 ~ file: background.js:4 ~ phpsessid:", phpsessid);
            chrome.cookies.get({
                url: 'http://awbw.amarriner.com',
                name: 'awbw_username'
            }, cookie => {
                if (cookie) {
                    const username = cookie.value;
                    console.log("🚀 ~ file: background.js:14 ~ username:", username)
                    chrome.cookies.get({
                        url: 'http://awbw.amarriner.com',
                        name: 'awbw_password'
                    }, cookie => {
                        if (cookie) {
                            const password = cookie.value;
                            console.log("🚀 ~ file: background.js:14 ~ password:", password)
                            chrome.notifications.create({
                                iconUrl: 'images/icon-48.png',
                                type: 'basic',
                                message: 'Hey '+ username +' :) \nIt\'s your turn',
                                title: 'AWBW Notifications'
                            }, e => {
                                console.log(e);
                            })
                        } else {
                            notificationToLogIn();
                        }
                    });
                } else {
                    notificationToLogIn();
                }
            });
        } else {
            notificationToLogIn();
        }
    });
}
start();