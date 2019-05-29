function saveToStorage(key,QuestTree) {
    var strValue = JSON.stringify(QuestTree);
    localStorage.setItem(key, strValue);
}
function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}