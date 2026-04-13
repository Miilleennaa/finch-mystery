const suspects = {
    england: {
        id: 'england',
        name: 'Mr. John',
        regionName: 'England',
        tradition: 'Gloucester Rolling',
        traditionDesc: 'The annual Cooper\'s Hill competition in Gloucester. Participants chase a round type of food that can reach 100 km per hour.',
        motive: 'Mr. Finch mocked this tradition and used this food for his breakfast, which caused great indignation.',
        evidenceRiddle: 'What product is used during this competition?',
        riddleAnswer: 'cheese',
        secret: 'A half-eaten wheel of Double Gloucester cheese was found near the crime scene. Mr. John admitted he brought it, but claimed it was for a celebration.',
        alibi: 'He was at a pub in Gloucester, but witnesses saw him leave for an hour.',
        flower: 'Tudor Rose'
    },
    scotland: {
        id: 'scotland',
        name: 'Mr. Augustus',
        regionName: 'Scotland',
        tradition: 'Poet Night',
        traditionDesc: 'January 25th is a national holiday celebrating the most famous Scottish poet. Festivities include poetry, songs, haggis, and whisky.',
        motive: 'Sir Finch mixed up lines of a poem of this poet "To a Mouse".',
        evidenceRiddle: 'What is the name of this Scottish poet?',
        riddleAnswer: 'Robert Burns',
        secret: 'A crumpled page with misquoted Burns verses was found in Mr. Finch\'s pocket. Sir Augustus was seen arguing about poetry that night.',
        alibi: 'He recited poems at a Burns supper but slipped out during the toast.',
        flower: 'Thistle'
    },
    wales: {
        id: 'wales',
        name: 'Mr. Dylan',
        regionName: 'Wales',
        tradition: 'Love gift',
        traditionDesc: 'For centuries, Welsh men have been carving wooden objects as symbols of love and affection for their beloved.',
        motive: 'Mr. Finch used this object as an ordinary eating utensil, deeply offending Mr. Dylan.',
        evidenceRiddle: 'What do men in Wales give to their beloved girls?',
        riddleAnswer: 'spoon',
        secret: 'A beautifully carved love spoon with a cracked handle was discovered in the rubbish. Mr. Dylan admits he made it but says it was defiled.',
        alibi: 'He attended a Eisteddfod poetry festival, but took a long walk alone.',
        flower: 'Daffodil'
    },
    northernireland: {
        id: 'northernireland',
        name: 'Mr. Cormac',
        regionName: 'Northern Ireland',
        tradition: 'St. Patrick\'s Day',
        traditionDesc: 'March, 17 is St. Patrick’s Day in Northern Ireland. There is a traditionto wear on this day clothes of a certain colour',
        motive: 'Mr. Finch wore black on St. Patrick\'s Day, causing great indignation among the Irish.',
        evidenceRiddle: 'What colour should the Irish wear on St. Patrick\'s Day?',
        riddleAnswer: 'green',
        secret: 'Hotel guests saw Mr. Cormack washing his jacket to remove some stains.',
        alibi: 'He was at a parade, but disappeared during the final hour.',
        flower: 'Shamrock'
    }
};

const killer = 'northernireland';

let collectedEvidence = {
    england: false,
    scotland: false,
    wales: false,
    northernireland: false
};

function loadEvidenceFromStorage() {
    const saved = localStorage.getItem('finchEvidence');
    if (saved) {
        collectedEvidence = JSON.parse(saved);
    }
    return collectedEvidence;
}

function saveEvidenceToStorage() {
    localStorage.setItem('finchEvidence', JSON.stringify(collectedEvidence));
}

function updatePortrait() {
    const pieces = document.querySelectorAll('.portrait-piece');
    const flowerNameEl = document.getElementById('flowerName');
    const collected = Object.values(collectedEvidence).filter(v => v === true).length;
    
    const order = ['england', 'scotland', 'wales', 'northernireland'];
    
    for (let i = 0; i < order.length; i++) {
        const region = order[i];
        const piece = pieces[i];
        if (piece) {
            if (collectedEvidence[region]) {
                piece.classList.add('revealed');
                piece.style.backgroundColor = 'transparent';
            } else {
                piece.classList.remove('revealed');
                piece.style.backgroundColor = '#2a241c';
                piece.style.backgroundImage = '';
            }
        }
    }
    
    if (collected === 4 && flowerNameEl) {
        flowerNameEl.textContent = 'The killer is from that part of the UK whose symbol is the SHAMROCK';
        showFullShamrock();
    } else if (flowerNameEl) {
        flowerNameEl.textContent = '';
    }
}

function showFullShamrock() {
    const portraitContainer = document.querySelector('.portrait-container');
    if (document.querySelector('.full-emblem-image')) return;
    
    const fullImageDiv = document.createElement('div');
    fullImageDiv.className = 'full-emblem-image';
    fullImageDiv.innerHTML = `
        <img src="shamrock.jpg" style="max-width: 200px; border-radius: 16px; border: 2px solid #d4bc7a; box-shadow: 0 0 20px rgba(212,188,122,0.5); margin-top: 1rem;" onerror="this.style.display='none'">
    `;
    portraitContainer.appendChild(fullImageDiv);
}

function updateProgressDisplay() {
    const collected = Object.values(collectedEvidence).filter(v => v === true).length;
    const counter = document.getElementById('evidenceCounter');
    const progressFill = document.getElementById('progressFill');
    
    if (counter) counter.textContent = collected;
    if (progressFill) progressFill.style.width = `${(collected / 4) * 100}%`;
    
    for (const [region, solved] of Object.entries(collectedEvidence)) {
        const card = document.querySelector(`.status-card[data-region="${region}"]`);
        const statusIcon = card?.querySelector('.status-icon');
        const statusEvidence = card?.querySelector('.status-evidence');
        
        if (solved) {
            card?.classList.add('solved');
            if (statusIcon) statusIcon.textContent = '[X]';
            if (statusEvidence) statusEvidence.textContent = 'Clue found!';
        } else {
            card?.classList.remove('solved');
            if (statusIcon) statusIcon.textContent = '[?]';
            if (statusEvidence) statusEvidence.textContent = 'No clue found';
        }
        
        const marker = document.querySelector(`.map-marker[data-region="${region}"]`);
        if (marker) {
            if (solved) {
                marker.classList.add('solved');
            } else {
                marker.classList.remove('solved');
            }
        }
        
        const pieceIndex = ['england', 'scotland', 'wales', 'northernireland'].indexOf(region);
        const piece = document.querySelectorAll('.portrait-piece')[pieceIndex];
        if (piece && solved) {
            piece.style.backgroundImage = `url('клевер.jpg')`;
            piece.style.backgroundSize = '200% 200%';
            const col = pieceIndex % 2;
            const row = Math.floor(pieceIndex / 2);
            piece.style.backgroundPosition = `${col * 100}% ${row * 100}%`;
            piece.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    updatePortrait();
    
    const allCollected = collected === 4;
    const accuseSelect = document.getElementById('accuseSelect');
    const accuseBtn = document.getElementById('accuseBtn');
    
    if (accuseSelect) accuseSelect.disabled = !allCollected;
    if (accuseBtn) accuseBtn.disabled = !allCollected;
    
    if (allCollected && document.getElementById('allCluesMessage')) {
        document.getElementById('allCluesMessage').style.display = 'block';
    }
}

function setupMapMarkers() {
    const markers = document.querySelectorAll('.map-marker[data-region]');
    markers.forEach(marker => {
        const region = marker.getAttribute('data-region');
        if (region && region !== 'crime') {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = `pages/${region}.html`;
            });
        } else if (region === 'crime') {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = document.getElementById('crimeModal');
                if (modal) modal.style.display = 'flex';
            });
        }
    });
}

function setupStatusClicks() {
    const cards = document.querySelectorAll('.status-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const region = card.getAttribute('data-region');
            if (region) {
                window.location.href = `pages/${region}.html`;
            }
        });
    });
}

function setupAccusation() {
    const accuseBtn = document.getElementById('accuseBtn');
    const accuseSelect = document.getElementById('accuseSelect');
    const resultDiv = document.getElementById('accusationResult');
    
    if (!accuseBtn) return;
    
    accuseBtn.addEventListener('click', () => {
        const selected = accuseSelect.value;
        if (!selected) return;
        
        if (selected === killer) {
            resultDiv.innerHTML = `
                <div class="correct-answer">
                    <strong>CORRECT! You found the murderer.</strong><br><br>
                    It is indeed ${suspects[selected].name} from ${suspects[selected].regionName}.<br><br>
                    <strong>Motive:</strong> ${suspects[selected].motive}<br>
                    <strong>Clue:</strong> ${suspects[selected].secret}<br><br>
                    <strong>The emblem revealed: ${suspects[selected].flower}.</strong> Case closed.
                </div>
            `;
            localStorage.setItem('finchCaseSolved', 'true');
            accuseBtn.disabled = true;
            accuseSelect.disabled = true;
        } else {
            resultDiv.innerHTML = `
                <div class="wrong-answer">
                    <strong>WRONG. ${suspects[selected].name} is not guilty.</strong><br><br>
                    <strong>Alibi:</strong> ${suspects[selected].alibi}<br><br>
                    Gather more evidence and think about who had the strongest motive.
                </div>
            `;
        }
    });
}

function loadMainPage() {
    loadEvidenceFromStorage();
    updateProgressDisplay();
    setupMapMarkers();
    setupStatusClicks();
    setupAccusation();
    
    const modal = document.getElementById('crimeModal');
    const closeBtn = document.querySelector('.modal-close');
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
}

function loadRegionPage(regionId) {
    loadEvidenceFromStorage();
    const suspect = suspects[regionId];
    if (!suspect) return;
    const evidenceFound = collectedEvidence[regionId];
    
    const nameEl = document.getElementById('suspectName');
    const titleEl = document.getElementById('suspectTitle');
    const motiveEl = document.getElementById('suspectMotive');
    const traditionEl = document.getElementById('traditionDesc');
    const riddleEl = document.getElementById('riddleText');
    
    if (nameEl) nameEl.textContent = suspect.name;
    if (titleEl) titleEl.textContent = suspect.tradition;
    if (motiveEl) motiveEl.textContent = suspect.motive;
    if (traditionEl) traditionEl.textContent = suspect.traditionDesc;
    if (riddleEl) riddleEl.textContent = suspect.evidenceRiddle;
    
    if (evidenceFound) {
        const hiddenDiv = document.getElementById('hiddenEvidence');
        if (hiddenDiv) {
            hiddenDiv.innerHTML = `<strong>Clue already discovered!</strong> ${suspect.secret}`;
            hiddenDiv.style.display = 'block';
        }
        const btn = document.getElementById('unlockBtn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Clue obtained';
        }
        const inp = document.getElementById('riddleInput');
        if (inp) {
            inp.disabled = true;
            inp.placeholder = 'Clue already found';
        }
        const messageDiv = document.getElementById('clueMessage');
        if (messageDiv) {
            messageDiv.innerHTML = '<span style="color: #8bc48a;">You have already found the clue in this region. Return to the map!</span>';
        }
    } else {
        setupRiddle(suspect, regionId);
    }
}

function setupRiddle(suspect, regionId) {
    const btn = document.getElementById('unlockBtn');
    if (!btn) return;
    
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    const freshBtn = document.getElementById('unlockBtn');
    
    freshBtn.addEventListener('click', () => {
        const input = document.getElementById('riddleInput');
        const answer = input.value.trim().toLowerCase();
        const correct = suspect.riddleAnswer.toLowerCase();
        const hiddenDiv = document.getElementById('hiddenEvidence');
        const messageDiv = document.getElementById('clueMessage');
        
        if (answer === correct || answer.includes(correct)) {
            collectedEvidence[regionId] = true;
            saveEvidenceToStorage();
            
            if (hiddenDiv) {
                hiddenDiv.innerHTML = `<strong>Clue found!</strong> ${suspect.secret}`;
                hiddenDiv.style.display = 'block';
            }
            
            freshBtn.disabled = true;
            freshBtn.textContent = 'Clue obtained';
            input.disabled = true;
            
            if (messageDiv) {
                messageDiv.innerHTML = '<span style="color: #8bc48a;">Excellent! The clue has been saved. Return to the map to continue your investigation.</span>';
            }
        } else {
            if (hiddenDiv) {
                hiddenDiv.innerHTML = '<span style="color: #c48a6a;">Incorrect answer. Try again! Read the hint below carefully.</span>';
                hiddenDiv.style.display = 'block';
                setTimeout(() => {
                    hiddenDiv.style.display = 'none';
                }, 2500);
            }
        }
    });
}

function resetProgress() {
    collectedEvidence = {
        england: false,
        scotland: false,
        wales: false,
        northernireland: false
    };
    saveEvidenceToStorage();
    localStorage.removeItem('finchCaseSolved');
    
    const fullImage = document.querySelector('.full-emblem-image');
    if (fullImage) fullImage.remove();
    
    const pieces = document.querySelectorAll('.portrait-piece');
    pieces.forEach(piece => {
        piece.style.backgroundImage = '';
        piece.style.backgroundColor = '#2a241c';
        piece.classList.remove('revealed');
    });
    
    const flowerNameEl = document.getElementById('flowerName');
    if (flowerNameEl) flowerNameEl.textContent = '';
    
    const allCluesMessage = document.getElementById('allCluesMessage');
    if (allCluesMessage) allCluesMessage.style.display = 'none';
    
    const accusationResult = document.getElementById('accusationResult');
    if (accusationResult) accusationResult.innerHTML = '';
    
    const accuseSelect = document.getElementById('accuseSelect');
    const accuseBtn = document.getElementById('accuseBtn');
    if (accuseSelect) accuseSelect.disabled = true;
    if (accuseBtn) accuseBtn.disabled = true;
    
    if (document.getElementById('suspectsStatus')) {
        updateProgressDisplay();
    }
    
    location.reload();
}

window.loadRegionPage = loadRegionPage;
window.resetProgress = resetProgress;

if (document.getElementById('suspectsStatus')) {
    loadMainPage();
}
