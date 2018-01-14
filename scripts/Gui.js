'use strict'

class Gui {

    constructor(dataHandler, launchClient, search) {
        this.dataHandler = dataHandler;
        this.launchClient = launchClient;
        this.search = search;
        this.setupSearchField();
        this.setupEditButton();
        this.createTableContainer();
        this.createAllEntries();
        this.lastSearchTerm = null;
        this.clearQuery();
    }

    setupSearchField() {
        this.searchField = document.getElementById('searchField');
        this.searchField.onkeydown = this.searchKeyDown.bind(this);
        this.searchField.onkeyup = this.updateSearch.bind(this);
        this.searchField.onchange = this.updateSearch.bind(this);
        this.searchField.focus();

        let clearButton = document.getElementById('clearButton');
        clearButton.onclick = this.clearQuery.bind(this);
    }


    setupEditButton() {
        let editButton = document.getElementById('editButton');
        editButton.onclick = this.launchClient.editDatabase;
    }

    createTableContainer() {
        this.table = document.createElement('div');
        this.table.classList.add('table');
        document.body.appendChild(this.table);
    }

    createAllEntries() {
        for (let dir of this.dataHandler.dirs) {
            this.createEntry(dir, this.dataHandler.tags[dir]);
        }
    }

    createEntry(dir, tagString) {
        let line = document.createElement('div');
        line.setAttribute('dir', dir);
        const self = this;
        line.onclick = function() {self.launchClient.openExplorer(dir)};
        line.classList.add('line');

        let dirSpan = document.createElement('span');
        dirSpan.classList.add('dir');
        let dirTextNode = document.createTextNode(dir);
        dirSpan.appendChild(dirTextNode);
        line.appendChild(dirSpan);

        let tagStringSpan = document.createElement('span');
        tagStringSpan.classList.add('tagString');
        let tagStringTextNode = document.createTextNode(tagString);
        tagStringSpan.appendChild(tagStringTextNode);
        line.appendChild(tagStringSpan);

        this.table.appendChild(line);
    }

    clearQuery() {
        this.searchField.value = '';
        this.updateSearch();
    }

    searchKeyDown(keyEvent) {
        const self = this;
        if (keyEvent.code == 'Escape') {
            setTimeout(function() {self.clearQuery();}, 0);
            return;
        }
        setTimeout(this.updateSearch.bind(this), 0);
    }

    updateSearch() {
        let value = this.searchField.value;
        if (this.lastSearchTerm == value) {
            return;
        }
        this.lastSearchTerm = value;


        let searchTerms = this.makeAscii(value).split(' ');

        for (let line of this.table.childNodes) {
            let dir = line.getAttribute('dir');
            let tagString = this.dataHandler.tags[dir];
            if (this.search.matchesAllSearchTerms(tagString, searchTerms)) {
                line.style.display = 'block';
                this.highlightSearchTerms(line, tagString, searchTerms);
            } else {
                line.style.display = 'none';
            }
        }
    }

    makeAscii(searchTerms) {
        let replacements = new Map([
            ['ü', 'ue'], ['Ü', 'Ue'], ['ö', 'oe'], ['Ö', 'Oe'], ['ä', 'ae'], ['Ä', 'Ae'], ['ß', 'ss'],
            ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['È', 'E'], ['É', 'E'], ['Ê', 'E'],
            ['Ç', 'C'], ['ç', 'c'], ['ñ', 'n'], ['Ñ', 'N'], ['ë', 'e'], ['Ë', 'E'], ['ï', 'i'], ['Ï', 'I'],
            ['å', 'a'], ['Å', 'A'], ['œ', 'oe'], ['Œ', 'Oe'], ['æ', 'ae'], ['Æ', 'Ae'],
            ['þ', 'th'], ['Þ', 'Th'], ['ø', 'oe'], ['Ø', 'Oe']
        ]);

        for (let [key, replacement] of replacements) {
            searchTerms = searchTerms.replace(new RegExp(key, 'g'), replacement);
        }
        searchTerms = searchTerms.replace(new RegExp('[^.a-zA-Z0-9_ ]', 'g'), '')
        return searchTerms.toLowerCase();
    }

    highlightSearchTerms(line, tagString, searchTerms) {
        let parent = line.lastChild;
        this.removeChildren(parent);
        let indices = this.search.findCleanMatchIndices(tagString, searchTerms);
        let startIndices = indices.startIndices;
        let endIndices = indices.endIndices;
        let prev = 0;
        for (let i = 0; i < startIndices.length; i++) {
            let substring = tagString.substr(prev, startIndices[i] - prev);
            this.appendSpan(parent, substring, false);
            substring = tagString.substr(startIndices[i], endIndices[i] - startIndices[i]);
            this.appendSpan(parent, substring, true);
            prev = endIndices[i];
        }
        let substringEnd = tagString.substr(prev);
        this.appendSpan(parent, substringEnd, false);
    }
    appendSpan(parent, substring, highlighted) {
        if (substring == '') {
            return;
        }
        let span = document.createElement('span');
        if (highlighted) {
            span.classList.add('highlight');
        }
        let textNode = document.createTextNode(substring);
        span.appendChild(textNode);
        parent.appendChild(span);
    }

    removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }


}
