
$(document).ready(function () {

    var loginUser;
    openIndexedDB();


    $("#test").on("click", () => {
        alert("hello");
    });

    $("#register").on("click", () => {
        window.location = "/pages/register.html"
    });

    $("#logging").on("click", () => {
        window.location = "/pages/userLogin.html"
    });

    $("#tabs").tabs();

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
                    "<td class='tableData'><button class='bookButton' id='" + value.pk + "' value='s'>book</button></td>" +
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




            $(".bookButton").click(function () {
                var pk = $(this).attr("id");
                bookFlight(pk);
            })


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("404: please read read me file!");

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
        var y = 1;
        return "Remaining seats: " + parseInt(Math.random() * (x - y + 1) + y);
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
                alert("404: please read read me file!");
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
                    "<td class='tableData'><button class='bookButton' id='" + value.pk + "'>book</button></td>" +
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

            $(".bookButton").click(function () {
                var pk = $(this).attr("id");
                bookFlight(pk);
            })

        }
    }

    var db;
    function openIndexedDB() {
        //create database
        var request = window.indexedDB.open("myDB", 1);

        request.onsuccess = function (e) {

            db = request.result;
            console.log(db);
            if (!db.objectStoreNames.contains('users')) {
                //set PK
                var objectStore = db.createObjectStore('users', { keyPath: 'userName' });
                console.log('done');
            }
            readAllTransaction();
            getLoginUser();
        };

        request.onerror = function (event) {
            console.log(event);
        };

        request.onupgradeneeded = function (e) {
            db = request.result;
            console.log(db);

            if (!db.objectStoreNames.contains('users')) {
                var objectStore = db.createObjectStore('users', { keyPath: 'userName' });
                console.log('done');
            }

        };
    }

    //show all data
    function readAllTransaction() {

        var transaction = db.transaction("users", 'readwrite');

        var users = transaction.objectStore('users');


        users.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;

            if (cursor) {

                console.log(cursor.value.userName);
                console.log(cursor.value.password);
                console.log(cursor.value.flight);
                cursor.continue();
            } else {

            }
        };


    }
    // add book flight
    function updateTransaction(pk) {

        var transaction = db.transaction("users", 'readwrite');

        var users = transaction.objectStore('users');



        var result = users.get(loginUser);
        result.onsuccess = function (e) {

            var arr = new Array();
            arr[0] = parseInt(pk);
            arr[1] = false;


            var userObj = e.target.result;
            userObj.flight.push(arr);
            users.put(userObj);
        }

        // change to booked
        $("#" + pk + "").text("booked").css({ "background-color": "rgb(0, 221, 18)" })


    }

    //check is login
    function bookFlight(pk) {
        //not loging
        if (loginUser == "") {
            window.location = "/pages/userLogin.html"
        } else {
            updateTransaction(pk);
        }
    }

    function getLoginUser() {

        var reg = new RegExp("index=([^]*)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            loginUser = r[1];
            $("#recommendation").text("Hi " + loginUser + ", welcome!").css({ "background-color": "yellow" })
            viewBooking();
        } else {
            loginUser = "";
        }
    }

    function viewBooking() {
        $("#logging").css({ "display": "none" });
        $("#register").css({ "display": "none" });
        $("#topOfpage").append("<button id='myBooking'>check my booking</button>")

        $("#topOfpage").append("<button id='logout'>log out</button>")
        $("#myBooking").click(function () {
            window.location = "/pages/userLogin.html? index=" + loginUser;
        })


        $("#logout").on("click", () => {
            window.location = "/main.html"
        });
    }


})