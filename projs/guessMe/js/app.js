'use strict';

var gLastRes = null;

$(document).ready(init);

function init() {
    createQuestsTree();
}

function onStartGuessing() {
    // TODO:DONE hide the game-start section
    $('.game-start').hide();
    renderQuest();
    // TODO:DONE show the quest section
    $('.quest').show();
}

function renderQuest() {
    // TODO:DONE select the <h2> inside quest and update its text by the currQuest text
    $('.quest h2').text(gCurrQuest.txt);
}

function onUserResponse(res) {

    // If this node has no children
    if (isChildless(gCurrQuest)) {
        if (res === 'yes') {
            alert('Yes, I knew it!');
            // TODO: improve UX
            $('.quest').hide();
            onRestartGame();
        } else {
            alert('I dont know...teach me!')
            // TODO:DONE hide and show new-quest section
            $('.quest').hide();
            $('.new-quest').show();
        }
    } else {
        // TODO:DONE update the lastRes global var
        gLastRes = res;
        moveToNextQuest(res);
        renderQuest();
    }
}

function onAddGuess() {
    // TODO:DONE Get the inputs' values
    var $GuessVal = $('#newGuess').val();
    var $SuggestedQuestVal = $('#newQuest').val();
    // TODO:DONE Call the service addGuess
    addGuess($SuggestedQuestVal,$GuessVal,gLastRes);
    
    onRestartGame();
}


function onRestartGame() {
    $('.new-quest').hide();
    $('.game-start').show();
    gLastRes = null;
    gCurrQuest = gQuestsTree;
    gPrevQuest = null;
    saveTree();
}

