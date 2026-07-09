// ========================================
// PoemForTwo - API: Generate Poem
// Vercel Serverless Function
// ========================================

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

// ========================================
// Prompt Templates by Relationship
// ========================================

const PROMPTS = {
    love: {
        style: '浪漫甜蜜，现代诗风格，温暖而深情',
        system: '你是一位擅长写爱情诗的中国诗人。你的诗深情、细腻、有画面感，像一首可以收藏的情书。'
    },
    married: {
        style: '深沉温暖，像岁月沉淀后的感悟，质朴但有力量',
        system: '你是一位经历过漫长岁月的诗人。你的诗不追求华丽的辞藻，而是用最朴实的语言讲述最深的感情。'
    },
    longdistance: {
        style: '思念、期待、温柔的等待，带着淡淡的忧伤但不绝望',
        system: '你是一位懂异地恋的诗人。你的诗表达思念但不哀怨，写距离但不写分离，字里行间都是"我在等你"。'
    },
    crush: {
        style: '含蓄、美好、小心翼翼，像春天的风',
        system: '你是一位写暗恋的诗人。你的诗朦胧而美好，像不敢说出口的心事，又像藏在心底的秘密花园。'
    },
    engagement: {
        style: '喜庆、庄重、充满希望，像春天的请柬',
        system: '你是一位写祝福的诗人。你的诗有仪式感，庄重但不刻板，喜庆但不浮夸。'
    },
    reunited: {
        style: '感慨、温暖、如释重负，久别重逢的喜悦',
        system: '你是一位写重逢的诗人。时间在你们之间留下了痕迹，但重逢让一切都值得。'
    },
    parent: {
        style: '感恩、深情、像一封写给父母的家书',
        system: '你是一位写亲情的诗人。你的诗温暖、感恩，像孩子写给父母的一封迟到的信。'
    },
    child: {
        style: '温柔、期待、像写给未来的信',
        system: '你是一位写给孩子或后辈的诗人。你的诗温柔、充满期望，又带着一点不舍。'
    },
    sibling: {
        style: '亲切、自然、像一起长大的回忆',
        system: '你是一位写手足之情的诗人。你的诗亲切、自然，像小时候一起走过的路。'
    },
    grandparent: {
        style: '敬爱、怀念、像写给岁月的信',
        system: '你是一位写给长辈的诗人。你的诗尊敬、温暖，带着时光的厚重感。'
    },
    bestfriend: {
        style: '轻松、真诚、像深夜的谈心',
        system: '你是一位写友情的诗人。你的诗轻松而真挚，像好朋友之间不需要修饰的真心话。'
    },
    soulmate: {
        style: '宿命感、深刻、像灵魂的共鸣',
        system: '你是一位写灵魂伴侣的诗人。你的诗深刻、有宿命感，像两个灵魂穿越人海终于相遇的故事。'
    },
    pet: {
        style: '可爱、温暖、像日常的小确幸',
        system: '你是一位写宠物的诗人。你的诗温暖、有趣，像记录生活中那些毛茸茸的小幸福。'
    },
    self: {
        style: '励志、温柔、像写给自己的拥抱',
        system: '你是一位写自勉的诗人。你的诗温柔而坚定，像在疲惫时给自己的一杯热茶。'
    },
    memorial: {
        style: '庄重、简朴、有力量但不悲伤过度',
        system: '你是一位写纪念的诗人。你的诗庄重而克制，表达思念但不沉溺于悲伤，像一盏安静的烛光。'
    },
    mentor: {
        style: '尊敬、感恩、像写给引路人的谢辞',
        system: '你是一位写师恩的诗人。你的诗尊敬而不谄媚，感恩而不煽情。'
    }
};

// Fallback for unknown relationships
const DEFAULT_PROMPT = {
    style: '真诚、温暖、自然',
    system: '你是一位真诚的诗人，你的诗发自内心，温暖而自然。'
};

// ========================================
// Main Handler
// ========================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Validate API key
    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { relationship, name1, name2, story } = req.body;

        if (!relationship || !name1 || !name2) {
            return res.status(400).json({ error: 'Missing required fields: relationship, name1, name2' });
        }

        const prompt = PROMPTS[relationship] || DEFAULT_PROMPT;

        // Build the user prompt
        let userPrompt = `写一首诗。\n\n关系：${prompt.style}\n风格要求：${prompt.style}\n\n诗中涉及的名字：${name1} 和 ${name2}`;

        if (story && story.trim()) {
            userPrompt += `\n\n他们的故事：${story.trim()}`;
        }

        userPrompt += `\n\n要求：
1. 写一首中文诗，8-16行，根据关系类型决定长度
2. 诗题自拟，要有诗意
3. 诗的内容要融入他们的名字或故事元素
4. 附上英文翻译版（意译，保持诗意，不要直译）
5. 整体风格是：${prompt.style}

输出格式：
诗题
——致 [对方名字]

[中文诗正文]

✦ ✦ ✦

[English Title]
To [Name]

[English translation]`;

        // Call DeepSeek
        const response = await fetch(DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: prompt.system },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.8,
                max_tokens: 1500,
                stream: false
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('DeepSeek API error:', response.status, errText);
            return res.status(502).json({ error: 'AI service error' });
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            return res.status(502).json({ error: 'Empty response from AI' });
        }

        // Parse the response into structured fields
        const parsed = parsePoem(text, name1, name2);

        return res.status(200).json(parsed);

    } catch (err) {
        console.error('Handler error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// ========================================
// Parse AI Response
// ========================================

function parsePoem(text, name1, name2) {
    // Default values
    let title = '诗一首';
    let chinese = text;
    let english = '';

    // Try to extract title (first non-empty line without special chars)
    const lines = text.split('\n').filter(l => l.trim());

    // Find title: first line that's not a separator or empty
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('——') && !line.startsWith('—') && !line.startsWith('✦') && !line.startsWith('*') && line.length < 40) {
            title = line.replace(/^[#\s《》「」""]+/, '').replace(/[#\s《》「」""]+$/, '').trim();
            break;
        }
    }

    // Try to split Chinese and English
    // Look for separator patterns: ✦ ✦ ✦, ---, — ✦ —, etc.
    const sepIndex = text.search(/[✦✧\*\-—]{3,}/);
    if (sepIndex > 0) {
        chinese = text.substring(0, sepIndex).trim();
        english = text.substring(sepIndex).replace(/[✦✧\*\-—\s]{3,}/g, '').trim();

        // Remove "English Title" line from english if present
        english = english.replace(/^[A-Z][^。\n]{2,50}\n*/m, '').trim();
        english = english.replace(/^To\s+\S+/m, '').trim();
    } else {
        // Fallback: try to find English part by looking for latin text blocks
        const paraMatch = text.match(/([A-Z][^。\n]{20,}[\s\S]*)/);
        if (paraMatch && paraMatch[1].length > 50) {
            const idx = text.indexOf(paraMatch[1]);
            if (idx > 0) {
                chinese = text.substring(0, idx).trim();
                english = paraMatch[1].trim();
            }
        }
    }

    // Clean up
    chinese = chinese
        .replace(/^[——\-—\s]+/gm, '')
        .replace(/^致[：:]/m, '')
        .trim();

    english = english
        .replace(/^[——\-—\s✦]+/gm, '')
        .replace(/^To\s+\S+/m, '')
        .trim();

    return {
        title: title,
        name1: name1,
        name2: name2,
        chinese: chinese,
        english: english || 'Translation coming soon...'
    };
}
