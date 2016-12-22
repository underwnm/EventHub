var eventListings = [];
var eventsPerPage = 12;
var followings = [];

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
            createPagination();
            displayPage(0);
        })
        .fail(function () {
            console.log("FAIL");
        });
}

function getTopEvents() {
    const topEvents = "&date=Future&sort_order=popularity";
    search(topEvents, 1, eventsPerPage, true);
}

function getNormalParameters() {
    var parameters = "&date=Future";
    const keywords = $("#search-keyword").val();
    const location = $("#search-location").val();

    if (keywords.value !== "") {
        parameters += `&keywords=${keywords}`;
    }
    if (location.value !== "") {
        parameters += `&location=${location}`;
    }
    return parameters;
}

function preformSearch(parameters) {
    eventListings = [];
    resetPage();
    search(parameters, 1, eventsPerPage, true);
    for (var i = 1; i < 10; i++) {
        search(parameters, i + 1, eventsPerPage, false);
    }

}

function search(parameters, pageNumber, pageSize, isFirst) {
        $.ajax({
            url:
        `http://api.eventful.com/json/events/search?app_key=hG5H2hGr6HDF2Mx2&page_size=` + pageSize + `&page_number=` + pageNumber + `&image_sizes=perspectivecrop290by250&date=Future&sort_order=popularity&include=price${parameters}`,
            dataType: "jsonp",
            async: true,
            success: function (data) {
                console.log(data);
                $.each(data.events.event,
                    function (index, event) {
                        if (event.image !== null) {
                            eventListings.push(event);
                        }
                    });
                if (isFirst) {
                    displayPage(0);
                }
                createPagination();
            }
        });
}

function createPagination() {
    if ($('#12') === null) {
        return;
    }
    const pagesNeeded = eventListings.length / eventsPerPage;
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

function displayPage(pageNumber) {
    const currentPageEvents = [];
    $("html, body").animate({ scrollTop: 0 }, "slow");
    resetPage();
    for (let i = 0; i < eventsPerPage; i++) {
        if (i + (eventsPerPage * pageNumber) < eventListings.length) {
            currentPageEvents.push(eventListings[i + (eventsPerPage * pageNumber)]);
        }
    }
    displayEvents(currentPageEvents);
    delayResults();
}

function displayEvents(events) {
    $.each(events,
        function(index, event) {
            if (event.image !== null) {
                const imageUrl = event.image.perspectivecrop290by250.url;
                const eventTitle = event.title;
                const startTime = convertTime(event.start_time);
                const endTime = event.end_time;
                const venueName = event.venue_name;
                const venueAddress = event.venue_address;
                const cityName = event.city_name;
                const regionName = event.region_name;
                const regionAbbreviation = event.region_abbr;
                const eventId = event.id;
                buildHtml(index,
                    imageUrl,
                    eventTitle,
                    startTime,
                    endTime,
                    venueName,
                    venueAddress,
                    cityName,
                    regionName,
                    regionAbbreviation,
                    eventId);
            }
        });
}

function convertTime(startTime) {
    const dateTime = startTime.split(" ");
    const date = dateTime[0].split("-");
    const time = dateTime[1].split(":");
    if (time[0] > 12) {
        time[0] = time[0] - 12;
        time[2] = "pm";
    } else {
        time[2] = "am";
    }
    return date[1] + "/" + date[2] + "/" + date[0] + " at " + time[0] + ":" + time[1] + " " + time[2];
}

function buildHtml(index,
    imageUrl,
    eventTitle,
    startTime,
    endTime,
    venueName,
    venueAddress,
    cityName,
    regionName,
    regionAbbreviation,
    eventId) {
    var followbtn;
    var isFollowing = checkAlreadyFollowing(eventId);
    if (isFollowing) {
        followbtn = '<button class="follow-btn btn btn-info" type="button">Following</button>';
    }
    else {
        followbtn = '<button class="follow-btn btn btn-default" type="button">Follow</button>';
    }
    const html = `<div class="event-layout">
                    <span><img class ="imageUrl" src="${imageUrl}"></span>\n
                    <div class ="event-information">
                        ${followbtn}
                        <button type="button" class ="btn btn-default directions-btn modalButton" data-toggle="modal" data-target="#myModal">Google maps</button><br />
                        <span class ="event-title">${eventTitle}</span><br />
                        <span class ="start-time">${startTime}</span><br />
                        <span class ="venue-name">${venueName}</span><br />
                        <span class ="venue-address">${venueAddress}</span><br />
                        <span class ="city-name">${cityName}, </span>
                        <span class ="region-name">${regionName}</span>
                        <span class ="region-abbr">${regionAbbreviation}</span>
                        <span class ="event-id">${eventId}</span>
                    </div>
                </div>`;
    const allHtml = $(`<li id="${index}" class="results col-lg-3 col-md-3 col-sm-4 col-xs-6">${html}</li>`);
    $("#event-container").append(allHtml);
}

function delayResults() {
    $(function() {
        $(".results")
            .each(function(index) {
                $(this).delay(index * 250).fadeTo(1000, 1);
            });
        $("#pagination-nav").show();
        $("footer").show();
    });
}

function resetPage() {
    $("#pagination-nav").hide();
    $("footer").hide();
    $("#event-container").empty();
}

function follow(followDto, button) {
    console.log(followDto);
    $.ajax({
        type: "POST",
        data: JSON.stringify(followDto),
        url: "/api/followings",
        contentType: "application/json; charset=utf-8"
    })
        .success(function (data) {
            console.log(data);
            if (data === "followed"){
                button
                    .removeClass("btn-default")
                    .addClass("btn-info")
                    .text("Following");

            }
            else {
                button
                    .removeClass("btn-info")
                    .addClass("btn-default")
                    .text("Follow");
            }
        })
        .fail(function () {
            console.log("FAIL");
        });
}
function buildFollowDto(button) {
    const parent = $($(button)[0].parentNode)[0].parentNode;
    const regionName = $(".region-name", parent).text();
    const regionAbbreviation = $(".region-abbr", parent).text();
    const cityName = $(".city-name", parent).text().split(",")[0];
    const venueName = $(".venue-name", parent).text();
    const venueAddress = $(".venue-address", parent).text();
    const startTime = $(".start-time", parent).text();
    const endTime = $(".end-time", parent).text();
    const eventTitle = $(".event-title", parent).text();
    const imageUrl = $(".imageUrl", parent).attr("src");
    const eventId = $(".event-id", parent).text();

    const followDto = {
        regionName,
        regionAbbreviation,
        cityName,
        venueName,
        venueAddress,
        startTime,
        endTime,
        eventTitle,
        imageUrl,
        eventId
    };

    return followDto;
}

function getAdvancedParameters() {
    let parameters = "";
    const location = $("#location")[0];
    const date = $("#date")[0];
    const category = $("#category")[0];
    const within = $("#within")[0];
    const units = $("#units")[0];
    const sortOrder = $("#sort-order")[0];
    const sortDirection = $("#sort-direction")[0];

    if (location.value !== "") {
        parameters += `&location=${location.value}`;
    }
    if (date.value !== "") {
        parameters += `&date=${date.value}`;
    }
    if (category.value !== "") {
        parameters += `&category=${category.value}`;
    }
    if (within.value !== "") {
        parameters += `&within=${within.value}`;
    }
    if (units.value !== "") {
        parameters += `&units=${units.value}`;
    }
    if (sortOrder.value !== "") {
        parameters += `&sort_order=${sortOrder.value}`;
    }
    if (sortDirection.value !== "") {
        parameters += `&sort_direction=${sortDirection.value}`;
    }
    return parameters;
}

function checkAlreadyFollowing(eventId) {
    var isFollowing = false;
    $.each(followings,
        function(index, following) {
            if (following.eventId === eventId) {
                isFollowing = true;
            }
        });
    return isFollowing;
}

function getDirections(button) {
    $("#directions").empty();
    let directionsDto = buildFollowDto(button);
    let address = directionsDto.venueAddress.replace(" ","+");
    let city = directionsDto.cityName;
    let region = directionsDto.regionName;
    let parameters = `${address}, ${city}+${region}`;
    let apiCall = "https://www.google.com/maps/embed/v1/place?key=AIzaSyB9hagirRLcYPotf0iB9fYjqQMdkFD_yWQ&q=" + parameters;
    let html = `<iframe class="iframe-google" width="600" height="450" align="middle" frameborder="0" style="border:0" src="${apiCall}" allowfullscreen></iframe>`;
    $("#directions").append(html);
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
                    const authenticated = $("#authentication");
                    const loginStatus = authenticated.attr("data-user-login");
                    if (loginStatus === "False") {
                        $("#login-alert").show();
                    } else {
                        follow(buildFollowDto(button), button);
                    }

                });
        $(document)
            .on("click",
                ".directions-btn",
                function (e) {
                    const button = $(e.target);
                    getDirections(button);
                    console.log('worked');
                });

        $("#search-button")
            .click(function () {
                preformSearch(getNormalParameters());
            });
    });