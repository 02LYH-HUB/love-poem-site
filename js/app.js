/* ========================================
   PoemForTwo - Main Application
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // i18n: Chinese/English Language System
    // ========================================

    const i18n = {
        zh: {
            heroMain: '把你的故事写成一首中国古诗词',
            heroDesc: '受中国古典诗词启发，为你创作一首专属的中英双语诗',
            moreRel: '更多关系',
            formTitle: '赋诗一首',
            relLabel: '选择关系',
            relLove: '热恋', relMarried: '结发', relLongDist: '相思',
            relCrush: '倾心', relEngaged: '定盟', relReunited: '重逢',
            relParent: '孝亲', relChild: '舐犊', relSibling: '手足',
            relGrandparent: '尊长', relBestfriend: '知音', relSoulmate: '知己',
            relPet: '灵宠', relSelf: '自勉', relMemorial: '悼念', relMentor: '师恩',
            relHint: '请选择一段关系',
            yourNameLabel: '你的名字',
            theirNameLabel: '对方的名字',
            storyLabel: '你们的故事',
            optional: '（可选，但越详细诗越动人）',
            generateBtn: 'Create My Poem ✨',
            loading: 'Creating...',
            formatLabel: '选择格式',
            formatWuyan: '5字×8句',
            formatQiyan: '7字×8句',
            lsBuyBtn: '💳 购买全诗 · Buy $9.9',
            paywallTitle: '解锁完整诗篇',
            paywallDesc: '$9.9 解锁完整中英双语诗 + 逐行译意 + 高清下载',
            paywallNote: '一次付费 · 即刻交付 · Instant delivery',
            labelChinese: '中文诗 · 古韵',
            labelTrans: '英文翻译 · Poetic Translation',
            labelInterpret: '英文译意 · Interpretation',
            downloadPng: '下载为图片',
            downloadTxt: '下载为文本',
            personalNote: '✍️ 添加手写寄语（可选）',
            createNew: '再赋新诗',
            companyName: '果核科技 · GuoHe Tech',
            slogan: '小团队，大作为',
            privacy: '🔒 您的故事仅在生成时使用，不留存不分享 · Your story is used only for generation, never stored or shared',
            copyright: '© 2026 PoemForTwo · 为你写诗 · 果核科技出品',
            namePlaceholder1: '如：明',
            namePlaceholder2: '如：莎',
            storyPlaceholder: '如：我们在上海的一家咖啡馆相遇，因为共同喜欢爵士乐而结缘…',
            poemSignature: '以诗为证',
            poemDedication: '——致',
        },
        en: {
            heroMain: 'Turn Your Story into a Beautiful Chinese Poem',
            heroDesc: 'Personalized bilingual poems inspired by classical Chinese verse',
            moreRel: 'More',
            formTitle: 'Create Your Poem',
            relLabel: 'Choose Relationship',
            relLove: 'In Love', relMarried: 'Married', relLongDist: 'Long Distance',
            relCrush: 'Crush', relEngaged: 'Engaged', relReunited: 'Reunited',
            relParent: 'To Parents', relChild: 'To Child', relSibling: 'Sibling',
            relGrandparent: 'To Grandparent', relBestfriend: 'Best Friend', relSoulmate: 'Soulmate',
            relPet: 'To Pet', relSelf: 'To Myself', relMemorial: 'In Memory', relMentor: 'Mentor',
            relHint: 'Select a relationship',
            yourNameLabel: 'Your Name',
            theirNameLabel: 'Their Name',
            storyLabel: 'Your Story',
            optional: '(optional, makes it more personal)',
            generateBtn: 'Create My Poem ✨',
            loading: 'Creating...',
            formatLabel: 'Poem Format',
            formatWuyan: '5-char × 8 lines',
            formatQiyan: '7-char × 8 lines',
            lsBuyBtn: '💳 Buy $9.9 · Unlock Full Poem',
            paywallTitle: 'Unlock Full Poem',
            paywallDesc: '$9.9 Unlock the complete bilingual poem + interpretation + HD download',
            paywallNote: 'One-time payment · Instant delivery',
            labelChinese: 'Chinese Poem · 中文诗',
            labelTrans: 'Poetic Translation · 英译',
            labelInterpret: 'Interpretation · 译意',
            downloadPng: 'Download as PNG',
            downloadTxt: 'Download as Text',
            personalNote: '✍️ Add a handwritten note (optional)',
            createNew: 'Write Another Poem',
            companyName: 'GuoHe Tech · 果核科技',
            slogan: 'Small team, big impact',
            privacy: '🔒 Your story is used only for generation, never stored or shared · 不留存不分享',
            copyright: '© 2026 PoemForTwo · Bilingual Love Poems · by GuoHe Tech',
            namePlaceholder1: 'e.g. Ming',
            namePlaceholder2: 'e.g. Sarah',
            storyPlaceholder: 'e.g. We met in a coffee shop in Shanghai, bonded over jazz music...',
            poemSignature: 'With love',
            poemDedication: '— To',
        }
    };

    let currentLang = 'zh';

    window.toggleLang = function() {
        currentLang = currentLang === 'zh' ? 'en' : 'zh';
        document.getElementById('langToggle').textContent = currentLang === 'zh' ? 'EN' : '中';
        applyLang(currentLang);
    };

    function applyLang(lang) {
        const dict = i18n[lang];
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.textContent = dict[key];
            }
        });
        // Placeholders
        document.getElementById('name1').placeholder = dict.namePlaceholder1;
        document.getElementById('name2').placeholder = dict.namePlaceholder2;
        document.getElementById('story').placeholder = dict.storyPlaceholder;
        // HTML lang
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }

    // ========================================
    // DOM References
    // ========================================

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
    const previewEnglish = document.getElementById('previewEnglish');
    const blurredChinese = document.getElementById('blurredChinese');
    const blurredEnglish = document.getElementById('blurredEnglish');
    const blurredInterpret = document.getElementById('blurredInterpret');
    const fullChinese = document.getElementById('fullChinese');
    const fullEnglish = document.getElementById('fullEnglish');
    const fullInterpret = document.getElementById('fullInterpret');
    const poemTitle = document.getElementById('poemTitle');
    const poemDedication = document.getElementById('poemDedication');
    const poemSignature = document.getElementById('poemSignature');
    const noteSection = document.getElementById('noteSection');
    const personalNote = document.getElementById('personalNote');
    const lockedContent = document.getElementById('lockedContent');
    const fullContent = document.getElementById('fullContent');
    const poemActions = document.getElementById('poemActions');
    const paywall = document.getElementById('paywall');
    const lsBuyBtn = document.getElementById('lsBuyBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const createNewBtn = document.getElementById('createNewBtn');

    // ========================================
    // State
    // --- State ---

    let selectedRel = null;
    let selectedFormat = 'wuyan';
    let currentPoem = null;

    // ========================================
    // Chinese Poetry Quotes (rotating)
    // ========================================

    const quotes = [
        { line: '愿得一心人，白首不相离', source: '—— 卓文君《白头吟》', en: '"May we remain devoted until our hair turns white"' },
        { line: '两情若是久长时，又岂在朝朝暮暮', source: '—— 秦观《鹊桥仙》', en: '"If love endures, why must we cling to every dawn and dusk?"' },
        { line: '曾经沧海难为水，除却巫山不是云', source: '—— 元稹《离思》', en: '"No water can match the sea I\'ve crossed, no cloud the peak I\'ve known."' },
        { line: '此情可待成追忆，只是当时已惘然', source: '—— 李商隐《锦瑟》', en: '"This longing waits to be recalled in vain, only to find it was lost in the haze back then."' },
        { line: '在天愿作比翼鸟，在地愿为连理枝', source: '—— 白居易《长恨歌》', en: '"In heaven, may we be twin-winged birds; on earth, entwined branches."' },
        { line: '玲珑骰子安红豆，入骨相思知不知', source: '—— 温庭筠《南歌子》', en: '"A carved die with red beans inside — this lovesickness etched into bone, do you know?"' },
        { line: '衣带渐宽终不悔，为伊消得人憔悴', source: '—— 柳永《蝶恋花》', en: '"My belt grows loose, yet I regret it not — for you, I fade away without a thought."' },
        { line: '只愿君心似我心，定不负相思意', source: '—— 李之仪《卜算子》', en: '"If only your heart could be like mine — forever true, never to betray this love\'s design."' },
        { line: '海上生明月，天涯共此时', source: '—— 张九龄《望月怀远》', en: '"The bright moon rises from the vast sea — though far apart, we share this moment."' },
        { line: '执子之手，与子偕老', source: '—— 《诗经·邶风·击鼓》', en: '"Take your hand in mine, and grow old together with time."' },
    ];

    let quoteIndex = 0;
    const quoteLine = document.getElementById('quoteLine');
    const quoteSource = document.getElementById('quoteSource');
    const quoteEn = document.getElementById('quoteEn');

    function rotateQuote() {
        if (!quoteLine) return;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteLine.style.opacity = '0';
        quoteSource.style.opacity = '0';
        if (quoteEn) quoteEn.style.opacity = '0';
        setTimeout(function() {
            quoteLine.textContent = quotes[quoteIndex].line;
            quoteSource.textContent = quotes[quoteIndex].source;
            if (quoteEn) quoteEn.textContent = quotes[quoteIndex].en || '';
            quoteLine.style.opacity = '1';
            quoteSource.style.opacity = '1';
            if (quoteEn) quoteEn.style.opacity = '1';
        }, 400);
    }

    if (quoteLine) {
        setInterval(rotateQuote, 5000);
    }

    // ========================================
    // Relationship Grid
    // ========================================

    relBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            relBtns.forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
            selectedRel = this.dataset.rel;
            var label = currentLang === 'zh'
                ? (i18n.zh['rel' + capitalize(selectedRel)] || selectedRel)
                : (i18n.en['rel' + capitalize(selectedRel)] || selectedRel);
            relHint.textContent = currentLang === 'zh'
                ? '已选：' + label
                : 'Selected: ' + label;
            relHint.style.color = '';
        });
    });

    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

    // --- Format Grid ---
    var formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            formatBtns.forEach(function(b) { b.classList.remove('selected'); });
            this.classList.add('selected');
            selectedFormat = this.dataset.format;
        });
    });

    // ========================================
    // Generate Poem
    // ========================================
    // --- Generate Poem ---
    window._generatePoem = generatePoem;

    async function generatePoem() {
        // Clear any stale pending poem
        sessionStorage.removeItem('pendingPoem');

        // Clear old preview content
        previewChinese.textContent = '';
        previewEnglish.textContent = '';
        blurredChinese.textContent = '';
        blurredEnglish.textContent = '';
        blurredInterpret.textContent = '';
        fullChinese.textContent = '';
        fullEnglish.textContent = '';
        fullInterpret.textContent = '';
        poemTitle.textContent = '';

        // Validate
        if (!selectedRel) {
            relHint.textContent = currentLang === 'zh'
                ? '⚠️ 请先选择一段关系'
                : '⚠️ Please select a relationship first';
            relHint.style.color = '#ff6b8a';
            return;
        }
        if (!name1.value.trim() || !name2.value.trim()) {
            alert(currentLang === 'zh' ? '请填写双方名字' : 'Please enter both names');
            return;
        }

        generateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');

        // Loading animation: rotating messages
        var loadingMsgs = currentLang === 'zh'
            ? ['构思意境...', '推敲格律...', '润色用典...', '翻译英文...', '生成完成！']
            : ['Capturing the mood...', 'Refining the rhythm...', 'Polishing the allusions...', 'Translating...', 'Done!'];
        var msgIdx = 0;
        var loadingInterval = setInterval(function() {
            msgIdx = (msgIdx + 1) % loadingMsgs.length;
            btnLoading.textContent = loadingMsgs[msgIdx];
        }, 3000);

        // Abort controller for timeout
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 45000);

        try {
            // Retry logic: up to 2 attempts
            var lastError = null;
            for (var attempt = 0; attempt < 2; attempt++) {
                try {
                    var response = await fetch('/api/generate-poem', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            relationship: selectedRel,
                            name1: name1.value.trim(),
                            name2: name2.value.trim(),
                            story: story.value.trim() || '',
                            format: selectedFormat
                        }),
                        signal: controller.signal
                    });

                    if (response.ok) {
                        var data = await response.json();
                        lastError = null;
                        break; // Success, exit retry loop
                    }
                    lastError = 'HTTP ' + response.status;
                } catch (e) {
                    lastError = e.message || 'Network error';
                    if (e.name === 'AbortError') {
                        lastError = currentLang === 'zh' ? '请求超时，请重试' : 'Request timeout, please retry';
                        break;
                    }
                }
                // Wait before retry (exponential backoff)
                if (attempt < 1) await new Promise(function(r) { setTimeout(r, 1500); });
            }

            clearTimeout(timeoutId);
            clearInterval(loadingInterval);

            if (lastError) {
                throw new Error(lastError);
            }
            currentPoem = data;
            renderPreview(data);
            renderFullContent(data);
            previewSection.classList.remove('hidden');

            // TEST MODE: if URL has ?test=1, unlock everything
            if (window.location.search.indexOf('test=1') >= 0) {
                lockedContent.classList.add('hidden');
                fullContent.classList.remove('hidden');
                noteSection.classList.remove('hidden');
                poemActions.classList.remove('hidden');
            }

            // Clear selections to prevent token abuse
            var allRelBtns = document.querySelectorAll('.rel-btn');
            allRelBtns.forEach(function(b) { b.classList.remove('selected'); });
            selectedRel = null;
            name1.value = '';
            name2.value = '';
            story.value = '';
            relHint.textContent = currentLang === 'zh' ? '✓ 已生成' : '✓ Generated';
            relHint.style.color = 'var(--gold)';

            // Scroll to poem preview
            fullContent.classList.add('hidden');
            lockedContent.classList.remove('hidden');
            poemActions.classList.add('hidden');

            // Set LemonSqueezy buy link
            var lsCheckoutUrl = 'https://pitcore.lemonsqueezy.com/checkout/buy/5ab101b8-c266-4014-974c-f55ada057086';
            lsBuyBtn.href = lsCheckoutUrl;
            lsBuyBtn.target = '_blank';
            lsBuyBtn.onclick = function() {
                sessionStorage.setItem('pendingPoem', JSON.stringify(currentPoem));
            };

            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (err) {
            alert((currentLang === 'zh' ? '生成失败：' : 'Failed to generate: ') + err.message);
        } finally {
            generateBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }

    function renderPreview(data) {
        poemTitle.textContent = data.title;
        poemDedication.textContent = (currentLang === 'zh' ? '——致 ' : '— To ') + (data.name2 || '');
        // Show first 4 Chinese lines + first 4 English lines free
        var cnLines = data.chinese.split('\n').filter(function(l) { return l.trim(); });
        var enLines = (data.english || '').split('\n').filter(function(l) { return l.trim(); });
        var half = Math.min(4, Math.ceil(cnLines.length / 2));
        previewChinese.textContent = cnLines.slice(0, half).join('\n');
        previewEnglish.textContent = enLines.slice(0, half).join('\n');
        // Blur remaining lines + interpretation
        blurredChinese.textContent = cnLines.slice(half).join('\n');
        blurredEnglish.textContent = enLines.slice(half).join('\n');
        blurredInterpret.textContent = data.interpret || '';
    }

    function renderFullContent(data) {
        fullChinese.textContent = data.chinese;
        fullEnglish.textContent = data.english || '';
        fullInterpret.textContent = data.interpret || '';
        var sig = currentLang === 'zh' ? '以诗为证' : 'With love';
        poemSignature.textContent = sig + ' · ' + data.name1 + ' & ' + data.name2;
    }

    // Char count for story input
    const storyInput = document.getElementById('story');
    const charCount = document.getElementById('charCount');
    storyInput.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });

    // ========================================
    // Download Functions
    // ========================================

    downloadPngBtn.addEventListener('click', downloadAsImage);
    downloadTxtBtn.addEventListener('click', downloadAsText);
    createNewBtn.addEventListener('click', resetAll);

    function downloadAsImage() {
        if (!currentPoem) return;
        var canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1100;
        var ctx = canvas.getContext('2d');
        var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#1a1410');
        grad.addColorStop(0.5, '#2a1f1a');
        grad.addColorStop(1, '#1a1410');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#d4a853';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
        ctx.fillStyle = '#d4a853';
        ctx.font = 'bold 36px "Georgia", serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentPoem.title, canvas.width/2, 110);

        ctx.fillStyle = '#f0e8e0';
        ctx.font = '22px "Noto Serif SC", serif';
        var chineseLines = currentPoem.chinese.split('\n');
        var y = 200;
        chineseLines.forEach(function(line) {
            if (line.trim()) { ctx.fillText(line.trim(), canvas.width/2, y); y += 45; }
        });
        y += 20;
        ctx.fillStyle = '#d4a853';
        ctx.font = '18px serif';
        ctx.fillText('✦ ✦ ✦', canvas.width/2, y);
        y += 50;
        ctx.fillStyle = '#b8a8a0';
        ctx.font = '18px "Georgia", serif';
        currentPoem.english.split('\n').forEach(function(line) {
            if (line.trim()) { ctx.fillText(line.trim(), canvas.width/2, y); y += 35; }
        });
        y += 50;
        // Handwritten note
        var note = document.getElementById('personalNote');
        if (note && note.value.trim()) {
            var noteLines = note.value.trim().split('\n');
            ctx.fillStyle = 'rgba(212,168,83,0.6)';
            ctx.font = '26px "Caveat", "Georgia", cursive';
            y += 10;
            noteLines.forEach(function(line) {
                if (line.trim()) { ctx.fillText(line.trim(), canvas.width/2, y); y += 36; }
            });
            y += 10;
        }
        ctx.fillStyle = '#8a7a72';
        ctx.font = '14px "Georgia", serif';
        ctx.fillText('PoemForTwo · ' + (currentLang === 'zh' ? '为你写诗' : 'Bilingual Love Poem'), canvas.width/2, y);
        var link = document.createElement('a');
        link.download = 'PoemForTwo-' + currentPoem.title + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function downloadAsText() {
        if (!currentPoem) return;
        var text = [
            currentPoem.title, '', currentPoem.chinese, '', '✦ ✦ ✦', '',
            currentPoem.english, '',
            '— ' + name1.value.trim() + ' & ' + name2.value.trim() + ' · PoemForTwo —',
            'Created with PoemForTwo'
        ].join('\n');
        var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        var link = document.createElement('a');
        link.download = 'PoemForTwo-' + currentPoem.title + '.txt';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function resetAll() {
        relBtns.forEach(function(b) { b.classList.remove('selected'); });
        selectedRel = null;
        var hintDefault = currentLang === 'zh' ? '请选择一段关系' : 'Select a relationship';
        relHint.textContent = hintDefault;
        relHint.style.color = '';
        name1.value = '';
        name2.value = '';
        story.value = '';
        previewSection.classList.add('hidden');
        currentPoem = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========================================
    // Init
    // ========================================

    applyLang('en');

    // Also toggle the lang button text
    langToggle.textContent = '中文';

    // Toggle More relations
    window.toggleMoreRelations = function() {
        var hidden = document.querySelectorAll('.hidden-rel');
        var btn = document.getElementById('relMoreBtn');
        var expanded = btn.classList.toggle('expanded');
        hidden.forEach(function(el) {
            el.style.display = expanded ? 'inline-flex' : 'none';
        });
        btn.innerHTML = expanded
            ? '− <span data-i18n="moreRel">Less</span>'
            : '+ <span data-i18n="moreRel">More</span>';
        // Re-apply i18n to the button
        var lang = currentLang;
        var dict = i18n[lang];
        if (dict && dict.moreRel) {
            btn.querySelector('[data-i18n]').textContent = expanded ? 'Less' : dict.moreRel;
        }
    };

    // Check for pending poem (after LemonSqueezy payment)
    var pending = sessionStorage.getItem('pendingPoem');
    if (pending) {
        try {
            var poem = JSON.parse(pending);
            currentPoem = poem;
            renderFullContent(poem);
            previewSection.classList.remove('hidden');
            lockedContent.classList.add('hidden');
            fullContent.classList.remove('hidden');
            noteSection.classList.remove('hidden');
            poemActions.classList.remove('hidden');
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            sessionStorage.removeItem('pendingPoem');
        } catch(e) {}
    }

})();
