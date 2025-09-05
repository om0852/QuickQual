"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function FlappyBird() {
  const router = useRouter();
  const canvasRef = useRef(null);

  const [circleScore, setCircleScore] = useState(0);
  const [flappyScore, setFlappyScore] = useState(0);
  const [circlePosition, setCirclePosition] = useState({ x: 100, y: 100 });
  const [showCircle, setShowCircle] = useState(false);
  const [timer, setTimer] = useState(300); // 5 min = 300 seconds
  const [username] = useState("guest");
  const [circleStreak, setCircleStreak] = useState(1);
  const [streakStatus, setStreakStatus] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  // total score
  const totalScore = circleScore + flappyScore;
  const timeoutRef = useRef(null);
  // -------- Circle Spawn --------
  const generateRandomPosition = () => {
    const side = Math.random() < 0.5 ? "left" : "right";
    const x =
      side === "left"
        ? Math.random() * (window.innerWidth * 0.25) + 20
        : Math.random() * (window.innerWidth * 0.25) +
          window.innerWidth * 0.75 -
          20;
    const y = Math.random() * (window.innerHeight - 100) + 50;
    return { x, y };
  };

  const showRandomCircle = () => {
    const newPosition = generateRandomPosition();
    setCirclePosition(newPosition);
    setShowCircle(true);

    // Hide circle after 1.5 sec
    timeoutRef.current = setTimeout(() => {
      setShowCircle(false);
      setCircleStreak(1); // ❌ missed → reset streak
    }, 1500);
  };

  // Circles appear every 10s
  useEffect(() => {
    const interval = setInterval(showRandomCircle, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCircleClick = () => {
    setCircleScore((prev) => prev + circleStreak); // ✅ add streak value
    setCircleStreak((prev) => {
      const newStreak = prev + 1;
      if (newStreak > 5) {
        setShowStreakAnimation(true);
        setTimeout(() => setShowStreakAnimation(false), 2000);
        return 1; // Reset to 1 when streak reaches 5
      }
      return newStreak;
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setShowCircle(false); // remove circle after click
    }
  };

  // -------- Timer + Storage --------
  useEffect(() => {
    // Load from localStorage
    const saved = JSON.parse(localStorage.getItem("flappyGameSave"));
    if (saved) {
      setCircleScore(saved.circleScore || 0);
      setFlappyScore(saved.flappyScore || 0);

      const endTime = saved.endTime;
      const now = Math.floor(Date.now() / 1000);
      const remaining = endTime - now;
      setTimer(remaining > 0 ? remaining : 0);
    } else {
      // First time → set 5 min from now
      const endTime = Math.floor(Date.now() / 1000) + 300;
      localStorage.setItem(
        "flappyGameSave",
        JSON.stringify({
          circleScore: 0,
          flappyScore: 0,
          endTime,
        })
      );
      setTimer(300);
    }
  }, []);

  // countdown
  useEffect(() => {
    if (timer <= 0) {
      router.push("/gameover");
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // save progress
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("flappyGameSave")) || {};
    localStorage.setItem(
      "flappyGameSave",
      JSON.stringify({
        ...saved,
        circleScore,
        flappyScore,
      })
    );
  }, [circleScore, flappyScore]);

  // -------- Game Setup --------
  useEffect(() => {
    const scrn = canvasRef.current;
    const sctx = scrn.getContext("2d");
    scrn.tabIndex = 1;

    let frames = 0;
    let dx = 2;
    const RAD = Math.PI / 180;

    const state = {
      curr: 0,
      getReady: 0,
      Play: 1,
      gameOver: 2,
    };

    const SFX = {
      start: new Audio("/sfx/start.wav"),
      flap: new Audio("/sfx/flap.wav"),
      score: new Audio("/sfx/score.wav"),
      hit: new Audio("/sfx/hit.wav"),
      die: new Audio("/sfx/die.wav"),
      played: false,
    };

    const gnd = {
      sprite: new Image(),
      x: 0,
      y: 0,
      draw: function () {
        this.y = scrn.height - this.sprite.height;
        sctx.drawImage(this.sprite, this.x, this.y);
      },
      update: function () {
        if (state.curr !== state.Play) return;
        // this.x -= dx;
        this.x = this.x % (this.sprite.width );
      },
    };

    const bg = {
      sprite: new Image(),
      x: 0,
      y: 0,
      width: 1000,   // sprite width
      height: 226,  // sprite height
      draw: function (ctx, canvas) {
        // Repeat background until it covers canvas width
       sctx.drawImage(this.sprite, this.x , this.y+280, this.width, this.height);
        
      },
    };

    const pipe = {
      top: { sprite: new Image() },
      bot: { sprite: new Image() },
      gap: 120, // gap between pipes (was 85 → easier now)
      moved: true,
      pipes: [],
      draw: function () {
        for (let i = 0; i < this.pipes.length; i++) {
          let p = this.pipes[i];
          sctx.drawImage(this.top.sprite, p.x, p.y);
          sctx.drawImage(
            this.bot.sprite,
            p.x,
            p.y + this.top.sprite.height + this.gap
          );
        }
      },
      update: function () {
        if (state.curr !== state.Play) return;
        // spawn pipes slower → increase distance
        if (frames % 150 === 0) {
          this.pipes.push({
            x: scrn.width,
            y: -210 * Math.min(Math.random() + 1, 1.8),
          });
        }
        this.pipes.forEach((pipe) => {
          pipe.x -= dx;
        });
        if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
          this.pipes.shift();
          this.moved = true;
        }
      },
    };

    const bird = {
      animations: [
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
      ],
      rotatation: 0,
      x: 50,
      y: 100,
      speed: 0,
      gravity: 0.125,
      thrust: 3.6,
      frame: 0,
      draw: function () {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x, this.y);
        sctx.rotate(this.rotatation * RAD);
        sctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
        sctx.restore();
      },
      update: function () {
        let r = this.animations[0].sprite.width / 2;
        switch (state.curr) {
          case state.getReady:
            this.rotatation = 0;
            this.y += frames % 10 === 0 ? Math.sin(frames * RAD) : 0;
            this.frame += frames % 10 === 0 ? 1 : 0;
            break;
          case state.Play:
            this.frame += frames % 5 === 0 ? 1 : 0;
            this.y += this.speed;
            this.setRotation();
            this.speed += this.gravity;
            if (this.y + r >= gnd.y || this.collisioned()) {
              state.curr = state.gameOver;
              if (setFlappyScore) {
                // setFlappyScore((prev) => Math.max(0, prev - 2));
              }
            }
            break;
          case state.gameOver:
            this.frame = 1;
            if (this.y + r < gnd.y) {
              this.y += this.speed;
              this.setRotation();
              this.speed += this.gravity * 2;
            } else {
              this.speed = 0;
              this.y = gnd.y - r;
              this.rotatation = 90;
              if (!SFX.played) {
                SFX.die.play();
                SFX.played = true;
              }
            }
            break;
        }
        this.frame = this.frame % this.animations.length;
      },
      flap: function () {
        if (this.y > 0) {
          SFX.flap.play();
          this.speed = -this.thrust;
        }
      },
      setRotation: function () {
        if (this.speed <= 0) {
          this.rotatation = Math.max(
            -25,
            (-25 * this.speed) / (-1 * this.thrust)
          );
        } else if (this.speed > 0) {
          this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
        }
      },
      collisioned: function () {
        if (!pipe.pipes.length) return;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height / 4 + bird.width / 4;
        let roof = y + pipe.top.sprite.height;
        let floor = roof + pipe.gap;
        let w = pipe.top.sprite.width;
        if (this.x + r >= x) {
          if (this.x + r < x + w) {
            if (this.y - r <= roof || this.y + r >= floor) {
              SFX.hit.play();
              return true;
            }
          } else if (pipe.moved) {
            SFX.score.play();
            setFlappyScore((prev) => prev + 1);
            pipe.moved = false;
          }
        }
      },
    };

    // UI
    const UI = {
      getReady: { sprite: new Image() },
      gameOver: { sprite: new Image() },
      draw: function () {
        if (state.curr === state.getReady) {
          sctx.drawImage(this.getReady.sprite, 100, 200);
        } else if (state.curr === state.gameOver) {
          sctx.drawImage(this.gameOver.sprite, 100, 200);
        }
      },
    };

    // Load sprites
    gnd.sprite.src = "/img/ground.png";
    bg.sprite.src = "/img/BG.png";
    pipe.top.sprite.src = "/img/toppipe.png";
    pipe.bot.sprite.src = "/img/botpipe.png";
    UI.gameOver.sprite.src = "/img/go.png";
    UI.getReady.sprite.src = "/img/getready.png";
    bird.animations[0].sprite.src = "/img/bird/b0.png";
    bird.animations[1].sprite.src = "/img/bird/b1.png";
    bird.animations[2].sprite.src = "/img/bird/b2.png";
    bird.animations[3].sprite.src = "/img/bird/b0.png";

    // Keyboard controls
    function handleKeyDown(e) {
      if (timer <= 0) return; // disable if timer ended
      if (e.keyCode === 32 || e.keyCode === 87 || e.keyCode === 38) {
        switch (state.curr) {
          case state.getReady:
            state.curr = state.Play;
            break;
          case state.Play:
            bird.flap();
            break;
          case state.gameOver:
            state.curr = state.getReady;
            bird.speed = 0;
            bird.y = 100;
            pipe.pipes = [];
            // setFlappyScore(0);
            break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    function gameLoop() {
      update();
      draw();
      frames++;
      requestAnimationFrame(gameLoop);
    }

    function update() {
      bird.update();
      gnd.update();
      pipe.update();
    }

    function draw() {
      sctx.fillStyle = "#30c0df";
      sctx.fillRect(0, 0, scrn.width, scrn.height);
      bg.draw();
      pipe.draw();
      bird.draw();
      gnd.draw();
      UI.draw();
    }

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // format mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500">
      {/* Animated Clouds Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
      </div>

      {/* Score + Timer Display */}
      <div className="absolute top-6 left-6 z-20">
        <div className="score-card rounded-2xl p-4">
          <div className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {totalScore}
          </div>
          <div className="flex gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-semibold">Flappy: {flappyScore}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold">Circles: {circleScore}</span>
            </div>
          </div>
          <div className={`bg-red-100 border-2 border-red-300 rounded-lg px-3 py-1 text-center ${timer < 60 ? 'timer-warning' : ''}`}>
            <div className="text-red-600 font-mono text-lg font-bold">
              ⏰ {formatTime(timer)}
            </div>
          </div>
        </div>
      </div>

      {/* Circle */}
      {showCircle && circleScore <= 20 && (
        <div
          className="absolute w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-orange-400 rounded-full cursor-pointer flex items-center justify-center text-black font-bold text-lg z-[100] shadow-2xl animate-bounce"
          style={{
            left: `${circlePosition.x}px`,
            top: `${circlePosition.y}px`,
            boxShadow: '0 0 20px rgba(255, 193, 7, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
          }}
          onClick={handleCircleClick}
        >
          <div className="text-center">
            <div className="text-xs">+{circleStreak}</div>
            <div className="text-xs">⭐</div>
          </div>
        </div>
      )}

      {/* Game Canvas Container */}
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl"></div>
          <canvas
            ref={canvasRef}
            id="canvas"
            width={400}
            height={600}
            className="relative z-10 rounded-2xl shadow-xl"
            style={{ border: "4px solid #fbbf24" }}
          />
        </div>
      </div>

      {/* Floating Score Animation */}
      {showStreakAnimation && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="text-6xl font-bold text-yellow-400 animate-ping">
            STREAK RESET!
          </div>
        </div>
      )}

      {/* Streak Indicator */}
      {circleStreak > 1 && !showStreakAnimation && (
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg animate-pulse">
            🔥 STREAK x{circleStreak}
          </div>
        </div>
      )}
    </div>
  );
}
