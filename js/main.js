'use strict'

$(document).ready(function () {
    console.log("ready!");
    initPage();
});
function initPage() {
    //TODO:GET PROJECTS FROM GPROJS
    //TODO:RENDER TO GALLERY
    createProjs();
    renderProjs();
}
function renderModal(project) {
    //TODO:RENDER TO MODAL HTML
    var projDate = new Date(project.publishedAt);
    var strHtml = `<h2>${project.name}</h2>
                <img class="img-fluid d-block mx-auto" src="${project.imgUrl}" alt="">
                <p>${project.desc}</p>
                <ul class="list-inline">
                    <li>Date: ${formatDate(projDate)}</li>
                    <li>Category: ${project.labels}</li>
                </ul>
                <button class="btn btn-primary" data-dismiss="modal" type="button">
                <i class="fa fa-times"></i>
                Close Project</button>`
    $('.modal-body').html(strHtml);
}
function onOpenModal(projId) {
    //TODO:GET PROJ DATA
    var project = getProj(projId);
    //TODO:SEND DATA FOR RENDER
    renderModal(project);
    //SHOW
    $('#portfolioModal1').modal('show');
}

function renderProjs() {
    var projects = getProjs();
    //data-toggle="modal" href="#portfolioModal1
    var strHtmls = projects.map(function (project) {
        return `<div class="col-md-4 col-sm-6 portfolio-item">
                    <a class="portfolio-link" onclick="onOpenModal('${project.id}')">
                    <div class="portfolio-hover">
                        <div class="portfolio-hover-content">
                        <i class="fa fa-plus fa-3x"></i>
                        </div>
                    </div>
                    <img class="img-fluid" src="${project.imgUrl}" alt="">
                    </a>
                    <div class="portfolio-caption">
                        <h4>${project.name}</h4>
                        <p class="text-muted">${project.labels}</p>
                    </div>
                </div>`
    });
    $('.render-projs').html(strHtmls.join(''));
}

function sendContactForm(){
    var email = $('#email').val();
    var subject = $('#subject').val();
    var msgBody = $('#msgBody').val();

    var url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${msgBody}`;

    window.open(url);
}