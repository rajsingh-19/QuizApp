let URL = "https://opentdb.com/api.php?amount=5&category=30&type=multiple";

let quizContainer = document.getElementById("quizContainer");
quizContainer.classList.add("hide");
let mainContainer = document.getElementById("mainContainer");

let beginBtn = document.getElementById("root");
beginBtn.addEventListener("click", createModal);
let quizBtnDiv = document.querySelector(".quizBtnDiv");
let quitBtn = document.getElementById("quitBtn");
quitBtn.innerText = "Quit";
quitBtn.addEventListener("click", removeModal);

let quizHeading = document.querySelector(".quizHeading");
quizHeading.classList.add("quizHeading");
let difficultyDiv = document.querySelector(".difficultyDiv");
let categoryDiv = document.querySelector(".categoryDiv");

let quesDiv = document.querySelector(".quesDiv");
let optDiv = document.querySelector(".optionsDiv")
let nextBtn = document.querySelector(".nextBtn");
nextBtn.innerText = "Next";
let submitBtn = document.querySelector(".submitBtn");
submitBtn.innerText = "Submit";
submitBtn.classList.add("hide");

//          ---Coding for API Response---
let currentIndex = 0;
let quizData = [];
let score = 0;
let getData = async (url) => {
    try {
        let {data: {results}} = await axios.get(url);
        return results; 
    } catch(error) {
        console.log(error);
    }
}
//      --saving the promise into another variable--
let showData = async () => {
    quizData = await getData(URL);
    // console.log(quizData);
}
showData();

function showQueAndOpt (quizData, index) {
    difficultyDiv.innerText = `Difficulty : ${quizData[index].difficulty}`;
    categoryDiv.innerText = `Category : ${quizData[index].category}`;

    let queElement = document.createElement("p");
    queElement.innerText = `Q.No-${index+1} : ${quizData[index].question}`;

    let options = [quizData[index].correct_answer, ...quizData[index].incorrect_answers].sort(() => Math.random() - 0.5);

    for(let elements of options) {
        let optBtn = document.createElement("button");
        optBtn.setAttribute("name", elements);
        optBtn.classList.add("quizOptBtns");
        optBtn.innerText = elements;
        optDiv.appendChild(optBtn);
    }
    quesDiv.appendChild(queElement);
}

optDiv.addEventListener("click", (event) => {
    if (event.target.name === quizData[currentIndex].correct_answer) {
        event.target.classList.add("correct");
        disableOtherBtn();
        score++;
    } else if (event.target.name !== quizData[currentIndex].correct_answers) {
        event.target.classList.add("incorrect");
        disableOtherBtn();
    }
});

function disableOtherBtn () {
    document.querySelectorAll(".quizOptBtns").forEach((button) => button.disabled = true);
}

nextBtn.addEventListener("click", () => {
    currentIndex++;
    quesDiv.innerHTML = "";
    optDiv.innerHTML = ""
    showQueAndOpt(quizData, currentIndex);
    if(currentIndex === 4) {
        nextBtn.disabled = true;
        submitBtn.classList.remove("hide");
    }    
});
submitBtn.addEventListener("click", () => {
    let scoreDiv = document.createElement("div");
    scoreDiv.innerText = `Your Score is ${(score/quizData.length)*100}%`;
    quizHeading.classList.add("hide");
    quesDiv.classList.add("hide");
    optDiv.classList.add("hide");
    quizBtnDiv.classList.add("hide");
    scoreDiv.classList.add("scoreDiv");

    quizContainer.appendChild(scoreDiv);
});

setTimeout(() => showQueAndOpt(quizData, currentIndex), 2000);

//      ---for toggling between the main page and quiz page---
function createModal() {                    
    quizContainer.classList.remove("hide");
    quizContainer.classList.add("quizContainer");
    mainContainer.classList.add("hide");
}
function removeModal() {
    mainContainer.classList.remove("hide");
    quizContainer.classList.add("hide");
}

