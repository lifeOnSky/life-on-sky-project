
$(document).ready(function () {


    $("#login").on("click", () => {

        var userNname = $("#username").val();
        var password1 = $("#password").val()
        var password2 = $("#password2").val()

        validatePassword(userNname, password1, password2);

    });

    $("#back").on("click", () => {
        window.location = "/main.html";
    });


    function validatePassword(name, value1, value2) {

        if (value1 == "" || value2 == "") {
            $("#tableTitle").text("please input your password").css({ "background-color": "red" });
            return;
        }
        if (name == "") {
            $("#tableTitle").text("please input your name").css({ "background-color": "red" });
            return;
        }
        if (value1 != value2) {
            $("#tableTitle").text("The two passwords entered are not same").css({ "background-color": "red" });
            return;
        }


        addTransaction(name, value2, []);
    }
    var db;

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
        //deleteAllTransaction();
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
        readAllTransaction();


    };




    function addTransaction(username, password, flight) {

        let transaction = db.transaction("users", "readwrite");

        let users = transaction.objectStore("users");

        let user = {
            userName: username,
            password: password,
            flight: flight
        };

        let request = users.add(user);

        request.onsuccess = function (e) {
            console.log(e);

            $("#outside").css({ "display": "none" });
            $("#alertSuccessInfo").append("<img src='/img/Congratulations.jpg' alt='Congratulations'> <br>Congratulations, the account was created successfully<br> <button class='back1'>back</button>")
                .ready(() => {
                    $(".back1").on("click", () => {
                        window.location = "/main.html? index=" + username;
                    });
                })
            readAllTransaction();
        }

        request.onerror = function (e) {
            $("#tableTitle").text("Username is already taken").css({ "background-color": "red" });
        };
    }
    function deleteAllTransaction() {

        var transaction = db.transaction("users", 'readwrite');
        var users = transaction.objectStore('users');
        users.clear();
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
                console.log(cursor.value.isServer);
                cursor.continue();
            } else {

            }
        };


    }


})