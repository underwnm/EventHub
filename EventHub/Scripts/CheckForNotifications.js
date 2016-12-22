var followings = [];
var notifications = [];

function displayNotificationIcon() {
    $("#notification-alert").show();
}

function getDateTime(date) {
    date = date.split(" ");
    return new Date(date[0]);
}

function getNotifications() {
    $.each(followings,
        function (index, following) {
            const eventDate = getDateTime(following.startTime);
            const currentTime = new Date();
            if (eventDate.setDate(eventDate.getDate() + 7) >= currentTime) {
                notifications.push(following);
            }
        });
}

function checkNotifications() {
    $.ajax({
            type: "GET",
            url: "/api/followings"
        })
        .success(function(data) {
            console.log(data);
            $.each(data,
                function(index, event) {
                    followings.push(event);
                });
            getNotifications();
            if (notifications.length > 0) {
                displayNotificationIcon();
            }
        })
        .fail(function() {
            console.log("FAIL");
        });
}
