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
        createProj('Minesweeper', 'logic game using matrix', 'logic game using matrix', 'testUrl','img/portfolio/06-thumbnail.jpg', ['matrix', 'arrays']),
        createProj('Book Shop', 'simple CRUD app', 'simple CRUD app', 'testUrl','img/portfolio/06-thumbnail.jpg', ['MVC', 'arrays']),
    ]

    gProjs = projects;
}
function getProj(projId) {
    return gProjs.find(function (proj) {
        return projId === proj.id;
    })
}


