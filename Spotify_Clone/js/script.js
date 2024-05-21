let currentSong = new Audio();
let songs;
let currFolder;


function convertSecondsToMinutesSeconds(seconds) {
     // Calculate minutes and remaining seconds
     var minutes = Math.floor(seconds / 60);
     var remainingSeconds = seconds % 60;

     // Add leading zeros if necessary
     var minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
     var secondsStr = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();

     // Combine minutes and seconds with ':'
     var formattedTime = minutesStr + ':' + secondsStr;

     return formattedTime;
}


async function getSongs(folder) {
     currFolder = folder
     let a = await fetch(`http://127.0.0.1:3000/${folder}`);
     let response = await a.text();
     let div = document.createElement("div");
     div.innerHTML = response;
     let as = div.getElementsByTagName("a");

     songs = [];

     for (let index = 0; index < as.length; index++) {
          const element = as[index];
          if (element.href.endsWith("mp3")) {
               songs.push(element.href.split(`/${folder}/`)[1])
          }
     };

     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
     songUL.innerHTML = ''
     for (song of songs) {
          songUL.innerHTML = songUL.innerHTML + `<li>
          <div class="info flex ai">
          <img src="img/music.svg" class="invert" alt="music">
          <div>
          ${song.replaceAll("%20", " ")}</div>
          </div>
          <div class="playnow">
          <img src="img/play.svg" class="invert" alt="play">
          </div>
          </li>`
     };

     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
          e.addEventListener("click", () => {
               playMusic(e.querySelector('.info>div').innerText);
          })
     });

     return songs;
};

const playMusic = (track, pause = false) => {
     // let audio = new Audio("/songs/" + track);
     currentSong.src = `/${currFolder}/` + track;
     if (!pause) {
          currentSong.play();
          play.src = "img/pause.svg";
     }
     document.querySelector('.songinfo').innerHTML = track.replaceAll("%20", " ");
     document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
};

async function displayAlbum() {
     let a = await fetch(`http://127.0.0.1:3000/songs/`);
     let response = await a.text();
     let div = document.createElement("div");
     div.innerHTML = response;
     let anchors = div.getElementsByTagName("a");

     let cardContainer = document.querySelector('.cardContainer');
     let array = Array.from(anchors);
     for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element.href.includes('/songs')) {
               let folder = element.href.split('/').slice(-2)[0];
               let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
               let response = await a.json();     
               cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
               <div class="play" >
                    <img src="img/play.svg" class="playbtn" alt="">
               </div>
               <img src="/songs/${folder}/cover.jpg" alt="">
               <h2>${response.title}</h2>
               <p>${response.discription}</p>
          </div>`
          }
     };


     Array.from(document.getElementsByClassName('card')).forEach(e => {
          e.addEventListener('click', async item => {
               songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
               playMusic(songs[0]);
          })
     })

};

displayAlbum()



async function main() {

     await getSongs('songs/ncs');
     playMusic(songs[0], true);



     play.addEventListener('click', () => {
          if (currentSong.paused) {
               currentSong.play();
               play.src = "img/pause.svg"
          }
          else {
               currentSong.pause();
               play.src = "img/play.svg"
          }
     });

     currentSong.addEventListener('timeupdate', () => {
          document.querySelector('.songtime').innerHTML = `${convertSecondsToMinutesSeconds(Math.floor(currentSong.currentTime))}  / ${convertSecondsToMinutesSeconds(Math.floor(currentSong.duration))}`;
          document.querySelector('.circle').style.left = ((currentSong.currentTime) / currentSong.duration) * 100 + "%"
     })

     document.querySelector('.seekbar').addEventListener('click', (e) => {
          let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
          document.querySelector('.circle').style.left = percent + '%'
          currentSong.currentTime = (Math.floor(currentSong.duration) * percent) / 100
     });

     document.querySelector('.hamburger').addEventListener('click', () => {
          document.querySelector('.left').style.left = 0
     });
     document.querySelector('.close').addEventListener('click', () => {
          document.querySelector('.left').style.left = -100 + '%'
     });

     previous.addEventListener('click', () => {
          let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
          if ((index - 1) >= 0) {
               playMusic(songs[index - 1]);
          };
     })
     next.addEventListener('click', () => {
          let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
          if ((index + 1) < songs.length) {
               playMusic(songs[index + 1]);
          };
     })

     range.addEventListener('change', (e) => {
          currentSong.volume = parseInt(e.target.value) / 100
     });

     let volIcon = document.querySelector('.volrange>img')
     volIcon.addEventListener('click', (e) => {
          if (e.target.src.includes('img/volume.svg')) {
               currentSong.volume = 0.0;
               range.value = currentSong.volume; 
               e.target.src = e.target.src.replace('img/volume.svg', 'img/mute.svg');
          }
          else {
               e.target.src = e.target.src.replace('img/mute.svg', 'img/volume.svg');
               currentSong.volume = 0.40;
               range.value = currentSong.volume * 100;  
          }
     })

};
main(); 