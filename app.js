const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $clickCountValue = document.querySelector('#clickCountValue');

let maxClicks = 1000;
let clickCooldown = 3000; // Время в миллисекундах до восстановления одного клика
let restoreClicksInterval = 2500; // Интервал времени для восстановления кликов

function start() {
  setScore(getScore());
  setImage();
  updateClickCount(maxClicks);
  setInterval(restoreClicks, restoreClicksInterval);
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = score;
}

function setImage() {
  const score = getScore();
  if (score >= 6500) {
    $circle.setAttribute('src', './assets/Hovo4.jpg'); // Пример: измените имя файла на нужное изображение
  } else if (score >= 3500) {
    $circle.setAttribute('src', './assets/Hovo3.jpg');
  } else if (score >= 1500) {
    $circle.setAttribute('src', './assets/Hovo2.jpg');
  } else if (score >= 500) {
    $circle.setAttribute('src', './assets/Hovo1.jpg'); // Пример: измените имя файла на нужное изображение
  }
}

function getScore() {
  return Number(localStorage.getItem('score')) ?? 0;
}

function addOne() {
  if (maxClicks > 0) {
    setScore(getScore() + 10); // Увеличение счета на 1
    setImage();
    maxClicks-= 0; // Уменьшение количества кликов на 1
    if (maxClicks < 0) maxClicks = 0; // Убедимся, что maxClicks не меньше нуля
    updateClickCount(maxClicks);
  }
}

function updateClickCount(count) {
  $clickCountValue.textContent = count;
}

function restoreClicks() {
  if (maxClicks < 1000) {
    maxClicks++;
    updateClickCount(maxClicks);
  }
}

$circle.addEventListener('click', (event) => {
  if (maxClicks > 0) {
    const rect = $circle.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const DEG = 40;

    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG;

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
      $circle.style.setProperty('--tiltX', `0deg`);
      $circle.style.setProperty('--tiltY', `0deg`);
    }, 300);

    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one');
    plusOne.textContent = '+10';
    plusOne.style.left = `${event.clientX - rect.left}px`;
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentElement.appendChild(plusOne);

    addOne();

    setTimeout(() => {
      plusOne.remove();
    }, 2000);
  }
});

start();
