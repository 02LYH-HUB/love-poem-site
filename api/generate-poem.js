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
        style: '古典诗词风格，仿宋词或七言绝句',
        system: '你是一位擅长写古典情诗的诗人。你的诗有格律、有韵脚、有意境，用古诗词的方式表达最深的爱意。诗句工整，可五言可七言。'
    },
    married: {
        style: '古典诗词风格，温厚深沉，像岁月沉淀的感悟',
        system: '你是一位历经风雨的诗人。你的诗取法唐诗或宋词，用古典的笔法写白头偕老的深情。质朴但有力量，字字珠玑。'
    },
    longdistance: {
        style: '古典诗词风格，婉约含蓄，带思念但不哀怨',
        system: '你是一位婉约派词人。你的诗有李清照式的细腻和王维式的空灵，写相思但不写绝离，字里行间都是漫长的等待。'
    },
    crush: {
        style: '古典诗词风格，朦胧含蓄，如花间词',
        system: '你是一位写心事的诗人。你的诗像花间词一样婉转，像藏在心底不敢说出口的暗恋。含蓄而美好，清新而不轻浮。'
    },
    engagement: {
        style: '古典诗词风格，喜庆庄重，有典礼感',
        system: '你是一位写庆贺的诗人。你的诗有《诗经》中"桃之夭夭"般的喜庆，用古典的仪礼感祝福一段良缘。'
    },
    reunited: {
        style: '古典诗词风格，感慨深情，久别重逢如隔世',
        system: '你是一位写重逢的诗人。你的诗取法杜甫或李商隐，写久别重逢的动容和时光流转的感慨。'
    },
    parent: {
        style: '古典诗词风格，深沉感恩，如游子吟',
        system: '你是一位写亲情的诗人。你的诗像孟郊的《游子吟》一样质朴深情，用最简单的古体诗语言写最深的感恩。'
    },
    child: {
        style: '古典诗词风格，温厚慈爱，如写给孩子的家书',
        system: '你是一位写舐犊之情的诗人。你的诗温柔而不甜腻，像一封用古诗写的家信，包含着期盼和不舍。'
    },
    sibling: {
        style: '古典诗词风格，亲切自然，如王维的兄弟诗',
        system: '你是一位写手足之情的诗人。你的诗自然亲切，取法王维与兄弟酬唱的诗作，写一起长大的点滴回忆。'
    },
    grandparent: {
        style: '古典诗词风格，敬重怀念，有岁月感',
        system: '你是一位写给长辈的诗人。你的诗沉静有分量，像写给岁月的敬辞，表达深深的敬爱和感恩。'
    },
    bestfriend: {
        style: '古典诗词风格，真挚洒脱，如李白的赠友诗',
        system: '你是一位写友情的诗人。你的诗有李白赠友人的洒脱和真挚，不事雕琢，肝胆相照。'
    },
    soulmate: {
        style: '古典诗词风格，深刻宿命，如千古知音',
        system: '你是一位写知己的诗人。你的诗有"高山流水"的意境，写灵魂相遇的震撼和珍惜。诗句可化用典故，但不晦涩。'
    },
    pet: {
        style: '古典诗词风格，轻巧有趣，可仿古诗谐趣体',
        system: '你是一位写小生灵的诗人。你的诗用古风写现代的萌宠，轻巧有趣，有杨万里咏物的意趣，让人会心一笑。'
    },
    self: {
        style: '古典诗词风格，励志沉着，如古诗自勉篇',
        system: '你是一位写自勉的诗人。你的诗有李白"长风破浪会有时"的豪气，也有陶渊明的淡泊，写给自己的一份沉静力量。'
    },
    memorial: {
        style: '古典诗词风格，庄重克制，如挽歌或悼亡诗',
        system: '你是一位写悼念的诗人。你的诗取法元稹《遣悲怀》或苏轼《江城子》，庄重而克制，像一盏安静的烛光，不煽情但有力量。'
    },
    mentor: {
        style: '古典诗词风格，尊敬感恩，如谢师篇',
        system: '你是一位写师恩的诗人。你的诗有韩愈《师说》的敬意，用古典的笔法写对引路人的感恩，庄重而不谄媚。'
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
1. 写一首古体诗词（五言绝句、七言绝句、宋词小令等均可），8-16行
2. 要有古典韵味：讲格律、有韵脚、有意境
3. 诗题自拟，用古典诗题风格
4. 诗的内容要融入他们的名字或故事元素
5. 输出三个版本：
   - 中文诗（原创古诗词）
   - 英文翻译版（英诗风格，押韵，保持诗意，可适当意译）
   - 英文译意版（散文风格，逐行解释中文诗的真实含义、用典和文化背景，帮助外国人理解诗的深层意思）
6. 整体风格是：${prompt.style}

输出格式：
诗题
——致[对方名字]

[中文诗正文]

✦ ✦ ✦

[English Translation - Poetic]
[英诗风格翻译]

✦ ✦ ✦

[English Interpretation]
[逐行解释，包括用典和文化背景说明]`;

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
    let title = '诗一首';
    let chinese = '';
    let english = '';
    let interpret = '';

    const lines = text.split('\n').filter(l => l.trim());

    // Extract title
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('——') && !line.startsWith('—') && !line.startsWith('✦') && !line.startsWith('*') && line.length < 40) {
            title = line.replace(/^[#\s《》「」""]+/, '').replace(/[#\s《》「」""]+$/, '').trim();
            break;
        }
    }

    // Split by separators: find three sections separated by ✦✦✦
    const parts = text.split(/[✦✧]{3,}/).map(p => p.trim());

    if (parts.length >= 3) {
        chinese = parts[0].replace(/^[——\-—\s]+/gm, '').replace(/^致[：:]/m, '').trim();
        english = parts[1].replace(/^[——\-—\s✦]+/gm, '').replace(/^To\s+\S+/m, '').replace(/^\[English Translation[^\]]*\]/m, '').trim();
        interpret = parts[2].replace(/^[——\-—\s✦]+/gm, '').replace(/^\[English Interpretation[^\]]*\]/m, '').trim();
    } else if (parts.length === 2) {
        chinese = parts[0].replace(/^[——\-—\s]+/gm, '').replace(/^致[：:]/m, '').trim();
        english = parts[1].replace(/^[——\-—\s✦]+/gm, '').trim();
        interpret = '';
    } else {
        chinese = text.replace(/^[——\-—\s]+/gm, '').trim();
    }

    return {
        title: title,
        name1: name1,
        name2: name2,
        chinese: chinese || '...',
        english: english || '',
        interpret: interpret || ''
    };
}
