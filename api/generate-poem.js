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
        style: '热恋',
        system: '你是一位擅长写古典情诗的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句有格律、有韵脚、有意境，用古诗词的方式表达最深的爱意。诗句工整。'
    },
    married: {
        style: '已婚',
        system: '你是一位历经风雨的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句取法唐诗或宋词，用古典的笔法写白头偕老的深情。质朴但有力量。'
    },
    longdistance: {
        style: '异地',
        system: '你是一位婉约派词人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句有李清照式的细腻，写相思但不写绝离。'
    },
    crush: {
        style: '暗恋',
        system: '你是一位写心事的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句像花间词一样婉转，含蓄而美好。'
    },
    engagement: {
        style: '订婚',
        system: '你是一位写庆贺的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句有《诗经》般的喜庆，用古典的仪礼感祝福一段良缘。'
    },
    reunited: {
        style: '重逢',
        system: '你是一位写重逢的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句取法杜甫或李商隐，写久别重逢的动容。'
    },
    parent: {
        style: '父母',
        system: '你是一位写亲情的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句像孟郊的《游子吟》一样质朴深情。'
    },
    child: {
        style: '孩子',
        system: '你是一位写舐犊之情的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句温柔而不甜腻，像一封用古诗写的家信。'
    },
    sibling: {
        style: '手足',
        system: '你是一位写手足之情的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句自然亲切，写一起长大的点滴回忆。'
    },
    grandparent: {
        style: '祖辈',
        system: '你是一位写给长辈的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句沉静有分量，表达深深的敬爱。'
    },
    bestfriend: {
        style: '挚友',
        system: '你是一位写友情的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句有李白赠友人的洒脱和真挚。'
    },
    soulmate: {
        style: '知己',
        system: '你是一位写知己的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景和细节来写，不能自己编造。诗句有"高山流水"的意境，写灵魂相遇的珍惜。'
    },
    pet: {
        style: '宠物',
        system: '你是一位写宠物的诗人。写诗前先仔细阅读用户讲的故事，确定故事中是什么动物（狗/猫/鸟/兔子/猪等），然后严格按照故事中的细节来写那种动物。诗句轻巧有趣，让人会心一笑。最重要的规则：用户写什么动物就写什么，不能自己换。'
    },
    self: {
        style: '自勉',
        system: '你是一位写自勉的诗人。写诗前先仔细阅读用户写的故事，必须严格按照真实经历来写，不能编造。诗句有李白"长风破浪会有时"的豪气，也有陶渊明的淡泊。'
    },
    memorial: {
        style: '悼念',
        system: '你是一位写悼念的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实回忆来写，不能编造。诗句庄重而克制，不煽情但有力量。'
    },
    mentor: {
        style: '师恩',
        system: '你是一位写师恩的诗人。写诗前先仔细阅读用户讲的故事，必须严格按照故事中的真实场景来写，不能编造。诗句用古典的笔法写对引路人的感恩。'
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
        const { relationship, name1, name2, story, format } = req.body;

        if (!relationship || !name1 || !name2) {
            return res.status(400).json({ error: 'Missing required fields: relationship, name1, name2' });
        }

        const prompt = PROMPTS[relationship] || DEFAULT_PROMPT;

        // Build the user prompt with format
        var formatSpec = '';
        if (format === 'wuyan') {
            formatSpec = '五言律诗，每句5字，共8句';
        } else {
            formatSpec = '七言律诗，每句7字，共8句';
        }
        let userPrompt = `写一首诗。\n\n关系：${prompt.style}\n风格要求：${prompt.style}\n\n诗中涉及的名字：${name1} 和 ${name2}`;

        if (story && story.trim()) {
            userPrompt += `\n\n他们的故事：${story.trim()}`;
        }

        userPrompt += `\n\n要求：
1. 写一首${formatSpec}
2. 要有古典韵味：讲格律、有韵脚、有意境
3. 诗题自拟，用古典诗题风格
4. 诗的内容要融入他们的名字或故事元素。如果名字是英文，请将其音译成中文写进诗中（包括诗句、诗题和"致"行，都不能出现英文字母，如 Bob → 鲍勃，Alice → 爱丽丝），诗中不能出现英文字母
5. **只写一首诗**，不要写多个版本或附加注释
6. **必须严格依据用户讲的故事来写**——诗中的场景、角色、情节必须与故事完全一致，不能编造未提及的人或物
7. 必须且严格按照以下格式输出，用 ✦ ✦ ✦ 分隔三个部分：

诗题
——致[对方名字]

[中文诗正文]

✦ ✦ ✦

[English Translation - Poetic]
（英诗风格，押韵，翻译上面的中文诗）

✦ ✦ ✦

[English Interpretation]
（用英文逐行或分段解释诗的含义和意境。不要做自我评价，不要说"没有用典""忠实于故事"这类元评论，只说诗的内容本身）

注意：不要写注释，不要写版本说明，严格按照上述格式。输出时直接写内容，不要写"[English Translation - Poetic]"这类标签，直接写英文翻译内容。必须用✦ ✦ ✦分隔三个部分，否则无法解析。`;

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

    // Split by separators: try ✦ first (with optional spaces), fallback to ---
    var separator = /[✦✧][\s]*[✦✧][\s]*[✦✧]/;
    if (!separator.test(text) && text.includes('---')) {
        separator = /---+/;
    }
    var parts = text.split(separator).map(function(p) { return p.trim(); });

    // Fallback: if no separator found, try to detect English sections
    if (parts.length < 2 && text.match(/[a-zA-Z]{20,}/)) {
        // Has substantial English text - split by double newline or common patterns
        var sections = text.split(/\n\n\n+/);
        if (sections.length >= 3) {
            parts = sections;
        } else if (sections.length === 2) {
            parts = sections;
        }
    }

    if (parts.length >= 3) {
        chinese = parts[0].replace(/^[——\-—\s]+/gm, '').replace(/^致[：:]/m, '').replace(/^\*\*.+?\*\*/gm, '').trim();
        english = parts[1]
            .replace(/^[——\-—\s✦]+/gm, '')
            .replace(/^To\s+\S+/m, '')
            .replace(/^\[?English Translation[^\]]*\]?[\s]*/gm, '')
            .replace(/^\*\*.+?\*\*/gm, '')
            .replace(/^[\[\(]?[A-Z][a-z]+ [A-Z][a-z]+[ -].*[\]]?$/gm, '')
            .trim();
        interpret = parts[2]
            .replace(/^[——\-—\s✦]+/gm, '')
            .replace(/^\[?English Interpretation[^\]]*\]?[\s]*/gm, '')
            .replace(/^\*\*.+?\*\*/gm, '')
            .trim();
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
