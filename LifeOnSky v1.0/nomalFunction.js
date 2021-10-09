


$(document).ready(function () {

    $("#test").on("click", () => {
        alert("hello");
    });


    $("#tabs").tabs();



    $("body").scroll(function () {
        $("#topOfpage").slideToggle(1000);
    });

    $.ajax({
        url: "http://localhost:8080/data/Australia.json",
        type: "get",
        dataType: "json",
        success: function (data) {

            $.each(data, (index, value) => {
                $("#recommendationTable").append(" <table  class='recommendationTable' border='0'>" +
                    "<tr>" +
                    "<td rowspan='2'><img class='airlineImg' src=\'" + value.airline_img + "\''></td>" +
                    "<td class='firstRowData'>" + value.airline + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='firstRowData'>" + value.start_time + " </td>" +
                    "<td rowspan='2'><img class='arrow' src='img/arrow.png'></td>" +
                    "<td class='firstRowData'>" + value.arrive_time + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='firstRowData'>" + value.price + " </td>" +
                    "<td class='tableData'><button class='bookButton'>book</button></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class='secondRowData'>seat type: " + value.class + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='secondRowData'>" + value.starting_city + " </td>" +
                    "<td class='secondRowData'>" + value.destination + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='secondRowData'>" + value.checked_baggage + " </td>" +
                    "<td class='setLeft'>" + querySeatLeft() + " </td>" +
                    "</tr>" +

                    "</table> <br>"

                );

            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    })

    $("#saerchButton").on("click", () => {
        var seatType = $('#seatType input[name="type"]:checked').val();
        var departure = $("#departure").find("option:selected").text();
        var arrival = $("#arrival").find("option:selected").text();
        var servers = $('#extraServer input[name="services"]:checked').val();
        serchData(seatType, departure, arrival, servers)

    });



    function querySeatLeft() {
        var x = 30;
        var y = 0;
        return "Remaining seats: " + parseInt(Math.random() * (x - y + 1) + y);;

    }

    function serchData(seatType, departure, arrival, servers) {
        $.ajax({
            url: "http://localhost:8080/data/Australia.json",
            type: "get",
            dataType: "json",
            success: function (data) {

                var filterseatType = data.filter((newdata) => {
                    return newdata.class == seatType;
                })

                var filterdeparture = filterseatType.filter((newdata) => {
                    return newdata.starting_city == departure;
                })

                var filterArrival = filterdeparture.filter((newdata) => {
                    return newdata.destination == arrival;
                })

                var filterData = filterArrival.filter((newdata) => {
                    return newdata.Extra_service == servers;
                })

                showResult(filterData);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        })




    }

    function showResult(value) {


        if (value.length == 0) {
            $("#recommendation").text("Sorry, no results were matched").css({ "background-color": "red" });
        } else {
            $.each(value, (index, value) => {
                $("#recommendation").text("Search Result").css({ "background-color": "yellow" });
                $("#recommendationTable").empty();

                $("#recommendationTable").append(" <table  class='recommendationTable' border='0'>" +
                    "<tr>" +
                    "<td rowspan='2'><img class='airlineImg' src=\'" + value.airline_img + "\''></td>" +
                    "<td class='firstRowData'>" + value.airline + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='firstRowData'>" + value.start_time + " </td>" +
                    "<td rowspan='2'><img class='arrow' src='img/arrow.png'></td>" +
                    "<td class='firstRowData'>" + value.arrive_time + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='firstRowData'>" + value.price + " </td>" +
                    "<td class='tableData'><button class='bookButton'>book</button></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class='secondRowData'> seat type: " + value.class + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='secondRowData'>" + value.starting_city + " </td>" +
                    "<td class='secondRowData'>" + value.destination + " </td>" +
                    "<td class='space'></td>" +
                    "<td class='secondRowData'>" + value.checked_baggage + " </td>" +
                    "<td class='setLeft'>" + querySeatLeft() + " </td>" +
                    "</tr>" +

                    "</table> <br>"

                );

            })
        }
    }

})