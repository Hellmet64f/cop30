// game.js

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const gameContainer = document.getElementById('game-container');
    const scoreBoard = document.getElementById('score-board');
    
    let score = 0;
    // URLs das imagens dos lixos (PNGs transparentes)
    const trashImages = [
        'https://i.ibb.co/3m1R0B6/bottle.png', 
        'https://i.ibb.co/L5BZy5K/can.png', 
        'https://i.ibb.co/yQxG4St/plastic-bag.png'
    ];
    let gameInterval = null;

    function startGame() {
        score = 0;
        updateScore();
        gameContainer.querySelectorAll('.trash-item').forEach(trash => trash.remove());
        
        startButton.style.display = 'none';

        gameInterval = setInterval(createTrash, 1000); // Gera lixo a cada 1 segundo

        setTimeout(endGame, 30000); // O jogo dura 30 segundos
    }

    function endGame() {
        clearInterval(gameInterval);
        alert(`Tempo esgotado! Sua pontuação final foi: ${score}`);
        startButton.style.display = 'inline-block';
    }

    function createTrash() {
        if (document.hidden) return; // Pausa o jogo se a aba não estiver ativa

        const trash = document.createElement('img');
        trash.classList.add('trash-item');
        
        const randomTrashImage = trashImages[Math.floor(Math.random() * trashImages.length)];
        trash.src = randomTrashImage;

        const gameHeight = gameContainer.clientHeight;
        const groundHeight = 100;
        const availableHeight = gameHeight - groundHeight - 50; // 50 é o tamanho do lixo

        trash.style.top = `${Math.random() * availableHeight}px`;
        trash.style.left = `${Math.random() * (gameContainer.clientWidth - 50)}px`;

        trash.addEventListener('click', () => {
            score++;
            updateScore();
            trash.remove();
        }, { once: true }); // O evento só pode ser disparado uma vez por lixo

        gameContainer.appendChild(trash);

        // O lixo desaparece sozinho depois de um tempo para não poluir a tela
        setTimeout(() => {
            trash.remove();
        }, 4000);
    }

    function updateScore() {
        scoreBoard.textContent = `Pontos: ${score}`;
    }

    startButton.addEventListener('click', startGame);
});

