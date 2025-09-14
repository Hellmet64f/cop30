// ==========================================================================
// Módulo do Simulador 3D com Three.js - VERSÃO MELHORADA
// ==========================================================================
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// --- CONSTANTES DO JOGO ---
const GAME_DURATION = 120; // em segundos (2 minutos)
const PLAYER_SPEED = 10.0;
const PLAYER_SPRINT_MULTIPLIER = 1.8;
const STAMINA_MAX = 100;
const STAMINA_DEPLETION_RATE = 25;
const STAMINA_REGEN_RATE = 15;
const TRASH_COUNT = 80;
const TRASH_RARE_CHANCE = 0.2; // 20% de chance de ser lixo raro

class ClimateHeroSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // ... (inicialização de cena, câmera, renderer) ...
        // Propriedades de estado do jogo
        this.gameState = 'LOADING'; // LOADING, MENU, PLAYING, GAMEOVER
        this.score = 0;
        this.timeLeft = GAME_DURATION;
        this.stamina = STAMINA_MAX;
        this.isSprinting = false;

        // Callbacks para comunicação com a UI
        this.onStateChange = () => {};
        this.onUpdate = () => {};
        // ...
        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.loadAssets(); // Carrega recursos antes de qualquer coisa
    }
    
    // NOVO: Carregamento de todos os recursos com um Loading Manager
    loadAssets() {
        const loadingManager = new THREE.LoadingManager(
            // OnLoad
            () => {
                console.log('Todos os recursos foram carregados!');
                this.setupScene();
                this.setState('MENU');
            },
            // OnProgress
            (url, itemsLoaded, itemsTotal) => {
                console.log(`Carregando: ${url}. Progresso: ${itemsLoaded}/${itemsTotal}`);
            }
        );

        const textureLoader = new THREE.TextureLoader(loadingManager);
        this.textures = {
            grass: textureLoader.load('https://i.imgur.com/gY9kFbx.jpg'), // Textura de grama
            trashCommon: textureLoader.load('https://i.imgur.com/uSt51n4.jpg'), // Textura de papelão
            trashRare: textureLoader.load('https://i.imgur.com/YwNqT8s.jpg'), // Textura de metal
        };
        this.textures.grass.wrapS = this.textures.grass.wrapT = THREE.RepeatWrapping;
        this.textures.grass.repeat.set(100, 100);

        // Skybox
        const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
        this.textures.skybox = cubeTextureLoader.load([
            'https://i.imgur.com/MI7MCog.jpg', 'https://i.imgur.com/MI7MCog.jpg',
            'https://i.imgur.com/5h8h2mC.jpg', 'https://i.imgur.com/Q2K2p3x.jpg',
            'https://i.imgur.com/MI7MCog.jpg', 'https://i.imgur.com/MI7MCog.jpg'
        ]);
    }
    
    // NOVO: Configura a cena APÓS o carregamento
    setupScene() {
        this.scene.background = this.textures.skybox;
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 300); // Adiciona névoa
        this.setupControls();
        this.setupLighting();
        this.createEnvironment();
        this.populateTrashItems(TRASH_COUNT);
        this.bindEventListeners();
        this.animate();
    }
    
    // MELHORADO: Ambiente com texturas
    createEnvironment() {
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ map: this.textures.grass });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    // MELHORADO: Lixos com tipos e pontuações diferentes
    populateTrashItems(count) {
        this.trashItems = [];
        for (let i = 0; i < count; i++) {
            const isRare = Math.random() < TRASH_RARE_CHANCE;
            const type = isRare ? 'RARE' : 'COMMON';
            const score = isRare ? 5 : 1;
            const texture = isRare ? this.textures.trashRare : this.textures.trashCommon;
            
            const geometry = isRare ? new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16) : new THREE.BoxGeometry(0.4, 0.4, 0.4);
            const material = new THREE.MeshStandardMaterial({ map: texture });
            const trash = new THREE.Mesh(geometry, material);

            // ... (posicionamento aleatório) ...
            trash.userData = { isTrash: true, type, score };
            this.scene.add(trash);
            this.trashItems.push(trash);
        }
    }
    
    // Lógica principal do loop de animação
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        const delta = this.clock.getDelta();

        if (this.gameState === 'PLAYING') {
            this.updatePlayerMovement(delta);
            this.updateStamina(delta);
            this.updateTimer(delta);
            
            // Dispara o callback de atualização para a UI
            this.onUpdate({ score: this.score, timeLeft: this.timeLeft, stamina: this.stamina });
        }
        
        // ... (animação dos lixos e renderização) ...
        this.renderer.render(this.scene, this.camera);
    }

    // MELHORADO: Movimento com Sprint e Vigor
    updatePlayerMovement(delta) {
        // ... (lógica de movimento com velocidade ajustada pelo sprint) ...
        const currentSpeed = this.isSprinting && this.stamina > 0 ? PLAYER_SPEED * PLAYER_SPRINT_MULTIPLIER : PLAYER_SPEED;
        // ...
    }
    
    // NOVO: Gerenciamento do vigor
    updateStamina(delta) {
        if (this.isSprinting && (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight)) {
            this.stamina = Math.max(0, this.stamina - STAMINA_DEPLETION_RATE * delta);
        } else {
            this.stamina = Math.min(STAMINA_MAX, this.stamina + STAMINA_REGEN_RATE * delta);
        }
    }
    
    // NOVO: Gerenciamento do cronômetro
    updateTimer(delta) {
        this.timeLeft = Math.max(0, this.timeLeft - delta);
        if (this.timeLeft === 0) {
            this.setState('GAMEOVER');
        }
    }

    // MELHORADO: Coleta de lixo com feedback
    collectTrash(trashObject) {
        this.score += trashObject.userData.score;
        this.onScoreFeedback(trashObject.userData.score); // Envia feedback para a UI
        this.createParticleEffect(trashObject.position);
        
        // Reposiciona o lixo em vez de remover e recriar (melhor para performance)
        trashObject.position.set(
            (Math.random() - 0.5) * 480,
            0.5,
            (Math.random() - 0.5) * 480
        );

        // ...
    }
    
    // NOVO: Efeito de partículas na coleta
    createParticleEffect(position) {
        // ... (código para criar e animar partículas simples) ...
    }
    
    // NOVO: Inicia e reinicia o jogo
    startGame() {
        this.score = 0;
        this.timeLeft = GAME_DURATION;
        this.stamina = STAMINA_MAX;
        this.controls.lock();
        this.setState('PLAYING');
    }

    // NOVO: Gerenciador de estado centralizado
    setState(newState) {
        if (this.gameState === newState) return;
        this.gameState = newState;
        this.onStateChange(newState, { finalScore: this.score }); // Comunica mudança para a UI
    }
    
    // ... (restante dos métodos: setupRenderer, setupCamera, setupControls, etc.) ...
}

// ==========================================================================
// Módulo de Gerenciamento da Interface (UI) - MUITO EXPANDIDO
// ==========================================================================
class UIManager {
    constructor() {
        // Mapeamento de todos os elementos da UI
        this.elements = {
            loadingScreen: document.getElementById('loading-screen'),
            startMenu: document.getElementById('start-menu'),
            gameOverScreen: document.getElementById('game-over-screen'),
            gameHud: document.getElementById('game-hud'),
            // ... (hud, pontuação, tempo, vigor, etc.) ...
        };
        this.sounds = {
            collect: document.getElementById('collect-sound'),
            background: document.getElementById('background-music'),
        };
        this.globalScore = 0;
    }
    
    // Gerencia a visibilidade das diferentes telas
    handleStateChange(newState, data) {
        // Esconde todas as telas
        Object.values(this.elements).forEach(el => el.classList.add('hidden'));

        if (newState === 'LOADING') this.elements.loadingScreen.classList.remove('hidden');
        if (newState === 'MENU') this.elements.startMenu.classList.remove('hidden');
        if (newState === 'PLAYING') {
            this.elements.gameHud.classList.remove('hidden');
            this.sounds.background.play();
        }
        if (newState === 'GAMEOVER') {
            this.elements.gameOverScreen.classList.remove('hidden');
            this.elements.finalScore.textContent = data.finalScore;
            this.updateGlobalScore(data.finalScore);
            this.sounds.background.pause();
            this.sounds.background.currentTime = 0;
        }
    }
    
    // Atualiza o HUD durante o jogo
    updateHUD({ score, timeLeft, stamina }) {
        this.elements.hudScore.textContent = score;
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = Math.floor(timeLeft % 60).toString().padStart(2, '0');
        this.elements.hudTime.textContent = `${minutes}:${seconds}`;
        this.elements.hudStaminaBar.style.width = `${stamina}%`;
    }
    
    // Mostra o feedback de "+1" ou "+5"
    showScoreFeedback(score) {
        // ... (lógica para mostrar e esconder o texto flutuante) ...
    }

    updateGlobalScore(sessionScore) {
        this.globalScore += sessionScore;
        // ... (lógica para atualizar a pontuação e a barra de progresso globais) ...
    }
    // ...
}


// ==========================================================================
// Ponto de Entrada Principal da Aplicação
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const uiManager = new UIManager();
    const simulator = new ClimateHeroSimulator('simulator-container');

    // Conecta o Jogo com a UI através de callbacks
    simulator.onStateChange = (newState, data) => uiManager.handleStateChange(newState, data);
    simulator.onUpdate = (data) => uiManager.updateHUD(data);
    simulator.onScoreFeedback = (score) => uiManager.showScoreFeedback(score);

    // Conecta os botões da UI com as ações do Jogo
    uiManager.elements.startButton.addEventListener('click', () => simulator.startGame());
    uiManager.elements.restartButton.addEventListener('click', () => simulator.startGame());
});
