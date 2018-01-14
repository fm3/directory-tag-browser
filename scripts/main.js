"use strict";

window.onload = initialize;

function initialize() {
    let dataHandler = new DataHandler(db);
    let launchClient = new LaunchClient();
    let search = new Search();
    let gui = new Gui(dataHandler, launchClient, search);
}
