var followings = [];
var notifications = [];
var eventsPerPage = 12;

function checkNotifications(isNotificationPage) {
    getFollowings(isNotificationPage);
}

function getFollowings(isNotificationPage) {
    $.ajax({
        type: "GET",
        url: "/api/followings"
    })
        .success(function (data) {
            console.log(data);
            $.each(data,
                function (index, event) {
                    followings.push(event);
                });
            getNotifications();
            if (notifications.length > 0 && !isNotificationPage) {
                displayNotificationIcon();
            }
            if (isNotificationPage) {
                displayNotifications();
            }
        })
        .fail(function () {
            console.log("FAIL");
        });
}

function getNotifications() {
    $.each(followings, function (index, following) {
        var eventDate = getDateTime(following.startTime);
        var currentTime = new Date();
        if (eventDate.setDate(eventDate.getDate() + 7) >= currentTime) {
            notifications.push(following);
        }
    });
}

function getDateTime(date) {
    date = date.split(' ');
    return new Date(date[0]);
}

function displayNotificationIcon() {
    $('#notification-alert').show();
}
function displayNotifications() {
    var notificationContainer = $('#notification-list');
    notificationContainer.empty();
    $.each(notifications, function (index, event) {
        var html = buildHTML(event, index);
        notificationContainer.append(html);
    });
}

function createPagination() {
    const pagesNeeded = notifications.length / eventsPerPage;
    const paginationList = $('.pagination')[0];
    $(paginationList).empty();
    console.log(pagesNeeded);
    if (pagesNeeded > 1) {
        for (let i = 0; i < pagesNeeded; i++) {
            const newPage = `<li><span class="pagination-btn" page="${i}">${i + 1}</span></li>`;
            $(newPage).appendTo(paginationList);
        }
    }
}

function buildHTML(event, index) {
    var html = `<li id="${index}" class="notify-result" style="opacity: 1;">
                    <div class="notify-layout">
                    <span><img class="notify-image" src="${event.imageUrl}"></span>

                    <div class="notify-information">
                        <span class="notify-title">${event.eventTitle}</span><br>
                        <span class="notify-start-time">${event.startTime}</span><br>
                        <span class ="notify-venue-name">${event.venueName}</span><br>
                        <span class ="notify-venue-address">${event.venueAddress}</span><br>
                        <span class ="notify-city-name">${event.cityName}</span>
                        <span class ="notify-region-name">${event.regionName}</span>
                        <span class ="notify-region-abbr">${event.regionAbbreviation}</span>
                        <span class ="notify-id">${event.eventId}</span>
                    </div>
                    </div>
                </li>`
    return html;
}

$(document)
    .ready(function () {

        $("#pagination-nav")
            .on("click",
                "span",
                function () {
                    console.log("clicked");
                    const pageNumber = $(this).attr("page");
                    displayPage(pageNumber);
                });

        $(document)
            .on("click",
                ".follow-btn",
                function (e) {
                    const button = $(e.target);
                    follow(buildFollowDto(button), button);
                });
    });