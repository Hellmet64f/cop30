document.addEventListener('DOMContentLoaded', () => {
    const trashCountElement = document.getElementById('trash-count');
    const collectTrashBtn = document.getElementById('collect-trash-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let trashCollected = 0;
    const rewardThreshold = 1000;

    // Função para atualizar a pontuação e a barra de progresso
    function updateScore() {
        trashCountElement.textContent = trashCollected;
        const progressPercentage = (trashCollected % rewardThreshold) / rewardThreshold * 100;
        progressBar.style.width = progressPercentage + '%';
        progressText.textContent = (trashCollected % rewardThreshold) + '/' + rewardThreshold;

        if (trashCollected > 0 && trashCollected % rewardThreshold === 0) {
            alert('Parabéns! Você alcançou ' + trashCollected + ' pontos e ganhou uma recompensa!');
        }
    }

    // Simulação de coleta de lixo ao clicar no botão
    collectTrashBtn.addEventListener('click', () => {
        trashCollected++;
        updateScore();
    });

    // Inicializa a pontuação
    updateScore();
});
