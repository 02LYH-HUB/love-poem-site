/* ========================================
   PoemForTwo - Main Application
   ======================================== */

(function() {
    'use strict';

    // --- DOM References ---
    const relBtns = document.querySelectorAll('.rel-btn');
    const relHint = document.getElementById('relHint');
    const name1 = document.getElementById('name1');
    const name2 = document.getElementById('name2');
    const story = document.getElementById('story');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const previewSection = document.getElementById('previewSection');
    const previewChinese = document.getElementById('previewChinese');
    const blurredChinese = document.getElementById('blurredChinese');
    const blurredEnglish = document.getElementById('blurredEnglish');
    const fullChinese = document.getElementById('fullChinese');
    const fullEnglish = document.getElementById('fullEnglish');
    const poemTitle = document.getElementById('poemTitle');
    const poemDedication = document.getElementById('poemDedication');
    const poemSignature = document.getElementById('poemSignature');
    const lockedContent = document.getElementById('lockedContent');
    const fullContent = document.getElementById('fullContent');
    const poemActions = document.getElementById('poemActions');
    const paywall = document.getElementById('paywall');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const createNewBtn = document.getElementById('createNewBtn');

    // --- State ---
    let selectedRel = null;
    let currentPoem = null;  // { title, chinese, english, dedication }

    // --- Relationship Names (Chinese) ---
    const relNames = {
        love: '热恋情侣',
        married: '老夫老妻',
        longdistance: '异地恋',
        crush: '暗恋',
        engagement: '订婚之喜',
        reunited: '久别重逢',
        parent: '给父母',
        child: '给孩子',
        sibling: '兄弟姐妹',
        grandparent: '给长辈',
        bestfriend: '闺蜜兄弟',
        soulmate: '灵魂伴侣',
        pet: '写给宠物',
        self: '致自己',
        memorial: '纪念',
        mentor: '师恩'
    };

    // --- Relationship Grid ---
    relBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            relBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedRel = this.dataset.rel;
            relHint.textContent = `Selected: ${relNames[selectedRel] || selectedRel}`;
        });
    });

    // --- Generate Poem ---
    generateBtn.addEventListener('click', generatePoem);

    async function generatePoem() {
        // Validate
        if (!selectedRel) {
            relHint.textContent = '⚠️ Please select a relationship type first';
            relHint.style.color = '#ff6b8a';
            return;
        }
        if (!name1.value.trim() || !name2.value.trim()) {
            alert('Please enter both names');
            return;
        }

        // Loading state
        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');

        try {
            const response = await fetch('/api/generate-poem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    relationship: selectedRel,
                    name1: name1.value.trim(),
                    name2: name2.value.trim(),
                    story: story.value.trim() || '',
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(err.error || `HTTP ${response.status}`);
            }

            const data = await response.json();
            currentPoem = data;

            // Render preview
            renderPreview(data);
            renderFullContent(data);

            // Show preview section
            previewSection.classList.remove('hidden');
            lockedContent.classList.remove('hidden');
            fullContent.classList.add('hidden');
            poemActions.classList.add('hidden');

            // Load PayPal SDK on demand
            loadPayPalSDK().then(function(loaded) {
                if (loaded) {
                    setupPayPal();
                } else {
                    // Show fallback message (already handled in setupPayPal)
                    setupPayPal();
                }
            });

            // Scroll to preview
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            alert('Failed to generate poem: ' + err.message);
            console.error(err);
        } finally {
            generateBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }

    // --- Render Functions ---
    function renderPreview(data) {
        poemTitle.textContent = data.title;
        poemDedication.textContent = `— To ${data.name2 || ''} —`;

        // Preview: first 4 lines of Chinese
        const lines = data.chinese.split('\n').filter(l => l.trim());
        const previewLines = lines.slice(0, Math.min(4, lines.length));
        previewChinese.textContent = previewLines.join('\n');

        // Blurred: rest of Chinese + English
        const restLines = lines.slice(4);
        blurredChinese.textContent = restLines.length > 0 ? restLines.join('\n') : '... ✦ ...';
        blurredEnglish.textContent = data.english;
    }

    function renderFullContent(data) {
        fullChinese.textContent = data.chinese;
        fullEnglish.textContent = data.english;
        poemSignature.textContent = `For ${data.name1} & ${data.name2} · PoemForTwo`;
    }

    // --- PayPal Payment ---
    function setupPayPal() {
        if (typeof paypal === 'undefined') {
            console.warn('PayPal SDK not loaded');
            paywall.innerHTML = `
                <div class="lock-icon">🔒</div>
                <h3>Unlock the Full Poem</h3>
                <p class="pay-desc">Get the complete bilingual poem</p>
                <p style="color:var(--text-muted);font-size:13px;">
                    💳 Payment setup pending — please add your PayPal Client ID
                </p>
            `;
            return;
        }

        try {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            description: "Bilingual Love Poem - " + (currentPoem?.title || 'Custom Poem'),
                            amount: { value: '9.90' }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        onPaymentSuccess(details);
                    });
                },
                onError: function(err) {
                    console.error('PayPal Error:', err);
                    alert('Payment failed. Please try again.');
                }
            }).render('#paypal-button-container');
        } catch(e) {
            console.warn('PayPal render failed:', e);
        }
    }

    function onPaymentSuccess(details) {
        // Reveal full poem
        lockedContent.classList.add('hidden');
        fullContent.classList.remove('hidden');
        poemActions.classList.remove('hidden');

        // Update signature
        poemSignature.textContent = `For ${name1.value.trim()} & ${name2.value.trim()} · With ❤️`;

        // Scroll to full poem
        fullContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- Download Functions ---
    downloadPngBtn.addEventListener('click', downloadAsImage);
    downloadTxtBtn.addEventListener('click', downloadAsText);
    createNewBtn.addEventListener('click', resetAll);

    function downloadAsImage() {
        if (!currentPoem) return;
        const text = `${currentPoem.title}\n\n${currentPoem.chinese}\n\n✦ ✦ ✦\n\n${currentPoem.english}\n\n— For ${name1.value.trim()} & ${name2.value.trim()} —`;

        // Use canvas to create a beautiful image
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1100;
        const ctx = canvas.getContext('2d');

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1a1410');
        grad.addColorStop(0.5, '#2a1f1a');
        grad.addColorStop(1, '#1a1410');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gold border
        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

        // Title
        ctx.fillStyle = '#d4a853';
        ctx.font = 'bold 36px "Georgia", serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentPoem.title, canvas.width/2, 110);

        // Chinese poem
        ctx.fillStyle = '#f0e8e0';
        ctx.font = '22px "Noto Serif SC", "STSong", serif';
        const chineseLines = currentPoem.chinese.split('\n');
        let y = 200;
        chineseLines.forEach(line => {
            if (line.trim()) {
                ctx.fillText(line.trim(), canvas.width/2, y);
                y += 45;
            }
        });

        // Divider
        y += 20;
        ctx.fillStyle = '#d4a853';
        ctx.font = '18px serif';
        ctx.fillText('✦ ✦ ✦', canvas.width/2, y);

        // English poem
        y += 50;
        ctx.fillStyle = '#b8a8a0';
        ctx.font = '18px "Georgia", "Times New Roman", serif';
        const englishLines = currentPoem.english.split('\n');
        englishLines.forEach(line => {
            if (line.trim()) {
                ctx.fillText(line.trim(), canvas.width/2, y);
                y += 35;
            }
        });

        // Signature
        y += 40;
        ctx.fillStyle = '#8a7a72';
        ctx.font = '14px "Georgia", serif';
        ctx.fillText(`For ${name1.value.trim()} & ${name2.value.trim()} · PoemForTwo`, canvas.width/2, y);

        // Download
        const link = document.createElement('a');
        link.download = `PoemForTwo-${currentPoem.title}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function downloadAsText() {
        if (!currentPoem) return;
        const text = [
            currentPoem.title,
            '',
            currentPoem.chinese,
            '',
            '✦ ✦ ✦',
            '',
            currentPoem.english,
            '',
            `— For ${name1.value.trim()} & ${name2.value.trim()} · PoemForTwo —`,
            '',
            'Created with PoemForTwo (poemfortwo.com)'
        ].join('\n');

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.download = `PoemForTwo-${currentPoem.title}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function resetAll() {
        // Reset form
        relBtns.forEach(b => b.classList.remove('selected'));
        selectedRel = null;
        relHint.textContent = 'Select a relationship type';
        relHint.style.color = '';
        name1.value = '';
        name2.value = '';
        story.value = '';

        // Hide preview
        previewSection.classList.add('hidden');
        currentPoem = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- Initialize ---
    // Load PayPal SDK dynamically when paywall is shown
    function loadPayPalSDK() {
        return new Promise(function(resolve) {
            if (typeof paypal !== 'undefined') {
                return resolve(true);
            }
            var script = document.createElement('script');
            script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD';
            script.setAttribute('data-sdk-integration-source', 'button-factory');
            script.onload = function() { resolve(true); };
            script.onerror = function() { resolve(false); };
            document.body.appendChild(script);
            // Timeout after 8 seconds
            setTimeout(function() { resolve(false); }, 8000);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // PayPal will be loaded on-demand when user generates a poem
        });
    }

})();
