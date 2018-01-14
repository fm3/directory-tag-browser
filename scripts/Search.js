"use strict"

class Search {
    constructor() {}

    matchesAllSearchTerms(tagString, searchTerms) {
        for (let searchTerm of searchTerms) {
            if (!tagString.includes(searchTerm)) {
                return false;
            }
        }
        return true;
    }

    findCleanMatchIndices(tagString, searchTerms) {
        let indices = this.findMatchIndices(tagString, searchTerms);
        return this.purgeOverlapping(indices);
    }

    findMatchIndices(tagString, searchTerms) {
        let startIndices = [];
        let endIndices = [];
        for (let searchTerm of searchTerms) {
            let searchTermLength = searchTerm.length;
            let searchTermStartIndices = this.getIndicesOf(searchTerm, tagString);
            for (let index of searchTermStartIndices) {
                startIndices.push(index);
                endIndices.push(index + searchTermLength)
            }
        }
        startIndices.sort(function(a,b){return a-b});
        endIndices.sort(function(a,b){return a-b});
        return {startIndices: startIndices, endIndices: endIndices};
    }

    purgeOverlapping(indices) {
        let startIndicesNew = []
        let endIndicesNew = []
        let largestIndex = indices.endIndices[indices.endIndices.length - 1];
        let nestingLevel = 0;
        for (let i = 0; i <= largestIndex; i++) {
            if (indices.startIndices.includes(i)) {
                if (nestingLevel == 0) {
                    startIndicesNew.push(i);
                }
                nestingLevel += this.countOccurences(indices.startIndices, i);
            }
            if (indices.endIndices.includes(i)) {
                nestingLevel -= this.countOccurences(indices.endIndices, i);
                if (nestingLevel == 0) {
                    endIndicesNew.push(i);
                }
            }
        }
        return {startIndices: startIndicesNew, endIndices: endIndicesNew};
    }


    countOccurences(array, needle) {
        let count = 0;
        for (let item of array) {
            if (item == needle) {
                count++
            }
        }
        return count;
    }

    getIndicesOf(searchStr, str) {
        let searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }
}
