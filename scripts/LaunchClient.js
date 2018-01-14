"use strict";

class LaunchClient {
    constructor() {}

    openExplorer(path) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:7723/?path=" + path);
        xhttp.send();
    }

    editDatabase() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:7723/edit/");
        xhttp.send();
    }

}
