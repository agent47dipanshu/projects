let gameSeq = [];
let userSeq = [];

let btns = ["red", "green", "yellow", "blue"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2")

document.addEventListener("keypress", function () {
     if (started == false) {
          console.log("game has started");
          started = true;
          levelUp();
     }
});

function btnFlash(btn) {
     btn.classList.add("flash");
     setTimeout(function () {
          btn.classList.remove("flash")
     }, 200)
}
function userFlash(btn) {
     btn.classList.add("userflash");
     setTimeout(function () {
          btn.classList.remove("userflash")
     }, 200)
}

function levelUp() {
     userSeq = [];
     level++;
     h2.innerText = `Level ${level}`;

     let randIdx = Math.floor(Math.random() * 4);
     let randCol = btns[randIdx];
     let randBtn = document.querySelector(`.${randCol}`);
     gameSeq.push(randCol)
     console.log(gameSeq)
     btnFlash(randBtn);
};

function check(idx) {
     if (userSeq[idx] === gameSeq[idx]) {
          if (gameSeq.length == userSeq.length) {
               setTimeout(levelUp, 1000);
          }
     }
     else {
          h2.innerText = `Game Over! \n Your score was ${level} \n Press any key to restart... `;
          document.querySelector("body").style.backgroundColor = "red";
          setTimeout(function () {
               document.querySelector("body").style.backgroundColor = "black"
          }, 150)
          reset();
     }

};

function btnPre() {
     let btn = this;
     userFlash(btn);

     userCol = btn.getAttribute("id");
     // console.log(userSeq);
     userSeq.push(userCol);
     check(userSeq.length - 1);

};
let allBtn = document.querySelectorAll(".btn");
for (btn of allBtn) {
     btn.addEventListener("click", btnPre)
};


function reset() {
     started = false;
     gameSeq = [];
     userSeq = [];
     level = 0;

}