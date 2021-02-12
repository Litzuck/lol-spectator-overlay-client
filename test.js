function pickTurn(id) {
    var summoner = document.getElementById("summoner" + id);
    summoner.classList.add("is-picking-now");
}
function picking(id, champId) {
    var summoner = document.getElementById("summoner" + id)
    summoner.classList.remove("no-champion")
    summoner.classList.add("is-picking-now");
    summoner.classList.add("champion-not-locked");
    var background = document.querySelector("#summoner" + id + " .background");
    background.setAttribute("style", "background-image:url(https://cdn.communitydragon.org/latest/champion/" + champId + "/splash-art/centered)");
}

function lockin(id) {
    var summoner = document.getElementById("summoner" + id);
    summoner.classList.remove("is-picking-now");
    summoner.classList.remove("champion-not-locked");
    summoner.classList.add("champion-locked")
}

function banTurn(id) {
    var ban_wrapper = document.getElementById("ban" + id);
    ban_wrapper.classList.add("active");
}
function ban(id, champId) {
    var ban_wrapper = document.getElementById("ban" + id);
    ban_wrapper.classList.add("completed");
    ban_wrapper.classList.remove("active")
    var ban_icon = document.querySelector("#ban" + id + " .ban")
    ban_icon.setAttribute("style", "background-image:url(https://cdn.communitydragon.org/latest/champion/" + champId + "/splash-art/centered)")
}


function leftSideActing() {
    var main = document.getElementsByClassName("champ-select-spectate-component")[0]
    main.classList.add("left-side-acting")
    main.classList.remove("right-side-acting")
    main.classList.remove("show-both-timers")
}

function rightSideActing() {
    var main = document.getElementsByClassName("champ-select-spectate-component")[0]
    main.classList.remove("left-side-acting")
    main.classList.add("right-side-acting")
    main.classList.remove("show-both-timers")
}

function bothSidesActing() {
    var main = document.getElementsByClassName("champ-select-spectate-component")[0]
    main.classList.remove("left-side-acting")
    main.classList.remove("right-side-acting")
    main.classList.add("show-both-timers")
}



