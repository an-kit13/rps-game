let playerScore = 0;
let computerScore = 0;
let isPlaying = false;

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    createParticles(20);
});

// Particle Effect System
function createParticles(count) {
    const particles = document.getElementById('particles');
    particles.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            animation: particleAnimation 1s ease-out forwards;
        `;
        
        particles.appendChild(particle);
    }
}

// Setup Choice Buttons
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        if (!isPlaying) {
            await play(e.target.dataset.choice);
            createParticles(5);
        }
    });
});

// Emoji Helper
function getEmoji(choice) {
    const emojis = {
        'rock': '✊',
        'paper': '✋',
        'scissors': '✌️'
    };
    return emojis[choice] || '';
}

// Show Error Message
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div class="error-message" style="color: var(--error-color)">
            <p>🚫 ${message}</p>
            <p>Please try again!</p>
        </div>
    `;
}

// Update Game UI
function updateGameUI(data) {
    const resultDiv = document.getElementById('result');
    
    let resultHTML = `
        <div class="emoji" style="opacity: 0; transition: opacity 0.5s;">
            ${getEmoji(data.player_choice)} vs ${getEmoji(data.computer_choice)}
        </div>
    `;

    if (data.result === 'player') {
        playerScore++;
        resultHTML += '<p style="color: var(--success-color)">Victory! 🎉</p>';
        createParticles(30);
    } else if (data.result === 'computer') {
        computerScore++;
        resultHTML += '<p style="color: var(--error-color)">Defeated! 💻</p>';
    } else {
        resultHTML += '<p style="color: var(--text-secondary)">Draw! 🤝</p>';
    }

    resultDiv.innerHTML = resultHTML;
    resultDiv.classList.add('winner-animation');
    
    setTimeout(() => {
        resultDiv.querySelector('.emoji').style.opacity = '1';
        resultDiv.classList.remove('winner-animation');
    }, 100);

    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Main Game Logic
async function play(choice) {
    if (isPlaying) return;
    isPlaying = true;

    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    
    try {
        loadingDiv.style.display = 'block';
        resultDiv.innerHTML = '';

        const formData = new FormData();
        formData.append('player_choice', choice);

        const response = await fetch('/play', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong!');
        }

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        updateGameUI(data);

    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Connection error! Please try again.');
    } finally {
        loadingDiv.style.display = 'none';
        isPlaying = false;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    // Reset scores
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
});
