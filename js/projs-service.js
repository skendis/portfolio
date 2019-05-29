'use strict'

var gProjs;

function createProj(name, title, desc, url,imgUrl, labels = []) {
    return {
        id: makeId(),
        name: name,
        title: title,
        desc: desc,
        url: url,
        imgUrl:imgUrl,
        publishedAt: Date.now(),
        labels: labels
    }
}

function getProjs(){
    return gProjs;
}

function createProjs() {
    var projects = [
        createProj('Minesweeper', 'logic game using matrix', 'logic game using matrix', 'projs/minesweeper','img/portfolio/minesweeper.png', ['matrix', 'arrays']),
        createProj('Guess-Me', 'akinator', 'app for guessing youur answer', 'projs/guessMe','img/portfolio/guess-me.png', ['MVC', 'binary trees']),
    ]

    gProjs = projects;
}
function getProj(projId) {
    return gProjs.find(function (proj) {
        return projId === proj.id;
    })
}


