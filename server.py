"""PoemForTwo 测试服务器"""
import http.server, json, urllib.request, ssl, os, urllib.parse

API_KEY = os.environ.get('DEEPSEEK_API_KEY')
if not API_KEY:
    raise Exception('DEEPSEEK_API_KEY environment variable is required')
PORT = 3000
ROOT = os.path.dirname(os.path.abspath(__file__))

PROMPTS = {
    'love':{'s':'古典诗词风格，仿宋词或七言绝句','sys':'你是一位擅长写古典情诗的诗人。你的诗有格律、有韵脚、有意境。'},
    'married':{'s':'古典诗词风格，温厚深沉','sys':'你是一位历经风雨的诗人。你的诗取法唐诗或宋词，写白头偕老的深情。'},
    'longdistance':{'s':'古典诗词风格，婉约含蓄','sys':'你是一位婉约派词人。你的诗有李清照式的细腻。'},
    'crush':{'s':'古典诗词风格，朦胧含蓄','sys':'你是一位写心事的诗人。你的诗像花间词一样婉转。'},
    'engagement':{'s':'古典诗词风格，喜庆庄重','sys':'你是一位写庆贺的诗人。你的诗有《诗经》的喜庆。'},
    'reunited':{'s':'古典诗词风格，感慨深情','sys':'你是一位写重逢的诗人。你的诗取法李商隐。'},
    'parent':{'s':'古典诗词风格，深沉感恩','sys':'你是一位写亲情的诗人。你的诗像《游子吟》一样质朴。'},
    'child':{'s':'古典诗词风格，温厚慈爱','sys':'你是一位写舐犊之情的诗人。'},
    'sibling':{'s':'古典诗词风格，亲切自然','sys':'你是一位写手足之情的诗人。取法王维。'},
    'grandparent':{'s':'古典诗词风格，敬重怀念','sys':'你是一位写给长辈的诗人。'},
    'bestfriend':{'s':'古典诗词风格，真挚洒脱','sys':'你是一位写友情的诗人。有李白赠友人的洒脱。'},
    'soulmate':{'s':'古典诗词风格，深刻宿命','sys':'你是一位写知己的诗人。有高山流水的意境。'},
    'pet':{'s':'古典诗词风格，轻巧有趣','sys':'你是一位写小生灵的诗人。有杨万里咏物的意趣。'},
    'self':{'s':'古典诗词风格，励志沉着','sys':'你是一位写自勉的诗人。有李白的豪气。'},
    'memorial':{'s':'古典诗词风格，庄重克制','sys':'你是一位写悼念的诗人。取法苏轼《江城子》。'},
    'mentor':{'s':'古典诗词风格，尊敬感恩','sys':'你是一位写师恩的诗人。有韩愈《师说》的敬意。'},
}
DEFAULT = {'s':'古典诗词风格','sys':'你是一位诗人。'}

def call_deepseek(rel, n1, n2, story):
    p = PROMPTS.get(rel, DEFAULT)
    user = f'''写一首古体诗词。关系：{p['s']}。诗中涉及的名字：{n1} 和 {n2}。
他们的故事：{story or '无'}

要求：
1. 古体诗词（五言绝句、七言绝句、宋词小令等均可）
2. 要有格律、韵脚、意境
3. 诗题自拟
4. 融入他们的名字或故事元素
5. 输出三个版本：
   - 中文诗
   - 英文翻译版（英诗风格，押韵）
   - 英文译意版（散文风格，解释用典和文化背景）
6. 风格：{p['s']}

输出格式：
诗题
——致[对方名字]

[中文诗正文]

✦ ✦ ✦

[English Translation - Poetic]
[英诗押韵翻译]

✦ ✦ ✦

[English Interpretation]
[逐行解释，包括用典和文化背景]'''
    ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions',
        data=json.dumps({'model':'deepseek-chat','messages':[{'role':'system','content':p['sys']},{'role':'user','content':user}],'temperature':0.8,'max_tokens':2000}).encode(),
        headers={'Authorization':f'Bearer {API_KEY}','Content-Type':'application/json'}, method='POST')
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        text = json.loads(resp.read())['choices'][0]['message']['content']
    parts = text.split('✦')
    cn = parts[0].strip() if parts else text
    en = parts[1].strip() if len(parts) > 1 else ''
    interp = parts[2].strip() if len(parts) > 2 else ''
    lines = cn.split('\n')
    title = '诗一首'
    for l in lines[:8]:
        t = l.strip()
        if t and not t.startswith('—') and not t.startswith('✦') and len(t) < 30:
            title = t; break
    return {'title':title,'name1':n1,'name2':n2,'chinese':cn,'english':en,'interpret':interp}

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/generate-poem':
            cl = int(self.headers.get('Content-Length',0))
            b = json.loads(self.rfile.read(cl))
            try:
                r = call_deepseek(b.get('relationship','love'), b.get('name1',''), b.get('name2',''), b.get('story',''))
                self.send_response(200); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*')
                self.end_headers(); self.wfile.write(json.dumps(r).encode())
            except Exception as e:
                self.send_response(500); self.send_header('Content-Type','application/json'); self.send_header('Access-Control-Allow-Origin','*')
                self.end_headers(); self.wfile.write(json.dumps({'error':str(e)}).encode())
    def do_OPTIONS(self):
        self.send_response(200); self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','POST,OPTIONS'); self.send_header('Access-Control-Allow-Headers','Content-Type')
        self.end_headers()

if __name__ == '__main__':
    os.chdir(ROOT); http.server.HTTPServer(('0.0.0.0',PORT), Handler).serve_forever()
