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
            heroSubtitle: '为你写诗 · 以诗传情',
            heroDesc: '讲述你的故事，AI 为你创作一首中英双语情诗',
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
            generateBtn: '赋诗预览 ✨',
            loading: '挥毫泼墨中...',
            lsBuyBtn: '💳 购买全诗 · Buy $9.9',
            paywallTitle: '解锁全诗',
            paywallDesc: '$9.9 一键解锁完整中英双语诗，可下载珍藏',
            paywallNote: '一次付费 · 即刻交付 · Instant delivery',
            labelChinese: '中文诗 · 古韵',
            labelTrans: '英文翻译 · Poetic Translation',
            labelInterpret: '英文译意 · Interpretation',
            downloadPng: '下载为图片',
            downloadTxt: '下载为文本',
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
            heroSubtitle: 'Write a Poem for You',
            heroDesc: 'Tell your story, get a bilingual love poem (Chinese + English)',
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
            generateBtn: 'Generate Preview ✨',
            loading: 'Writing your poem...',
            lsBuyBtn: '💳 Buy $9.9 · 购买全诗',
            paywallTitle: 'Unlock Full Poem',
            paywallDesc: '$9.9 Unlock the complete bilingual poem, download & share',
            paywallNote: 'One-time payment · Instant delivery',
            labelChinese: 'Chinese Poem · 中文诗',
            labelTrans: 'Poetic Translation · 英译',
            labelInterpret: 'Interpretation · 译意',
            downloadPng: 'Download as PNG',
            downloadTxt: 'Download as Text',
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
    const blurredChinese = document.getElementById('blurredChinese');
    const blurredEnglish = document.getElementById('blurredEnglish');
    const blurredInterpret = document.getElementById('blurredInterpret');
    const fullChinese = document.getElementById('fullChinese');
    const fullEnglish = document.getElementById('fullEnglish');
    const fullInterpret = document.getElementById('fullInterpret');
    const poemTitle = document.getElementById('poemTitle');
    const poemDedication = document.getElementById('poemDedication');
    const poemSignature = document.getElementById('poemSignature');
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
    // ========================================

    let selectedRel = null;
    let currentPoem = null;

    // ========================================
    // Chinese Poetry Quotes (rotating)
    // ========================================

    const quotes = [
        { line: '愿得一心人，白首不相离', source: '—— 卓文君《白头吟》' },
        { line: '两情若是久长时，又岂在朝朝暮暮', source: '—— 秦观《鹊桥仙》' },
        { line: '曾经沧海难为水，除却巫山不是云', source: '—— 元稹《离思》' },
        { line: '此情可待成追忆，只是当时已惘然', source: '—— 李商隐《锦瑟》' },
        { line: '在天愿作比翼鸟，在地愿为连理枝', source: '—— 白居易《长恨歌》' },
        { line: '玲珑骰子安红豆，入骨相思知不知', source: '—— 温庭筠《南歌子》' },
        { line: '衣带渐宽终不悔，为伊消得人憔悴', source: '—— 柳永《蝶恋花》' },
        { line: '只愿君心似我心，定不负相思意', source: '—— 李之仪《卜算子》' },
        { line: '海上生明月，天涯共此时', source: '—— 张九龄《望月怀远》' },
        { line: '执子之手，与子偕老', source: '—— 《诗经·邶风·击鼓》' },
    ];

    let quoteIndex = 0;
    const quoteLine = document.getElementById('quoteLine');
    const quoteSource = document.getElementById('quoteSource');

    function rotateQuote() {
        if (!quoteLine) return;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteLine.style.opacity = '0';
        quoteSource.style.opacity = '0';
        setTimeout(function() {
            quoteLine.textContent = quotes[quoteIndex].line;
            quoteSource.textContent = quotes[quoteIndex].source;
            quoteLine.style.opacity = '1';
            quoteSource.style.opacity = '1';
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

    // ========================================
    // Generate Poem
    // ========================================
    // --- Generate Poem ---
    window._generatePoem = generatePoem;
    generateBtn.addEventListener('click', function() {
        window._generatePoem();
    });

    async function generatePoem() {
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
                const err = await response.json().catch(function() { return { error: 'Unknown error' }; });
                throw new Error(err.error || 'HTTP ' + response.status);
            }

            const data = await response.json();
            currentPoem = data;
            renderPreview(data);
            renderFullContent(data);

            previewSection.classList.remove('hidden');
            lockedContent.classList.remove('hidden');
            fullContent.classList.add('hidden');
            poemActions.classList.add('hidden');

            // Set LemonSqueezy buy link
            var lsCheckoutUrl = 'https://pitcore.lemonsqueezy.com/checkout/buy/5ab101b8-c266-4014-974c-f55ada057086';
            var currentPage = window.location.href.split('?')[0];
            lsBuyBtn.href = lsCheckoutUrl + '?checkout[redirect_url]=' + encodeURIComponent(currentPage + '?success=true');
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
        var lines = data.chinese.split('\n').filter(function(l) { return l.trim(); });
        var previewLines = lines.slice(0, Math.min(4, lines.length));
        previewChinese.textContent = previewLines.join('\n');
        var restLines = lines.slice(4);
        blurredChinese.textContent = restLines.length > 0 ? restLines.join('\n') : '... ✦ ...';
        blurredEnglish.textContent = data.english || '';
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
        y += 40;
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
    // LemonSqueezy Payment Check
    // ========================================

    function checkPendingPoem() {
        var pending = sessionStorage.getItem('pendingPoem');
        var urlParams = new URLSearchParams(window.location.search);
        var checkoutId = urlParams.get('checkout');

        if (pending && (checkoutId || urlParams.get('success'))) {
            sessionStorage.removeItem('pendingPoem');
            var poem = JSON.parse(pending);
            currentPoem = poem;
            renderPreview(poem);
            renderFullContent(poem);
            previewSection.classList.remove('hidden');
            lockedContent.classList.add('hidden');
            fullContent.classList.remove('hidden');
            poemActions.classList.remove('hidden');
        }
    }

    // Check for successful payment on page load
    checkPendingPoem();

    // ========================================
    // Init
    // ========================================

    applyLang('zh');

})();
