// ==========================================================================
// Módulo do Simulador 3D com Three.js
// ==========================================================================
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class ClimateHeroSimulator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container do simulador não encontrado!');
            return;
        }

        // Configurações básicas da cena
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        this.setupRenderer();
        this.setupCamera();
        this.setupControls();
        this.setupLighting();
        this.createEnvironment();
        this.populateTrashItems(50); // Adiciona 50 itens de lixo

        // Gerenciamento do estado do jogo
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.trashItems = [];
        this.score = 0;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.clock = new THREE.Clock();
        
        // Callbacks
        this.onScoreUpdate = () => {};

        // Bind de eventos e início do loop
        this.bindEventListeners();
        this.animate();
    }

    // Configuração do renderizador
    setupRenderer() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    // Configuração da câmera
    setupCamera() {
        this.camera.position.y = 1.8; // Altura de uma pessoa
    }

    // Configuração dos controles (visão em primeira pessoa)
    setupControls() {
        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.container.addEventListener('click', () => {
            this.controls.lock();
        });
        this.scene.add(this.controls.getObject());
    }

    // Configuração da iluminação da cena
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }
    
    // Criação do ambiente (chão, céu, etc.)
    createEnvironment() {
        // Céu
        this.scene.background = new THREE.Color(0x87CEEB);

        // Chão
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Verde grama
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // "Muros" para delimitar a área
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, transparent: true, opacity: 0.3 });
        const wallGeometry = new THREE.BoxGeometry(500, 20, 1);
        
        const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall1.position.z = -250;
        this.scene.add(wall1);

        const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall2.position.z = 250;
        this.scene.add(wall2);
        
        const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall3.rotation.y = Math.PI / 2;
        wall3.position.x = -250;
        this.scene.add(wall3);

        const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
        wall4.rotation.y = Math.PI / 2;
        wall4.position.x = 250;
        this.scene.add(wall4);
    }

    // Cria e posiciona os itens de lixo na cena
    populateTrashItems(count) {
        const trashGeometries = [
            new THREE.BoxGeometry(0.3, 0.5, 0.2), // Caixa
            new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16), // Lata
            new THREE.SphereGeometry(0.2, 16, 16) // Papel amassado
        ];
        const trashMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x8B4513 }), // Marrom
            new THREE.MeshStandardMaterial({ color: 0xC0C0C0 }), // Prata
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF })  // Branco
        ];

        for (let i = 0; i < count; i++) {
            const geoIndex = Math.floor(Math.random() * trashGeometries.length);
            const trash = new THREE.Mesh(trashGeometries[geoIndex], trashMaterials[geoIndex]);
            
            trash.position.x = (Math.random() - 0.5) * 480;
            trash.position.z = (Math.random() - 0.5) * 480;
            trash.position.y = 0.5; // Um pouco acima do chão
            
            trash.castShadow = true;
            trash.userData.isTrash = true; // Identificador
            
            this.scene.add(trash);
            this.trashItems.push(trash);
        }
    }

    // Loop de animação
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();

        if (this.controls.isLocked === true) {
            this.updatePlayerMovement(delta);
        }
        
        // Animação sutil dos lixos
        this.trashItems.forEach(item => {
            if (item.parent) { // Se ainda não foi removido
                item.rotation.y += 0.005;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
    
    // Atualiza o movimento do jogador
    updatePlayerMovement(delta) {
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;

        this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
        this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
        this.direction.normalize();

        if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 40.0 * delta;
        if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 40.0 * delta;

        this.controls.moveRight(-this.velocity.x * delta);
        this.controls.moveForward(-this.velocity.z * delta);
    }
    
    // Gerenciamento de eventos
    bindEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        this.container.addEventListener('click', this.onClick.bind(this));
    }
    
    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    onKeyDown(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false;
                break;
        }
    }
    
    onClick() {
        if (!this.controls.isLocked) return;

        this.pointer.x = 0;
        this.pointer.y = 0;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        for (const intersect of intersects) {
            if (intersect.object.userData.isTrash && intersect.distance < 5) { // Coleta se estiver perto
                this.collectTrash(intersect.object);
                break;
            }
        }
    }
    
    // Lógica para coletar o lixo
    collectTrash(trashObject) {
        this.scene.remove(trashObject);
        this.trashItems = this.trashItems.filter(item => item !== trashObject);
        
        this.score++;
        if (this.onScoreUpdate) {
            this.onScoreUpdate(this.score);
        }
        
        // Efeito sonoro simples (requer um arquivo de áudio)
        // const audio = new Audio('path/to/collect.mp3');
        // audio.play();
    }

    // Registra uma função de callback para atualização de pontuação
    onScoreUpdate(callback) {
        this.onScoreUpdate = callback;
    }
}


// ==========================================================================
// Módulo de Gerenciamento da Interface do Usuário (UI)
// ==========================================================================
class UIManager {
    constructor() {
        this.scoreElement = document.getElementById('score-value');
        this.progressBarElement = document.getElementById('progress-bar');
        this.progressTextElement = document.getElementById('progress-text');
        this.redeemButton = document.getElementById('redeem-button');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.sections = document.querySelectorAll('.content-section, .simulator-section, .content-section-dark');
        
        this.rewardThreshold = 1000;
        this.bindUIEventListeners();
        this.setupIntersectionObserver();
    }

    updateScore(newScore) {
        this.scoreElement.textContent = newScore;
        this.updateProgressBar(newScore);
        this.checkRedeemButton(newScore);
    }
    
    updateProgressBar(score) {
        const progress = (score % this.rewardThreshold) / this.rewardThreshold * 100;
        this.progressBarElement.style.width = `${progress}%`;
        this.progressTextElement.textContent = `${score % this.rewardThreshold} / ${this.rewardThreshold}`;
    }

    checkRedeemButton(score) {
        if (score >= this.rewardThreshold) {
            this.redeemButton.disabled = false;
            this.redeemButton.textContent = `Resgatar Recompensa (${Math.floor(score / this.rewardThreshold)})`;
        } else {
            this.redeemButton.disabled = true;
            this.redeemButton.textContent = 'Resgatar Recompensa';
        }
    }
    
    bindUIEventListeners() {
        // Lógica do Acordeão do FAQ
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                this.faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Lógica do botão de resgate
        this.redeemButton.addEventListener('click', () => {
            if (!this.redeemButton.disabled) {
                alert("Parabéns! Você resgatou uma recompensa. Um voucher será enviado para seu email cadastrado. (Funcionalidade de exemplo)");
                // Aqui iria a lógica para diminuir a pontuação e desabilitar o botão se necessário
            }
        });
    }

    // Observer para animar seções ao rolar a página
    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}


// ==========================================================================
// Ponto de Entrada Principal da Aplicação
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const uiManager = new UIManager();
    const simulator = new ClimateHeroSimulator('simulator-container');

    // Conecta o simulador à UI
    simulator.onScoreUpdate((newScore) => {
        uiManager.updateScore(newScore);
    });
});
