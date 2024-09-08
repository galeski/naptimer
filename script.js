const TimerModule = (function () {
  let instance = null;

  // TODO:
  // try to actually use an event handler
  // and manager state of the Timer object better
  // or somehow add an alarm (as a class?)

  class Timer {
    constructor(sleepTime) {
      if (Timer._instance) {
        console.log("only single instance allowed");
        return;
      }
      // timer._instance = this;

      this.sleepTime = sleepTime;
      this.startTime = new Date();
      this.isRunning = false;
      this.timeLeft = this.sleepTime;
    }

    updateTime() {
      if (this.isRunning) {
        const currentTime = new Date();
        const elapsedTime = (currentTime - this.startTime) / 1000; // to sec
        this.timeLeft = Math.ceil(Math.max(0, this.sleepTime - elapsedTime));
      }
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.startTime = new Date();
      }
    }

    stop() {
      if (this.isRunning) {
        this.updateTime();
        this.isRunning = false;
      }
    }

    reset(newSleepTime) {
      this.stop();
      this.sleepTime = newSleepTime || this.sleepTime;
      this.timeLeft = this.sleepTime;
      this.startTime = new Date();
    }
  }

  return {
    getInstance: function (sleepTime) {
      if (!instance) {
        instance = new Timer(sleepTime);
      }
      return instance;
    },
  };
})();

// TODO: Is the name createTimer descriptive enough?
function createTimer(sleepTime) {
  const timer = TimerModule.getInstance(sleepTime);

  if (sleepTime !== undefined && sleepTime !== timer.sleepTime) {
    timer.reset(sleepTime);
  }

  return timer;
}

function startAlarm(arg) {
  const sleepTime = Number(arg.textContent) * 60;
  const currentTime = document.getElementById("current-time");
  const timer = createTimer(sleepTime);

  timer.start();

  setInterval(() => {
    timer.updateTime();
    currentTime.innerHTML = timer.timeLeft;

    console.log("running");

    // Check if the timer has finished
    if (timer.timeLeft <= 0) {
      timer.stop();

      // LOGIC TO SOUND THE ALARM
      createAlarm();

      console.log("Timer finished!");
    }
  }, 1000);
}

function stopAlarm() {
  const instance = TimerModule.getInstance();

  instance.stop();
}

// courtesy of gpt
function handleColorSchemeChange() {
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function updateColorScheme(e) {
    if (e.matches) {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }

  // Initial call
  updateColorScheme(colorScheme);

  // Listen for changes
  colorScheme.addEventListener("DOMContentLoaded", updateColorScheme);
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", handleColorSchemeChange);

function createAlarm(stopPlaying = false) {
  if (!stopPlaying) {
    let sound = new Howl({
      src: [
        "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
      ],
      volume: 0.5,
      onend: function () {
        console.log("Loop finished");
      },
    });

    sound.play();
  } else return "stopped playing";
}
