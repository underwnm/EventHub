var followings = [];
var notifications = [];
var eventsPerPage = 12;

function checkNotifications() {
    getFollowings();
}

function getFollowings() {
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
            if (notifications.length > 0) {
                displayNotificationIcon();
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