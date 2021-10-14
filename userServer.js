
$(document).ready(function () {


    queryAvaliableSeats();
    getLoginUser();
    var userName;
    function queryAvaliableSeats() {
        var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var idvalue = '';
        var n = 10;
        var number = 0;;
        for (var i = 0; i < n; i++) {
            idvalue = arr[Math.floor(Math.random() * 26)];
            number = parseInt(Math.random() * (15 - 1 + 1) + 1);

            $("#avaliableSeat").append("<option>" + idvalue + number + "</option>")
        }

        return idvalue;

    }

    $("#submit").on("click", () => {
        $("#outside").css({ "display": "none" })

        $("#done").css({ "display": "block" })


    });


    $("#back").on("click", () => {
        window.location = "/pages/userLogin.html? index=" + userName;
    });

    function getLoginUser() {

        var reg = new RegExp("index=([^]*)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            userName = r[1];


        } else {
            userName = "";
            alert("error");
        }
    }


})
