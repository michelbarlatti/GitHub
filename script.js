/**
 * script.js
 * JavaScript para gerenciar a visibilidade das seções (conforme o mockup) e o Deep Linking,
 * e adicionar controle de Menu Overlay de Tela Cheia, com botões de navegação flutuantes.
 */

const sections = document.querySelectorAll('main section');
// Cria um array de IDs de seção na ordem em que aparecem no DOM
const sectionIds = Array.from(sections).map(section => `#${section.id}`);
const video = document.getElementById('video-apresentacao');
const navLinks = document.querySelectorAll('#full-menu-overlay ul a, footer a'); // Links do overlay e footer
let activeSection = null; 
let currentSectionIndex = -1; // Índice da seção atualmente visível

const menuOverlay = document.getElementById('full-menu-overlay');
const menuToggle = document.getElementById('menu-toggle');
const closeMenuButton = document.getElementById('close-menu');

// Botões Flutuantes
const prevButton = document.getElementById('prev-section-btn');
const nextButton = document.getElementById('next-section-btn');


/**
 * Atualiza o estado de visibilidade dos botões Anterior/Próximo
 */
function updateFloatingNav() {
    // Esconde o botão 'Anterior' se for a primeira seção
    if (currentSectionIndex <= 0) {
        prevButton.classList.add('hidden');
    } else {
        prevButton.classList.remove('hidden');
    }

    // Esconde o botão 'Próximo' se for a última seção
    if (currentSectionIndex >= sections.length - 1) {
        nextButton.classList.add('hidden');
    } else {
        nextButton.classList.remove('hidden');
    }
}


/**
 * Alterna o estado de aberto/fechado do menu overlay.
 * Atualiza ARIA-EXPANDED.
 * @param {boolean} forceState - Opcional. true para abrir, false para fechar.
 */
function toggleMenu(forceState) {
    const isOpen = forceState !== undefined ? forceState : !menuOverlay.classList.contains('menu-dropdown-open');

    if (isOpen) {
        menuOverlay.classList.add('menu-dropdown-open');
        document.body.style.overflow = 'hidden'; 
        
        // Acessibilidade: Indica que o menu está aberto
        if (menuToggle) {
             menuToggle.setAttribute('aria-expanded', 'true');
        }
    } else {
        menuOverlay.classList.remove('menu-dropdown-open');
        document.body.style.overflow = ''; 
        
        // Acessibilidade: Indica que o menu está fechado
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

/**
 * Define a velocidade de reprodução do vídeo para 50% (câmera lenta).
 */
function setSlowMotion() {
    if (video) {
        video.playbackRate = 0.5;
        video.muted = true; 
        console.log("Velocidade do vídeo ajustada para 50% (câmera lenta) e Muted.");
    }
}

/**
 * Função principal para exibir a seção selecionada e atualizar a navegação.
 * @param {string} targetId - O ID da seção a ser exibida (ex: '#inicio').
 * @param {boolean} updateHistory - Se deve atualizar o hash da URL no histórico.
 */
function showSection(targetId, updateHistory = true) {
    const newSection = document.querySelector(targetId);

    if (newSection) {
        // 1. Oculta todas as seções
        sections.forEach(section => {
            section.classList.remove('visible');
        });

        // 2. Exibe a nova seção
        newSection.classList.add('visible');
        activeSection = newSection; 
        currentSectionIndex = sectionIds.indexOf(targetId); // Atualiza o índice

        // 3. Atualiza o hash da URL (Deep Linking)
        if (updateHistory) {
             history.pushState(null, null, targetId);
        }
        
        // 4. Atualiza os botões flutuantes
        updateFloatingNav();
    }

    // 5. Atualiza o estado 'active' nos links
    navLinks.forEach(link => {
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Funções de navegação Anterior/Próximo
 */
function goToNextSection() {
    if (currentSectionIndex < sections.length - 1) {
        const nextId = sectionIds[currentSectionIndex + 1];
        showSection(nextId, true);
        window.location.hash = nextId; // Força o smooth scroll
    }
}

function goToPrevSection() {
    if (currentSectionIndex > 0) {
        const prevId = sectionIds[currentSectionIndex - 1];
        showSection(prevId, true);
        window.location.hash = prevId; // Força o smooth scroll
    }
}


// --- EVENT LISTENERS ---

// 1. Links de Navegação (Menu e Footer)
navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        showSection(targetId, true);
        toggleMenu(false); // Fecha o menu
        
        // Força o scroll suave para a seção correta 
        const newSection = document.querySelector(targetId);
        if (newSection) {
            window.location.hash = targetId; 
        }
    });
});

// 2. Botões de Menu Overlay
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        toggleMenu(true); 
    });
}

if (closeMenuButton) {
    closeMenuButton.addEventListener('click', function() {
        toggleMenu(false);
    });
}

// 3. Botões Flutuantes (Anterior/Próximo)
if (nextButton) {
    nextButton.addEventListener('click', goToNextSection);
}

if (prevButton) {
    prevButton.addEventListener('click', goToPrevSection);
}


// 4. Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log("Página Carregada. Semântica, Acessibilidade e Navegação Flutuante implementadas.");
    
    setSlowMotion(); 

    const initialHash = window.location.hash || '#inicio';
    
    // Configuração inicial para garantir que o scroll funcione
    history.replaceState(null, null, ' ');
    showSection(initialHash, false);
    
    // Força o scroll para a seção inicial após o carregamento
    setTimeout(() => {
        window.location.hash = initialHash;
    }, 100); 
});

// 5. Histórico do Navegador
window.addEventListener('popstate', function(e) {
    const hash = window.location.hash || '#inicio';
    showSection(hash, false);
});