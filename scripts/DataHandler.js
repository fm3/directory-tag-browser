"use strict"
var self;

class DataHandler {
    constructor(db) {
        self = this;
        self.tags = {};
        self.dirs = [];
        let lines = db.trim().split('\n\n').reverse();
        for (let line of lines) {
            let split = line.split(';');
            if (split.length == 2) {
                let dir = split[0].trim();
                self.tags[dir] = split[1].trim();
                self.dirs.push(dir);
            }
        }
    }
}
