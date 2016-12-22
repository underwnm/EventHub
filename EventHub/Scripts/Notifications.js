var followings = [];
var notifications = [];
var eventsPerPage = 12;

function checkFollowings() {
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
            displayNotifications();
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

function displayNotifications() {
    var notificationContainer = $('#notification-list');
    notificationContainer.empty();
    $.each(notifications, function (index, event) {
        var html = getweather(event, index);
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

function buildHTML(event, index, weather) {
    let map = getMap(event.venueAddress, event.cityName, event.regionName)
    let weatherHtml;
    console.log(weather);
    if (weather === 'noweather') {
        weatherHtml = `Predicted weather:<br>
            <span class ="notify-weather">Predicted weather<br> could not be found</span>`
    }
    else {
        weather = weather.forecast.simpleforecast.forecastday[0];
        weatherHtml = `Predicted weather:<br>
            <div class ="weather-img">
            <span class ="notify-weather">${weather.high.fahrenheit}°F</span>
            <img src="${weather.icon_url}"/>`;
    }
    var html = `<li id="${index}" class="notify-result" style="opacity: 1;">
                    <div class="notify-layout row">
                        <div class="col-sm-3">
                            <span><img class="notify-image" src="${event.imageUrl}"></span>
                            <h3 class ="notify-title text-center">${event.eventTitle}</h3><br>
                        </div>
                        <div class ="notify-information col-sm-3">
                            When:<br>
                            <span class ="notify-start-time">${event.startTime}</span><br><br>
                            Where:<br>
                            <span class ="notify-venue-name">${event.venueName}</span><br>
                            <span class ="notify-venue-address">${event.venueAddress}</span><br>
                            <span class ="notify-city-name">${event.cityName}, </span>
                            <span class ="notify-region-name">${event.regionName}</span>
                            <span class ="notify-region-abbr">${event.regionAbbreviation}</span>
                            <span class ="notify-id">${event.eventId}</span><br><br>
                            ${weatherHtml}
                            </div>
                        </div>
                        <div class ="col-sm-5 notify-map">
                            ${map}
                        </div>
                    </div>
                </li>`;
    return html;
}

function getMap(address, city, region) {
    let parameters = `${address}, ${city}+${region}`;
    let apiCall = "https://www.google.com/maps/embed/v1/place?key=AIzaSyB9hagirRLcYPotf0iB9fYjqQMdkFD_yWQ&q=" + parameters;
    let html = `<iframe class="iframe-google" width="100%" height="100%" align="middle" frameborder="0" style="border:0" src="${apiCall}" allowfullscreen></iframe>`;
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
    });

function getweather(event, index) {
    console.log(event.cityName, event.regionAbbreviation);
    let data;
    $.ajax({
        url: `http://api.wunderground.com/api/c14e53931211628a/forecast10day/q/${event.regionAbbreviation}/${event.cityName}.json`,
        dataType: "jsonp",
        async: true,
        success: function (data) {
            console.log(data);
            if (data.forecast !== undefined) {
                var notificationContainer = $('#notification-list');
                html = buildHTML(event, index, data)
                notificationContainer.append(html);
            }
            else {
                var notificationContainer = $('#notification-list');
                html = buildHTML(event, index, 'noweather')
                notificationContainer.append(html);
            }
        },
        fail: function() {
            console.log("fail");
        }
    });
}