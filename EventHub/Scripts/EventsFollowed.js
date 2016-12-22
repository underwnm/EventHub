var eventListings = [];
var eventsPerPage = 12;

function getFollowings() {
    $.ajax({
        type: "GET",
        url: "/api/followings"
    })
        .success(function (data) {
            console.log(data);
            $.each(data,
                function (index, event) {
                    eventListings.push(event);
                });
            createPagination();
            displayPage(0);
        })
        .fail(function () {
            console.log("FAIL");
        });
}

function createPagination() {
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
        function (index, event) {
            const imageUrl = event.imageUrl;
            const eventTitle = event.eventTitle;
            const startTime = event.startTime;
            const endTime = event.endTime;
            const venueName = event.venueName;
            const venueAddress = event.venueAddress;
            const cityName = event.cityName;
            const regionName = event.regionName;
            const regionAbbreviation = event.regionAbbreviation;
            const eventId = event.eventId;
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
        });
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

    const html = `<div class="event-layout">
                            <span class ="imageUrl"><img src="${imageUrl}"></span>\n
                            <div class ="event-information">
                                <button class ="follow-btn btn btn-info" type="button">Following</button><br />
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
    $(function () {
        $(".results")
            .each(function (index) {
                $(this).delay(index * 250).fadeTo(1000, 1);
            });
        $("#pagination-nav").show();
        $("footer").show();
    });
}

function resetPage() {
    $("#event-container").empty();
    $("#pagination-nav").hide();
    $("footer").hide();
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
            if (data === "followed") {
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

$(document)
    .ready(function() {

        $("#pagination-nav")
            .on("click",
                "span",
                function() {
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