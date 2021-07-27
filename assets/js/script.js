window.addEventListener("load", () => {
  document.querySelector(".toggle-button").addEventListener("click", () => {
    document.querySelector(".navbar-links").classList.toggle("active");
  });

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCsN-axDKhAUAkkyJaVHOjKK51IJ1gaMAc",
    authDomain: "qpzm-3e4b7.firebaseapp.com",
    databaseURL:
      "https://qpzm-3e4b7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "qpzm-3e4b7",
    storageBucket: "qpzm-3e4b7.appspot.com",
    messagingSenderId: "79880986412",
    appId: "1:79880986412:web:0ce0aa48ef228b98495689",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let db = firebase.database();
  let leaderboardsRef = db.ref("leaderboards");

  const urlPath = document.location.pathname;
  if (urlPath.includes("game.html")) {
    let game = {
      time: 60,
      score: 0,
      currentChar: null,
      alreadyClick: false,
    };

    let name = localStorage.getItem("name") || null;
    let highscore = localStorage.getItem("highscore") || 0;
    let character = ["Q", "P", "Z", "M"];

    const timeElement = document.querySelector(".time");
    const scoreElement = document.querySelector(".score");
    const highScoreElement = document.querySelector(".high-score");
    highScoreElement.innerHTML = highscore;
    const startButtonElement = document.querySelector(".start-button");
    const gameElement = document.querySelector(".game");

    // Ketika tombol start ditekan
    startButtonElement.addEventListener("click", () => {
      if (!name) {
        name = prompt("Masukkan nama anda: ");

        if (name) {
          localStorage.setItem("name", name);
          startGame();
        }
      } else {
        startGame();
      }

      function startGame() {
        startButtonElement.setAttribute("hidden", "");
        gameElement.removeAttribute("hidden");

        const interval = setInterval(() => {
          if (game.time === 1) {
            clearInterval(interval);

            let data = {
              name: name,
              score: game.score,
              date: new Date().toDateString(),
            };

            leaderboardsRef.push(data);

            if (game.score > highscore) {
              highscore = game.score;
              localStorage.setItem("highscore", highscore);
              highScoreElement.innerHTML = highscore;
            }

            alert("Permainan selesai, skor anda: " + game.score);

            game = {
              time: 60,
              score: 0,
              currentChar: null,
              alreadyClick: false,
            };

            timeElement.innerHTML = 0;
            scoreElement.innerHTML = 0;
            gameElement.innerHTML = "...";
            startButtonElement.removeAttribute("hidden");
            gameElement.setAttribute("hidden", "");
          } else {
            game.time -= 1;
            timeElement.innerHTML = game.time;
            scoreElement.innerHTML = game.score;

            game.currentChar = character[Math.floor(Math.random() * 4)];
            gameElement.innerHTML = game.currentChar;
            gameElement.style.color = "";

            game.alreadyClick = false;
          }
        }, 1000);
      }
    });

    // Menangani event dari keyboard
    document.addEventListener("keypress", (e) => {
      if (e.key.toLowerCase() === "q") {
        keyClicked(e.key);
      } else if (e.key.toLowerCase() === "p") {
        keyClicked(e.key);
      } else if (e.key.toLowerCase() === "z") {
        keyClicked(e.key);
      } else if (e.key.toLowerCase() === "m") {
        keyClicked(e.key);
      }
    });

    // Menangani event dari click button
    document.querySelector(".container-3").addEventListener("click", (e) => {
      if (e.target.classList.contains("q")) {
        keyClicked("q");
      } else if (e.target.classList.contains("p")) {
        keyClicked("p");
      } else if (e.target.classList.contains("z")) {
        keyClicked("z");
      } else if (e.target.classList.contains("m")) {
        keyClicked("m");
      }
    });

    function keyClicked(key) {
      if (game.alreadyClick === true) {
        return 0;
      }

      if (game.currentChar === key.toUpperCase()) {
        game.score += 1;
        gameElement.style.color = "green";
      } else {
        game.score -= 1;
        gameElement.style.color = "red";
      }

      game.alreadyClick = true;
    }
  } else if (urlPath.includes("leaderboard.html")) {
    leaderboardsRef
      .orderByChild("score")
      .limitToLast(20)
      .on("value", showData, showError);

    function showData(results) {
      let sortable = [];

      for (var items in results.val()) {
        sortable.push(results.val()[items]);
      }

      sortable = sortable.sort(function (a, b) {
        return b.score - a.score;
      });

      loadDataAndInsertToDom(sortable);
    }

    function showError(error) {
      console.log(error);
    }

    function loadDataAndInsertToDom(data) {
      try {
        let highRank = data.slice(0, 3);
        let otherRank = data.slice(3);

        let highRankItemElement = document.querySelectorAll(".high-rank-item");
        highRankItemElement.forEach((item, index) => {
          item.innerHTML = `
            <div class="high-rank-name">
              ${highRank[index].name.slice(0, 16)}${
            highRank[index].name.length > 15 ? "..." : ""
          } #${index + 1}
            </div>
            <div class="high-rank-score">
              Score: ${highRank[index].score}
            </div>
            <div class="high-rank-date">
              Date: ${highRank[index].date}
            </div>
          `;
        });

        otherRank.forEach((item, index) => {
          document.querySelector(".other-rank").innerHTML += `
            <div class="other-rank-item">
              <div class="other-rank-name">
                ${item.name}${item.name.length > 15 ? "..." : ""} #${index + 4}
              </div>
              <div class="other-rank-score">
                Score: ${item.score}
              </div>
              <div class="other-rank-date">
                Date: ${item.date}
              </div>
          </div>
          `;
        });
      } catch (error) {}
    }
  }
});
