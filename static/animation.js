var clickoptie = 0;
//asideTrigger.addEventListener("onclick", asideChange);

console.log("werkt")


function galleryChange() {

if (clickoptie === 0) {
    document.getElementById("person").classList.add("clicked");
    console.log("clicked toegevoegd");
    clickoptie = 1;
    console.log("optie is nu " + clickoptie);
}
}


function galleryCollapse() {

if (clickoptie === 1) {
    document.getElementById("person").classList.remove("clicked");
    clickoptie = 0;
    console.log("optie is nu " + clickoptie);
}
}

document.getElementById("person").addEventListener("click", galleryChange);

document.getElementById("collapse").addEventListener("click", galleryCollapse);






var progressoptie = 0;
//asideTrigger.addEventListener("onclick", asideChange);

console.log("werkt")

function progressHover() {

if (progressoptie === 0) {
    document.getElementById("matchlist").classList.add("clickedprogress");
    console.log("clickedprogress toegevoegd");
    progressoptie = 1;
    console.log("optie is nu " + progressoptie);
}

else if (progressoptie === 1) {
    document.getElementById("matchlist").classList.remove("clickedprogress");
    progressoptie = 0;
    console.log("optie is nu " + progressoptie);
}
}


document.getElementById("match").addEventListener("click", progressHover);

(function(){
console.log("test")
}())
