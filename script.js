const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Настройки игры
canvas.width = 300;
canvas.height = 500;
let score = 0;

// Игрок
const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 40,
    width: 40,
    height: 20,
    color: 'white',
    speed: 5,
};

// Враги
const enemies = [];
const enemyRows = 4;
const enemyCols = 8;
const enemyWidth = 30;
const enemyHeight = 20;
const enemyPadding = 10;
const enemySpeed = 1;

for (let row = 0; row < enemyRows; row++) {
    for (let col = 0; col < enemyCols; col++) {
        enemies.push({
            x: col * (enemyWidth + enemyPadding) + enemyPadding,
            y: row * (enemyHeight + enemyPadding) + enemyPadding,
            width: enemyWidth,
            height: enemyHeight,
            color: 'red',
        });
    }
}

// Пули
const bullets = [];
const bulletSpeed = 7;

// Управление игроком
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (e.key === ' ') {
        bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10, color: 'yellow' });
    }
});

// Отрисовка объектов
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Обновление игры
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;

        // Удаление пули, если она вышла за пределы экрана
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Удаление врага и пули
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                document.getElementById('score').innerText = `Score: ${score}`;
            }
        });
    });
}

function updateEnemies() {
    enemies.forEach((enemy) => {
        enemy.y += enemySpeed;

        // Если враг достиг нижней границы, игра заканчивается
        if (enemy.y + enemy.height >= canvas.height) {
            alert('Game Over!');
            window.location.reload();
        }
    });
}

// Основной игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawEnemies();
    drawBullets();

    updateBullets();
    checkCollisions();
    updateEnemies();

    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();
