// Game State
let currentDifficulty = 'easy';
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
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random movement
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

// Setup Difficulty Buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        e.target.classList.add('selected');
        currentDifficulty = e.target.dataset.difficulty;
        createParticles(10);
    });
});

// Setup Choice Buttons
document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!isPlaying) {
            play(e.target.dataset.choice);
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

// Main Game Logic
async function play(choice) {
    if (isPlaying) return;
    isPlaying = true;

    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    const formData = new FormData();
    formData.append('player_choice', choice);
    formData.append('difficulty', currentDifficulty);

    try {
        const response = await fetch('/play', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        loadingDiv.style.display = 'none';

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

    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p style="color: var(--error-color)">System Error! Retry!</p>';
        loadingDiv.style.display = 'none';
    }

    isPlaying = false;
}


