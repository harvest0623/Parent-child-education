import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast, DotLoading } from 'antd-mobile'
import Skeleton from '../Components/Skeleton.jsx'
import '../Styles/LearnPoem.less'

const POEMS = [
    {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐代',
        theme: '思乡',
        content: '床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。',
        background: '这首诗写于李白旅居扬州的一个月夜，诗人看到月光洒在床前，误以为是地上的秋霜。抬头望见明月，不禁低头思念起远方的故乡。语言朴素自然，却蕴含着深沉的思乡之情。',
        annotation: '床：这里指井栏或坐具。疑：怀疑，以为。举头：抬头。思：思念。',
        appreciation: '全诗构思巧妙，以“月”为媒介，把眼前的景、心中的情和远方的故乡联系起来。前两句写“望月之景”，后两句写“思乡之情”，情景交融，余味悠长。',
        authorBio: '李白（701—762），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。其诗风豪放飘逸，想象丰富。',
        related: [11, 13],
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '🌙',
        difficulty: 1
    },
    {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐代',
        theme: '写景',
        content: '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。',
        background: '这首诗描写了春天早晨诗人从睡梦中醒来，听到鸟鸣、回想夜雨的生动情景，表达了对春天的喜爱和对落花的惋惜。',
        annotation: '晓：天亮。闻：听到。夜来：昨夜。',
        appreciation: '诗人不写春光如何明媚，而是从听觉入手，以“啼鸟”“风雨声”勾勒出一个生机盎然又略带惜春的清晨，言简意丰。',
        authorBio: '孟浩然（689—740），唐代山水田园诗人，与王维并称“王孟”。其诗清淡自然，多写山水田园和隐逸生活。',
        related: [12, 16],
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        emoji: '🌸',
        difficulty: 1
    },
    {
        id: 3,
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐代',
        theme: '哲理',
        content: '白日依山尽，\n黄河入海流。\n欲穷千里目，\n更上一层楼。',
        background: '诗人登上鹳雀楼，极目远眺，看到夕阳西下、黄河东流的壮阔景象，由此生发出“站得高才能看得远”的人生哲理。',
        annotation: '白日：夕阳。依：依傍。穷：尽，使达到极点。更：再。',
        appreciation: '前两句写景雄浑开阔，后两句由景入理，既写出了积极向上的进取精神，又蕴含深刻哲理，成为千古名句。',
        authorBio: '王之涣（688—742），唐代边塞诗人，擅长五言绝句，作品多描写边塞风光和军旅生活。',
        related: [14],
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        emoji: '🏔️',
        difficulty: 1
    },
    {
        id: 4,
        title: '悯农（其二）',
        author: '李绅',
        dynasty: '唐代',
        theme: '爱国',
        content: '锄禾日当午，\n汗滴禾下土。\n谁知盘中餐，\n粒粒皆辛苦。',
        background: '这首诗通过描写农民在烈日下劳作的艰辛，告诫人们要珍惜粮食，体谅农民的辛苦，体现了诗人对劳动人民的同情。',
        annotation: '锄禾：给禾苗锄草。日当午：太阳正当头顶，指中午。餐：饭食。',
        appreciation: '语言质朴如话，却字字千钧。诗人把农民的血汗与盘中之餐联系起来，以小见大，发人深省。',
        authorBio: '李绅（772—846），字公垂，唐代诗人。其《悯农》二首流传极广，深刻反映了农民的疾苦。',
        related: [6, 8],
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        emoji: '🌾',
        difficulty: 1
    },
    {
        id: 5,
        title: '咏鹅',
        author: '骆宾王',
        dynasty: '唐代',
        theme: '咏物',
        content: '鹅，鹅，鹅，\n曲项向天歌。\n白毛浮绿水，\n红掌拨清波。',
        background: '相传这是骆宾王七岁时写的诗。诗人以儿童的眼光观察白鹅，用简洁生动的语言描绘出鹅戏水的可爱形象。',
        annotation: '曲项：弯曲的脖子。拨：划动。清波：清澈的水波。',
        appreciation: '首句模拟鹅的叫声，充满童趣；后三句从形态、颜色、动作多角度描写，画面鲜活，音韵优美。',
        authorBio: '骆宾王（约619—687），唐代诗人，初唐四杰之一。其诗气势充沛，善于铺陈。',
        related: [2, 12],
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        emoji: '🦢',
        difficulty: 1
    },
    {
        id: 6,
        title: '望庐山瀑布',
        author: '李白',
        dynasty: '唐代',
        theme: '写景',
        content: '日照香炉生紫烟，\n遥看瀑布挂前川。\n飞流直下三千尺，\n疑是银河落九天。',
        background: '诗人游览庐山，被香炉峰瀑布的壮丽景色所震撼，用夸张和想象的手法描绘了瀑布从天而降的奇景。',
        annotation: '香炉：指庐山香炉峰。紫烟：日光照射下云雾呈现紫色。九天：极高的天空。',
        appreciation: '诗人运用夸张、想象和比喻，把静态的瀑布写得气势磅礴、光彩夺目，展现了李白诗歌雄奇奔放的艺术特色。',
        authorBio: '李白（701—762），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。',
        related: [1, 13],
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        emoji: '💧',
        difficulty: 2
    },
    {
        id: 7,
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐代',
        theme: '写景',
        content: '千山鸟飞绝，\n万径人踪灭。\n孤舟蓑笠翁，\n独钓寒江雪。',
        background: '诗人被贬永州后，借寒江独钓的渔翁形象，表达了自己孤傲清高、不同流合污的情怀。',
        annotation: '绝：尽，没有。径：小路。蓑笠：蓑衣和斗笠。',
        appreciation: '全诗以“千万孤独”之意象营造空旷寂寥之境，最后聚焦于“独钓”的渔翁，画面极简而意境深远。',
        authorBio: '柳宗元（773—819），字子厚，唐代文学家、哲学家，唐宋八大家之一。其诗清峭幽远，富有哲理。',
        related: [9],
        gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        emoji: '❄️',
        difficulty: 2
    },
    {
        id: 8,
        title: '游子吟',
        author: '孟郊',
        dynasty: '唐代',
        theme: '思乡',
        content: '慈母手中线，\n游子身上衣。\n临行密密缝，\n意恐迟迟归。\n谁言寸草心，\n报得三春晖。',
        background: '诗人临行前，母亲为他缝制衣服。诗人触景生情，以“寸草心”与“三春晖”作比，歌颂了伟大的母爱。',
        annotation: '游子：离家远游的人。意恐：担心。寸草：小草，比喻子女。三春晖：春天的阳光，比喻母爱。',
        appreciation: '前四句白描母爱之细，后两句以生动比喻升华主题，语言质朴而情感浓烈，成为讴歌母爱的千古名篇。',
        authorBio: '孟郊（751—814），字东野，唐代诗人。其诗多寒涩之语，善于抒发穷愁孤苦之情。',
        related: [1, 11],
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        emoji: '🧵',
        difficulty: 2
    },
    {
        id: 9,
        title: '出塞',
        author: '王昌龄',
        dynasty: '唐代',
        theme: '爱国',
        content: '秦时明月汉时关，\n万里长征人未还。\n但使龙城飞将在，\n不教胡马度阴山。',
        background: '这首诗慨叹边战不断、良将难得，表达了诗人希望起用良将、早日平息边塞战事的愿望。',
        annotation: '秦时明月汉时关：互文见义，指秦汉时的明月和边关。但使：只要。不教：不让。',
        appreciation: '首句时空开阔，气势雄浑；后两句直抒胸臆，既有对历史名将的追怀，也有对国家安宁的期盼。',
        authorBio: '王昌龄（698—757），字少伯，唐代著名边塞诗人，有“七绝圣手”之称。',
        related: [7, 15],
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '⚔️',
        difficulty: 3
    },
    {
        id: 10,
        title: '送元二使安西',
        author: '王维',
        dynasty: '唐代',
        theme: '送别',
        content: '渭城朝雨浥轻尘，\n客舍青青柳色新。\n劝君更尽一杯酒，\n西出阳关无故人。',
        background: '诗人送别友人赴西北边塞，清晨细雨过后，客舍周围柳树青翠。诗人举杯劝酒，表达对友人远行的关切与不舍。',
        annotation: '浥：湿润。客舍：旅店。阳关：古代关名，在今甘肃敦煌西南。',
        appreciation: '全诗情景交融，后两句以朴素语言写出深沉友情，成为送别名作，后被谱为《阳关三叠》传唱不衰。',
        authorBio: '王维（701—761），字摩诘，唐代诗人、画家，山水田园诗派代表，有“诗佛”之称。',
        related: [11],
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        emoji: '🍃',
        difficulty: 2
    },
    {
        id: 11,
        title: '九月九日忆山东兄弟',
        author: '王维',
        dynasty: '唐代',
        theme: '思乡',
        content: '独在异乡为异客，\n每逢佳节倍思亲。\n遥知兄弟登高处，\n遍插茱萸少一人。',
        background: '诗人独自客居他乡，恰逢重阳佳节，思念远方的亲人，想象兄弟们登高插茱萸时也会因少他一人而感到遗憾。',
        annotation: '异乡：他乡。佳节：美好的节日，这里指重阳节。茱萸：一种香草，重阳节有佩戴茱萸的习俗。',
        appreciation: '“每逢佳节倍思亲”一句直抒胸臆，道出了游子共同的情感体验；后两句从对面落笔，更见深情。',
        authorBio: '王维（701—761），字摩诘，唐代诗人、画家，山水田园诗派代表。',
        related: [1, 8],
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        emoji: '🏔️',
        difficulty: 2
    },
    {
        id: 12,
        title: '小池',
        author: '杨万里',
        dynasty: '宋代',
        theme: '写景',
        content: '泉眼无声惜细流，\n树阴照水爱晴柔。\n小荷才露尖尖角，\n早有蜻蜓立上头。',
        background: '这首诗描写了初夏小池的美丽景色，泉眼、树阴、嫩荷、蜻蜓构成了一幅清新自然、充满生机的画面。',
        annotation: '泉眼：泉水流出的地方。惜：爱惜。晴柔：晴天柔和的风光。',
        appreciation: '诗人以拟人手法赋予泉眼、树阴以情感，后两句捕捉“小荷初露”的瞬间，画面玲珑剔透，充满生活情趣。',
        authorBio: '杨万里（1127—1206），字廷秀，号诚斋，南宋诗人，创“诚斋体”，语言活泼自然。',
        related: [2, 5],
        gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        emoji: '🪷',
        difficulty: 1
    },
    {
        id: 13,
        title: '望天门山',
        author: '李白',
        dynasty: '唐代',
        theme: '写景',
        content: '天门中断楚江开，\n碧水东流至此回。\n两岸青山相对出，\n孤帆一片日边来。',
        background: '诗人乘船经过天门山，看到长江劈山而过、两岸青山对峙的壮观景象，写下这首气势磅礴的诗。',
        annotation: '中断：从中间断开。楚江：长江流经古代楚地，故称楚江。回：回旋。',
        appreciation: '“断”“开”“流”“回”“出”“来”等动词一气呵成，把静止的山写得富有动感，展现了大自然的雄奇壮美。',
        authorBio: '李白（701—762），字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。',
        related: [6, 1],
        gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
        emoji: '⛰️',
        difficulty: 2
    },
    {
        id: 14,
        title: '题西林壁',
        author: '苏轼',
        dynasty: '宋代',
        theme: '哲理',
        content: '横看成岭侧成峰，\n远近高低各不同。\n不识庐山真面目，\n只缘身在此山中。',
        background: '诗人游览庐山后，在西林寺墙壁上题写此诗。从不同角度看庐山，形态各异，由此悟出“当局者迷”的哲理。',
        annotation: '题：书写。西林：西林寺。缘：因为。',
        appreciation: '前两句写观察角度不同，所见各异；后两句由景入理，揭示出“要全面认识事物，就要跳出事物本身”的深刻道理。',
        authorBio: '苏轼（1037—1101），字子瞻，号东坡居士，北宋文学家，唐宋八大家之一，诗、词、文、书、画皆精。',
        related: [3, 6],
        gradient: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
        emoji: '🏔️',
        difficulty: 3
    },
    {
        id: 15,
        title: '示儿',
        author: '陆游',
        dynasty: '宋代',
        theme: '爱国',
        content: '死去元知万事空，\n但悲不见九州同。\n王师北定中原日，\n家祭无忘告乃翁。',
        background: '这是陆游临终前写给儿子的绝笔诗。诗人明知人死后万事皆空，唯独为没有看到国家统一而悲伤。',
        annotation: '元知：本来知道。九州同：全国统一。王师：朝廷的军队。乃翁：你的父亲。',
        appreciation: '全诗以遗嘱的口吻写成，语言质朴却字字泣血，表达了诗人至死不渝的爱国情怀，感人至深。',
        authorBio: '陆游（1125—1210），字务观，号放翁，南宋爱国诗人，一生创作诗词近万首。',
        related: [9],
        gradient: 'linear-gradient(135deg, #f68084 0%, #fccb90 100%)',
        emoji: '🇨🇳',
        difficulty: 3
    },
    {
        id: 16,
        title: '江南春',
        author: '杜牧',
        dynasty: '唐代',
        theme: '写景',
        content: '千里莺啼绿映红，\n水村山郭酒旗风。\n南朝四百八十寺，\n多少楼台烟雨中。',
        background: '诗人描绘江南春天的明媚景色，既有莺歌燕舞、酒旗飘动的热闹，又有烟雨朦胧中古寺楼台的悠远。',
        annotation: '山郭：山城。酒旗：酒馆门前悬挂的旗帜。南朝：指宋、齐、梁、陈四个朝代。',
        appreciation: '全诗以“千里”起笔，境界开阔；后两句由眼前之景转入历史感慨，虚实相生，余韵无穷。',
        authorBio: '杜牧（803—852），字牧之，唐代诗人，与李商隐并称“小李杜”。其诗清丽俊爽，尤擅七言绝句。',
        related: [2, 12],
        gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
        emoji: '🌿',
        difficulty: 3
    }
]

const DYNASTY_OPTIONS = ['全部', '唐代', '宋代']
const THEME_OPTIONS = ['全部', '写景', '思乡', '哲理', '爱国', '咏物', '送别']
const DIFFICULTY_LABELS = ['全部', '入门', '进阶', '提高']

/**
 * 主题化高级 SVG 图标库
 * 24x24，stroke 风格，可被着色与缩放
 * 视觉语言：线性、精致、留白克制
 */
const POEM_ICONS = {
    moon: (
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    ),
    flower: (
        <>
            <circle cx="12" cy="12" r="2.2" />
            <path d="M12 9.8V4M12 14.2V20M9.8 12H4M14.2 12H20" />
            <path d="M10.2 10.2 7.8 7.8M13.8 13.8l2.4 2.4M10.2 13.8l-2.4 2.4M13.8 10.2l2.4-2.4" />
        </>
    ),
    mountain: (
        <>
            <path d="M3 19l5-9 4 6 3-4 6 7H3Z" />
            <path d="M9 19l2-3 1.5 2" />
        </>
    ),
    wheat: (
        <>
            <path d="M12 21V8" />
            <path d="M12 12c-2 0-4-1.5-4-4 2 0 4 1.5 4 4Z" />
            <path d="M12 12c2 0 4-1.5 4-4-2 0-4 1.5-4 4Z" />
            <path d="M12 16c-2 0-4-1.5-4-4 2 0 4 1.5 4 4Z" />
            <path d="M12 16c2 0 4-1.5 4-4-2 0-4 1.5-4 4Z" />
        </>
    ),
    goose: (
        <>
            <path d="M5 16c1-3 4-5 8-5 3 0 5 1 6 3" />
            <path d="M19 14l2-1" />
            <path d="M9 16c.5-1 1.5-2 3-2" />
            <path d="M7 18l-1 2" />
            <path d="M11 18l-1 2" />
        </>
    ),
    waterfall: (
        <>
            <path d="M12 3c-2 3-4 6-4 9a4 4 0 0 0 8 0c0-3-2-6-4-9Z" />
            <path d="M10 17v2M14 17v2" />
        </>
    ),
    snow: (
        <>
            <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
        </>
    ),
    thread: (
        <>
            <path d="M5 19l8-14" />
            <path d="M13 5c2-1 4 0 5 2s0 4-2 5" />
            <path d="M11 7c-2 1-3 3-2 5" />
            <path d="M7 17l-2 2" />
        </>
    ),
    sword: (
        <>
            <path d="M14.5 3.5l6 6-9 9-2-2 9-9-4-4Z" />
            <path d="M7 14l-4 4 3 3 4-4" />
        </>
    ),
    leaf: (
        <>
            <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" />
            <path d="M5 19c2-4 5-7 9-9" />
        </>
    ),
    chrysanthemum: (
        <>
            <circle cx="12" cy="12" r="1.5" />
            <path d="M12 10.5V6M12 13.5V18M10.5 12H6M13.5 12H18" />
            <path d="M10.7 10.7 7.8 7.8M13.3 13.3l2.9 2.9M10.7 13.3l-2.9 2.9M13.3 10.7l2.9-2.9" />
        </>
    ),
    river: (
        <>
            <path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
            <path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
            <path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
        </>
    ),
    tree: (
        <>
            <path d="M12 3l-5 7h2l-4 6h3l-3 5h14l-3-5h3l-4-6h2l-5-7Z" />
            <path d="M12 21v-3" />
        </>
    )
}

/**
 * 主题到图标的映射
 * 让每首诗词拥有独特的视觉符号
 */
const POEM_ICON_MAP = {
    1: 'moon',
    2: 'flower',
    3: 'mountain',
    4: 'wheat',
    5: 'goose',
    6: 'waterfall',
    7: 'snow',
    8: 'thread',
    9: 'sword',
    10: 'leaf',
    11: 'mountain',
    12: 'chrysanthemum',
    13: 'mountain',
    14: 'mountain',
    15: 'sword',
    16: 'tree'
}

/**
 * 每首诗的高级多色主题（视觉冲击核心）
 * 包含主色、副色、专属渐变、装饰色
 */
const POEM_THEMES = {
    1: {  // 静夜思 - 深邃紫蓝（静谧夜空）
        primary: '#6366F1',
        accent: '#8B5CF6',
        icon: '#A5B4FC',
        bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)',
        glow: 'rgba(99, 102, 241, 0.4)',
        textGradient: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)'
    },
    2: {  // 春晓 - 樱粉嫩色（春日绽放）
        primary: '#EC4899',
        accent: '#F472B6',
        icon: '#FBCFE8',
        bg: 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)',
        glow: 'rgba(236, 72, 153, 0.4)',
        textGradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
    },
    3: {  // 登鹳雀楼 - 碧空青蓝（壮阔山河）
        primary: '#0EA5E9',
        accent: '#06B6D4',
        icon: '#7DD3FC',
        bg: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 50%, #0891B2 100%)',
        glow: 'rgba(14, 165, 233, 0.4)',
        textGradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
    },
    4: {  // 悯农 - 暖阳金黄（丰收大地）
        primary: '#F59E0B',
        accent: '#EAB308',
        icon: '#FDE68A',
        bg: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 50%, #D97706 100%)',
        glow: 'rgba(245, 158, 11, 0.4)',
        textGradient: 'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)'
    },
    5: {  // 咏鹅 - 暖橙白鹅（童趣盎然）
        primary: '#F97316',
        accent: '#FB923C',
        icon: '#FED7AA',
        bg: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)',
        glow: 'rgba(249, 115, 22, 0.4)',
        textGradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)'
    },
    6: {  // 望庐山瀑布 - 紫红瑰丽（飞瀑倾泻）
        primary: '#A855F7',
        accent: '#D946EF',
        icon: '#E9D5FF',
        bg: 'linear-gradient(135deg, #A855F7 0%, #D946EF 50%, #C026D3 100%)',
        glow: 'rgba(168, 85, 247, 0.4)',
        textGradient: 'linear-gradient(135deg, #A855F7 0%, #D946EF 100%)'
    },
    7: {  // 江雪 - 冷峻冰蓝（雪中独钓）
        primary: '#3B82F6',
        accent: '#60A5FA',
        icon: '#BFDBFE',
        bg: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #2563EB 100%)',
        glow: 'rgba(59, 130, 246, 0.4)',
        textGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)'
    },
    8: {  // 游子吟 - 暖粉红润（慈母情深）
        primary: '#F43F5E',
        accent: '#FB7185',
        icon: '#FECDD3',
        bg: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 50%, #E11D48 100%)',
        glow: 'rgba(244, 63, 94, 0.4)',
        textGradient: 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)'
    },
    9: {  // 出塞 - 暗红铁血（边塞豪情）
        primary: '#DC2626',
        accent: '#EF4444',
        icon: '#FCA5A5',
        bg: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',
        glow: 'rgba(220, 38, 38, 0.4)',
        textGradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
    },
    10: { // 送元二使安西 - 翠绿清新（阳关新柳）
        primary: '#10B981',
        accent: '#34D399',
        icon: '#A7F3D0',
        bg: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #059669 100%)',
        glow: 'rgba(16, 185, 129, 0.4)',
        textGradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    11: { // 九月九日忆山东兄弟 - 暮色橙紫（思乡情切）
        primary: '#F97316',
        accent: '#C026D3',
        icon: '#FED7AA',
        bg: 'linear-gradient(135deg, #F97316 0%, #EA580C 30%, #C026D3 100%)',
        glow: 'rgba(249, 115, 22, 0.4)',
        textGradient: 'linear-gradient(135deg, #F97316 0%, #C026D3 100%)'
    },
    12: { // 小池 - 薄荷清新（初夏荷塘）
        primary: '#14B8A6',
        accent: '#2DD4BF',
        icon: '#99F6E4',
        bg: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 50%, #0D9488 100%)',
        glow: 'rgba(20, 184, 166, 0.4)',
        textGradient: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)'
    },
    13: { // 望天门山 - 霞光橘粉（江上日落）
        primary: '#F59E0B',
        accent: '#EC4899',
        icon: '#FCD34D',
        bg: 'linear-gradient(135deg, #F59E0B 0%, #F472B6 50%, #EC4899 100%)',
        glow: 'rgba(245, 158, 11, 0.4)',
        textGradient: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)'
    },
    14: { // 题西林壁 - 山峦翠绿（庐山峻秀）
        primary: '#16A34A',
        accent: '#84CC16',
        icon: '#BBF7D0',
        bg: 'linear-gradient(135deg, #16A34A 0%, #84CC16 50%, #15803D 100%)',
        glow: 'rgba(22, 163, 74, 0.4)',
        textGradient: 'linear-gradient(135deg, #16A34A 0%, #84CC16 100%)'
    },
    15: { // 示儿 - 暗红悲壮（赤胆忠心）
        primary: '#BE123C',
        accent: '#DC2626',
        icon: '#FECDD3',
        bg: 'linear-gradient(135deg, #BE123C 0%, #DC2626 50%, #7F1D1D 100%)',
        glow: 'rgba(190, 18, 60, 0.4)',
        textGradient: 'linear-gradient(135deg, #BE123C 0%, #DC2626 100%)'
    },
    16: { // 江南春 - 紫罗兰色（烟雨江南）
        primary: '#7C3AED',
        accent: '#A78BFA',
        icon: '#DDD6FE',
        bg: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #6D28D9 100%)',
        glow: 'rgba(124, 58, 237, 0.4)',
        textGradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)'
    }
}
const DETAIL_TABS = [
    { key: 'content', label: '正文' },
    { key: 'annotation', label: '注释' },
    { key: 'appreciation', label: '赏析' },
    { key: 'author', label: '作者' },
    { key: 'related', label: '相关' },
    { key: 'notes', label: '笔记' }
]
const GAME_TABS = [
    { key: 'fillblank', label: '诗词填空' },
    { key: 'match', label: '名句配对' },
    { key: 'quiz', label: '作者问答' }
]
const FONT_SIZES = [
    { key: 'sm', label: '小', value: 16 },
    { key: 'md', label: '中', value: 20 },
    { key: 'lg', label: '大', value: 24 },
    { key: 'xl', label: '特大', value: 28 }
]

const STORAGE_KEYS = {
    favorites: 'poem_favorites_v2',
    history: 'poem_read_history_v2',
    notes: 'poem_notes_v2',
    darkMode: 'poem_dark_mode',
    fontSize: 'poem_font_size'
}

const getDailyPoem = () => {
    const today = new Date()
    const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    )
    return POEMS[dayOfYear % POEMS.length]
}

const getStored = (key, fallback = '') => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
    } catch {
        return fallback
    }
}

const setStored = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch {
        // ignore
    }
}

const getInitialDarkMode = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.darkMode)
    if (stored !== null) return stored === 'true'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function LearnPoem() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [dailyPoem] = useState(getDailyPoem)
    const [selectedPoem, setSelectedPoem] = useState(null)
    const [favorites, setFavorites] = useState(() => getStored(STORAGE_KEYS.favorites, []))
    const [readHistory, setReadHistory] = useState(() => getStored(STORAGE_KEYS.history, []))
    const [notes, setNotes] = useState(() => getStored(STORAGE_KEYS.notes, {}))
    const [activeTab, setActiveTab] = useState('all')
    const [dynastyFilter, setDynastyFilter] = useState('全部')
    const [themeFilter, setThemeFilter] = useState('全部')
    const [difficultyFilter, setDifficultyFilter] = useState('全部')
    const [searchText, setSearchText] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    const [activeDetailTab, setActiveDetailTab] = useState('content')
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [darkMode, setDarkMode] = useState(getInitialDarkMode)
    const [fontSizeKey, setFontSizeKey] = useState(() => getStored(STORAGE_KEYS.fontSize, 'md'))
    const [activeGameTab, setActiveGameTab] = useState('fillblank')
    const [gameState, setGameState] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const detailBodyRef = useRef(null)
    const speechRef = useRef(null)

    const fontSize = useMemo(() => FONT_SIZES.find(f => f.key === fontSizeKey)?.value || 20, [fontSizeKey])

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 400)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.classList.toggle('poem-dark', darkMode)
        localStorage.setItem(STORAGE_KEYS.darkMode, darkMode ? 'true' : 'false')
    }, [darkMode])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        return () => {
            if (speechRef.current) {
                window.speechSynthesis.cancel()
                speechRef.current = null
            }
        }
    }, [])

    const stopSpeech = useCallback(() => {
        window.speechSynthesis.cancel()
        speechRef.current = null
        setIsPlaying(false)
    }, [])

    const toggleSpeech = useCallback((text) => {
        if (isPlaying) {
            stopSpeech()
            return
        }
        if (!window.speechSynthesis) {
            Toast.show({ content: '您的浏览器不支持语音朗读', icon: 'fail' })
            return
        }
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text.replace(/\n/g, '，'))
        utterance.lang = 'zh-CN'
        utterance.rate = 0.8
        utterance.pitch = 1
        utterance.onend = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        utterance.onerror = () => {
            setIsPlaying(false)
            speechRef.current = null
        }
        speechRef.current = utterance
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
    }, [isPlaying, stopSpeech])

    const activeFilterCount = useMemo(() => [
        dynastyFilter !== '全部',
        themeFilter !== '全部',
        difficultyFilter !== '全部'
    ].filter(Boolean).length, [dynastyFilter, themeFilter, difficultyFilter])

    const clearAllFilters = useCallback(() => {
        setDynastyFilter('全部')
        setThemeFilter('全部')
        setDifficultyFilter('全部')
        setSearchText('')
    }, [])

    const filteredPoems = useMemo(() => POEMS.filter(poem => {
        if (activeTab === 'favorites' && !favorites.includes(poem.id)) return false
        if (dynastyFilter !== '全部' && poem.dynasty !== dynastyFilter) return false
        if (themeFilter !== '全部' && poem.theme !== themeFilter) return false
        if (difficultyFilter !== '全部') {
            const level = parseInt(difficultyFilter.charAt(0))
            if (poem.difficulty !== level) return false
        }
        if (searchText) {
            const text = searchText.toLowerCase()
            return (
                poem.title.toLowerCase().includes(text) ||
                poem.author.toLowerCase().includes(text) ||
                poem.content.toLowerCase().includes(text)
            )
        }
        return true
    }), [activeTab, favorites, dynastyFilter, themeFilter, difficultyFilter, searchText])

    const toggleFavorite = useCallback((poemId) => {
        setFavorites(prev => {
            const next = prev.includes(poemId)
                ? prev.filter(id => id !== poemId)
                : [...prev, poemId]
            setStored(STORAGE_KEYS.favorites, next)
            return next
        })
    }, [])

    const saveNote = useCallback((poemId, text) => {
        setNotes(prev => {
            const next = { ...prev, [poemId]: text }
            setStored(STORAGE_KEYS.notes, next)
            return next
        })
    }, [])

    const openPoemDetail = useCallback((poem, tab = 'content') => {
        setSelectedPoem(poem)
        setActiveDetailTab(tab)
        setReadHistory(prev => {
            if (prev.includes(poem.id)) return prev
            const next = [...prev, poem.id]
            setStored(STORAGE_KEYS.history, next)
            return next
        })
    }, [])

    const closePoemDetail = useCallback(() => {
        setSelectedPoem(null)
        stopSpeech()
    }, [stopSpeech])

    const openRandomPoem = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * POEMS.length)
        openPoemDetail(POEMS[randomIndex])
    }, [openPoemDetail])

    const getDifficultyText = (level) => {
        const map = { 1: '入门', 2: '进阶', 3: '提高' }
        return map[level] || ''
    }
    const getDifficultyDots = (level) => {
        const dots = []
        for (let i = 0; i < 3; i++) {
            dots.push(i < level)
        }
        return dots
    }

    const getRecommendations = useCallback((poem) => {
        const byRelated = poem.related.map(id => POEMS.find(p => p.id === id)).filter(Boolean)
        const byTheme = POEMS.filter(p => p.theme === poem.theme && p.id !== poem.id)
        const byAuthor = POEMS.filter(p => p.author === poem.author && p.id !== poem.id)
        const combined = [...byRelated, ...byTheme, ...byAuthor]
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values())
        return unique.slice(0, 4)
    }, [])

    // 游戏逻辑
    const generateFillBlank = useCallback(() => {
        const poem = POEMS[Math.floor(Math.random() * POEMS.length)]
        const lines = poem.content.split('\n')
        const lineIndex = Math.floor(Math.random() * lines.length)
        const line = lines[lineIndex]
        const chars = line.replace(/[，。！？、]/g, '').split('')
        const blankIndex = Math.floor(Math.random() * chars.length)
        const answer = chars[blankIndex]
        const distractors = POEMS
            .flatMap(p => p.content.split('').filter(c => /[\u4e00-\u9fa5]/.test(c)))
            .filter(c => c !== answer)
        const options = [answer, ...distractors.sort(() => 0.5 - Math.random()).slice(0, 5)]
            .sort(() => 0.5 - Math.random())
        return { type: 'fillblank', poem, line, lineIndex, answer, options, selected: null, correct: null }
    }, [])

    const generateMatch = useCallback(() => {
        const pool = POEMS.sort(() => 0.5 - Math.random()).slice(0, 4)
        const pairs = pool.map(poem => {
            const line = poem.content.split('\n')[Math.floor(Math.random() * poem.content.split('\n').length)]
            const mid = Math.ceil(line.length / 2)
            return { poem, full: line, first: line.slice(0, mid), second: line.slice(mid) }
        })
        return { type: 'match', pairs, firstSelected: null, secondSelected: null, matched: [], attempts: 0 }
    }, [])

    const generateQuiz = useCallback(() => {
        const poem = POEMS[Math.floor(Math.random() * POEMS.length)]
        const wrong = POEMS.filter(p => p.author !== poem.author).map(p => p.author)
        const options = [poem.author, ...wrong.sort(() => 0.5 - Math.random()).slice(0, 3)]
            .sort(() => 0.5 - Math.random())
        return { type: 'quiz', poem, options, answer: poem.author, selected: null, correct: null }
    }, [])

    const startGame = useCallback((type) => {
        setActiveGameTab(type)
        if (type === 'fillblank') setGameState(generateFillBlank())
        if (type === 'match') setGameState(generateMatch())
        if (type === 'quiz') setGameState(generateQuiz())
    }, [generateFillBlank, generateMatch, generateQuiz])

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab)
        if (tab === 'games' && !gameState) {
            startGame('fillblank')
        }
    }, [gameState, startGame])

    const handleFillBlank = (char) => {
        if (!gameState || gameState.type !== 'fillblank') return
        const correct = char === gameState.answer
        setGameState(prev => ({ ...prev, selected: char, correct }))
        if (correct) Toast.show({ content: '回答正确！', icon: 'success' })
        else Toast.show({ content: '再想想看', icon: 'fail' })
    }

    const handleMatchSelect = (side, item) => {
        if (!gameState || gameState.type !== 'match') return
        setGameState(prev => {
            const next = { ...prev }
            if (side === 'first') next.firstSelected = item
            if (side === 'second') next.secondSelected = item
            if (next.firstSelected && next.secondSelected) {
                const matchedPair = next.pairs.find(p => p.first === next.firstSelected && p.second === next.secondSelected)
                if (matchedPair) {
                    next.matched = [...next.matched, matchedPair.full]
                    Toast.show({ content: '配对成功！', icon: 'success' })
                }
                next.attempts += 1
                next.firstSelected = null
                next.secondSelected = null
            }
            return next
        })
    }

    const handleQuizSelect = (author) => {
        if (!gameState || gameState.type !== 'quiz') return
        const correct = author === gameState.answer
        setGameState(prev => ({ ...prev, selected: author, correct }))
        if (correct) Toast.show({ content: '回答正确！', icon: 'success' })
        else Toast.show({ content: '再想想看', icon: 'fail' })
    }

    const renderGame = () => {
        if (!gameState) return <div className="poem-game__loading"><DotLoading color='#ff7a45' /> 游戏加载中...</div>

        if (gameState.type === 'fillblank') {
            const displayLine = gameState.line.replace(gameState.answer, '＿')
            return (
                <div className="poem-game__panel">
                    <div className="poem-game__poem-info">
                        <span>{gameState.poem.title}</span>
                        <span>{gameState.poem.dynasty} · {gameState.poem.author}</span>
                    </div>
                    <p className="poem-game__line" style={{ fontSize: `${fontSize}px` }}>{displayLine}</p>
                    <div className="poem-game__options">
                        {gameState.options.map((char, i) => (
                            <button
                                key={i}
                                className={`poem-game__option ${gameState.selected === char ? (gameState.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleFillBlank(char)}
                                disabled={gameState.selected !== null}
                            >
                                {char}
                            </button>
                        ))}
                    </div>
                    {gameState.selected && (
                        <p className="poem-game__tip">
                            {gameState.correct ? '正确！' : `正确答案是：${gameState.answer}`}
                        </p>
                    )}
                    <button className="poem-game__next" onClick={() => startGame('fillblank')}>下一题</button>
                </div>
            )
        }

        if (gameState.type === 'match') {
            const firsts = gameState.pairs.map(p => p.first).sort(() => 0.5 - Math.random())
            const seconds = gameState.pairs.map(p => p.second).sort(() => 0.5 - Math.random())
            const finished = gameState.matched.length === gameState.pairs.length
            return (
                <div className="poem-game__panel">
                    <p className="poem-game__tip">请点击上下两句，配成完整诗句</p>
                    <div className="poem-game__match-col">
                        {firsts.map((item, i) => (
                            <button
                                key={`f-${i}`}
                                className={`poem-game__match-item ${gameState.firstSelected === item ? 'selected' : ''} ${gameState.matched.some(m => m.startsWith(item)) ? 'matched' : ''}`}
                                onClick={() => handleMatchSelect('first', item)}
                                disabled={gameState.matched.some(m => m.startsWith(item))}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <div className="poem-game__match-col">
                        {seconds.map((item, i) => (
                            <button
                                key={`s-${i}`}
                                className={`poem-game__match-item ${gameState.secondSelected === item ? 'selected' : ''} ${gameState.matched.some(m => m.endsWith(item)) ? 'matched' : ''}`}
                                onClick={() => handleMatchSelect('second', item)}
                                disabled={gameState.matched.some(m => m.endsWith(item))}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    {finished && (
                        <>
                            <p className="poem-game__tip poem-game__tip--success">全部配对成功！</p>
                            <button className="poem-game__next" onClick={() => startGame('match')}>再来一局</button>
                        </>
                    )}
                </div>
            )
        }

        if (gameState.type === 'quiz') {
            const lines = gameState.poem.content.split('\n')
            const preview = lines.slice(0, 2).join('，')
            return (
                <div className="poem-game__panel">
                    <p className="poem-game__tip">以下诗句出自哪位诗人？</p>
                    <p className="poem-game__line" style={{ fontSize: `${fontSize}px` }}>“{preview}……”</p>
                    <p className="poem-game__poem-title">选自《{gameState.poem.title}》</p>
                    <div className="poem-game__options poem-game__options--list">
                        {gameState.options.map((author, i) => (
                            <button
                                key={i}
                                className={`poem-game__option ${gameState.selected === author ? (gameState.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleQuizSelect(author)}
                                disabled={gameState.selected !== null}
                            >
                                {author}
                            </button>
                        ))}
                    </div>
                    {gameState.selected && (
                        <p className="poem-game__tip">
                            {gameState.correct ? '正确！' : `正确答案是：${gameState.answer}`}
                        </p>
                    )}
                    <button className="poem-game__next" onClick={() => startGame('quiz')}>下一题</button>
                </div>
            )
        }
    }

    const renderPoemCard = (poem, isDaily = false) => {
        const iconKey = POEM_ICON_MAP[poem.id] || 'mountain'
        const theme = POEM_THEMES[poem.id] || POEM_THEMES[1]
        const serial = String(poem.id).padStart(2, '0')
        const difficultyDots = getDifficultyDots(poem.difficulty)
        return (
            <div
                key={poem.id}
                className={`poem-card ${isDaily ? 'poem-card--daily' : ''}`}
                onClick={() => openPoemDetail(poem)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPoemDetail(poem)}
                style={{
                    '--card-color': theme.primary,
                    '--card-accent': theme.accent,
                    '--card-glow': theme.glow,
                    '--card-gradient': theme.bg,
                    '--card-text-gradient': theme.textGradient
                }}
            >
                <div className="poem-card__bar"></div>
                <div className="poem-card__bg" style={{ background: theme.textGradient }}></div>
                <div className="poem-card__glow"></div>
                <div className="poem-card__shine"></div>

                {isDaily && <div className="poem-card__badge poem-card__badge--daily">每日推荐</div>}
                {readHistory.includes(poem.id) && !isDaily && (
                    <div className="poem-card__badge poem-card__badge--read">已读</div>
                )}

                <button
                    className={`poem-card__fav ${favorites.includes(poem.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(poem.id) }}
                    title={favorites.includes(poem.id) ? '取消收藏' : '收藏'}
                >
                    <svg viewBox="0 0 24 24" width="1em" height="1em" fill={favorites.includes(poem.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                    </svg>
                </button>

                <div className="poem-card__art">
                    <div className="poem-card__art-bg" style={{ background: theme.bg }}></div>
                    <div className="poem-card__art-pattern"></div>
                    <div className="poem-card__icon" aria-hidden="true" style={{ color: theme.icon }}>
                        <svg
                            viewBox="0 0 24 24"
                            width="1em"
                            height="1em"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {POEM_ICONS[iconKey]}
                        </svg>
                    </div>
                </div>

                <div className="poem-card__serial">{serial}</div>

                <div className="poem-card__body">
                    <div className="poem-card__head">
                        <h3 className="poem-card__title" style={{ background: theme.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{poem.title}</h3>
                        <span className="poem-card__dynasty" style={{ color: theme.primary, background: `${theme.primary}1A`, border: `1px solid ${theme.primary}33` }}>{poem.dynasty}</span>
                    </div>
                    <p className="poem-card__author">— {poem.author}</p>
                    <p className="poem-card__preview">{poem.content.split('\n')[0]}</p>
                    <div className="poem-card__meta">
                        <span className="poem-card__tag" style={{ background: `${theme.accent}1A`, color: theme.accent }}>{poem.theme}</span>
                        <div className="poem-card__difficulty" title={getDifficultyText(poem.difficulty)}>
                            {difficultyDots.map((on, i) => (
                                <span key={i} className={`poem-card__dot-mini ${on ? 'on' : ''}`} style={on ? { background: theme.primary, boxShadow: `0 0 6px ${theme.glow}` } : {}}></span>
                            ))}
                            <span className="poem-card__difficulty-text">{getDifficultyText(poem.difficulty)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderDetailBody = () => {
        if (!selectedPoem) return null
        const commonProps = { ref: detailBodyRef, className: 'poem-detail__body' }

        if (activeDetailTab === 'content') {
            return (
                <div {...commonProps}>
                    <div className="poem-detail__content" style={{ fontSize: `${fontSize}px` }}>
                        {selectedPoem.content.split('\n').map((line, i) => (
                            <p key={i} className="poem-detail__line">{line}</p>
                        ))}
                    </div>
                    <div className="poem-detail__font-bar">
                        <span>字号</span>
                        <div className="poem-detail__font-options">
                            {FONT_SIZES.map(f => (
                                <button
                                    key={f.key}
                                    className={`poem-detail__font-option ${fontSizeKey === f.key ? 'active' : ''}`}
                                    onClick={() => { setFontSizeKey(f.key); setStored(STORAGE_KEYS.fontSize, f.key) }}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'annotation') {
            return (
                <div {...commonProps}>
                    <div className="poem-detail__section">
                        <h4>重点字词</h4>
                        <p>{selectedPoem.annotation}</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'appreciation') {
            return (
                <div {...commonProps}>
                    <div className="poem-detail__section">
                        <h4>意境赏析</h4>
                        <p>{selectedPoem.appreciation}</p>
                    </div>
                    <div className="poem-detail__section">
                        <h4>创作背景</h4>
                        <p>{selectedPoem.background}</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'author') {
            const authorTheme = POEM_THEMES[selectedPoem.id] || POEM_THEMES[1]
            return (
                <div {...commonProps}>
                    <div className="poem-detail__author-card" style={{ background: `linear-gradient(135deg, ${authorTheme.primary}1A, var(--surface-solid))` }}>
                        <div className="poem-detail__author-art" style={{ background: authorTheme.bg }}>
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
                            </svg>
                        </div>
                        <div className="poem-detail__author-info">
                            <h4 style={{ background: authorTheme.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{selectedPoem.author}</h4>
                            <p>{selectedPoem.dynasty} · 著名诗人</p>
                        </div>
                    </div>
                    <div className="poem-detail__section">
                        <h4>生平简介</h4>
                        <p>{selectedPoem.authorBio}</p>
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'related') {
            const related = getRecommendations(selectedPoem)
            return (
                <div {...commonProps}>
                    <div className="poem-detail__section">
                        <h4>相关推荐</h4>
                        {related.length > 0 ? (
                            <div className="poem-detail__related-list">
                                {related.map(poem => {
                                    const relTheme = POEM_THEMES[poem.id] || POEM_THEMES[1]
                                    const relIcon = POEM_ICON_MAP[poem.id] || 'mountain'
                                    return (
                                        <div
                                            key={poem.id}
                                            className="poem-detail__related-item"
                                            onClick={() => openPoemDetail(poem)}
                                            style={{
                                                '--card-color': relTheme.primary,
                                                '--card-gradient': relTheme.bg
                                            }}
                                        >
                                            <div className="poem-detail__related-icon" style={{ background: relTheme.bg, color: relTheme.icon }}>
                                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                                    {POEM_ICONS[relIcon]}
                                                </svg>
                                            </div>
                                            <div className="poem-detail__related-info">
                                                <p className="poem-detail__related-title" style={{ background: relTheme.textGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{poem.title}</p>
                                                <p className="poem-detail__related-author">{poem.dynasty} · {poem.author}</p>
                                            </div>
                                            <i className="iconfont icon-you poem-detail__related-arrow"></i>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="poem-detail__empty">暂无相关推荐</p>
                        )}
                    </div>
                </div>
            )
        }

        if (activeDetailTab === 'notes') {
            return (
                <div {...commonProps}>
                    <div className="poem-detail__section">
                        <h4>我的笔记</h4>
                        <textarea
                            className="poem-detail__note-input"
                            placeholder="写下你对这首诗的感悟或批注..."
                            value={notes[selectedPoem.id] || ''}
                            onChange={e => saveNote(selectedPoem.id, e.target.value)}
                            rows={6}
                        />
                        <p className="poem-detail__note-tip">笔记会自动保存到本地</p>
                    </div>
                </div>
            )
        }
    }

    const renderDetailOverlay = () => {
        if (!selectedPoem) return null
        const detailTheme = POEM_THEMES[selectedPoem.id] || POEM_THEMES[1]
        const detailIconKey = POEM_ICON_MAP[selectedPoem.id] || 'mountain'
        return (
            <div className="poem-detail-overlay" onClick={closePoemDetail}>
                <div className="poem-detail" onClick={e => e.stopPropagation()}>
                    <div className="poem-detail__header" style={{ background: detailTheme.bg }}>
                        <button className="poem-detail__close" onClick={closePoemDetail} title="关闭">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 6l12 12M6 18L18 6" />
                            </svg>
                        </button>
                        <div className="poem-detail__art">
                            <div className="poem-detail__art-bg" style={{ background: detailTheme.bg }}></div>
                            <div className="poem-detail__art-pattern"></div>
                            <div className="poem-detail__icon" style={{ color: detailTheme.icon }}>
                                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                    {POEM_ICONS[detailIconKey]}
                                </svg>
                            </div>
                        </div>
                        <h2>{selectedPoem.title}</h2>
                        <p>{selectedPoem.dynasty} · {selectedPoem.author}</p>
                        <div className="poem-detail__actions">
                            <button
                                className={`poem-detail__action-btn ${favorites.includes(selectedPoem.id) ? 'active' : ''}`}
                                onClick={() => toggleFavorite(selectedPoem.id)}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill={favorites.includes(selectedPoem.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                                <span>{favorites.includes(selectedPoem.id) ? '已收藏' : '收藏'}</span>
                            </button>
                            <button
                                className={`poem-detail__action-btn ${isPlaying ? 'active' : ''}`}
                                onClick={() => toggleSpeech(selectedPoem.content)}
                            >
                                {isPlaying ? (
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <rect x="6" y="5" width="4" height="14" rx="1" />
                                        <rect x="14" y="5" width="4" height="14" rx="1" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                        <path d="M8 5v14l11-7L8 5Z" />
                                    </svg>
                                )}
                                <span>{isPlaying ? '暂停朗读' : '朗读'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="poem-detail__tab-bar">
                        {DETAIL_TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`poem-detail__tab ${activeDetailTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveDetailTab(tab.key)}
                            >
                                {tab.label}
                                {tab.key === 'notes' && notes[selectedPoem.id] && <span className="poem-detail__tab-dot"></span>}
                            </button>
                        ))}
                    </div>

                    {renderDetailBody()}

                    <div className="poem-detail__footer">
                        <div className="poem-detail__meta-row">
                            <span className="poem-detail__tag">{selectedPoem.theme}</span>
                            <span className="poem-detail__difficulty">{getDifficultyText(selectedPoem.difficulty)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`poem-root ${darkMode ? 'poem-root--dark' : ''}`}>
            <header className="poem-header">
                <div className="poem-header__blob poem-header__blob--1"></div>
                <div className="poem-header__blob poem-header__blob--2"></div>
                <div className="poem-header__blob poem-header__blob--3"></div>
                <div className="poem-header__particles" aria-hidden="true">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div className="poem-header__bar">
                    <button className="poem-header__back" onClick={() => navigate('/home')} title="返回首页">
                        <i className="iconfont icon-fanhui"></i>
                    </button>
                    <div className="poem-header__title-wrap">
                        <p className="poem-header__eyebrow"><span className="poem-header__dot"></span>国学启蒙</p>
                        <h1>古诗词天地</h1>
                    </div>
                    <button
                        className={`poem-header__theme ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(v => !v)}
                        title={darkMode ? '切换日间模式' : '切换夜间模式'}
                    >
                        {darkMode ? (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                            </svg>
                        )}
                    </button>
                </div>
                <p className="poem-header__sub">腹有诗书气自华，每日一诗伴成长</p>
            </header>

            <main className="poem-main">
                <section className="poem-daily">
                    <div className="poem-daily__head">
                        <p className="poem-section__eyebrow">
                            <span className="poem-section__line"></span>
                            每日一诗
                        </p>
                        <span className="poem-daily__date">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span>
                    </div>
                    {loading ? <Skeleton type="card" /> : renderPoemCard(dailyPoem, true)}
                </section>

                <section className="poem-tabs">
                    {[
                        {
                            key: 'all',
                            label: '全部诗词',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
                                    <path d="M8 8h8M8 12h8M8 16h5" />
                                </svg>
                            )
                        },
                        {
                            key: 'favorites',
                            label: '我的收藏',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                                </svg>
                            )
                        },
                        {
                            key: 'games',
                            label: '互动学习',
                            icon: (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="7" width="18" height="11" rx="3" />
                                    <path d="M8 12h2M9 11v2M15 13h.01M16 11h.01M17 13h.01" />
                                </svg>
                            )
                        }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`poem-tabs__btn ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.key)}
                        >
                            <span className="poem-tabs__icon">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </section>

                {activeTab !== 'games' && (
                    <>
                        <section className="poem-search">
                            <div className="poem-search__input-wrap">
                                <svg className="poem-search__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="7" />
                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="搜索诗词标题、作者或内容..."
                                    value={searchText}
                                    onChange={e => setSearchText(e.target.value)}
                                />
                                {searchText && (
                                    <button className="poem-search__clear" onClick={() => setSearchText('')} title="清空">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 6l12 12M6 18L18 6" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                className={`poem-search__filter-btn ${showFilters ? 'active' : ''}`}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18M6 12h12M10 18h4" />
                                </svg>
                                筛选
                                {activeFilterCount > 0 && <span className="poem-search__filter-count">{activeFilterCount}</span>}
                            </button>
                            <button className="poem-search__random-btn" onClick={openRandomPoem} title="随机一首">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="3" />
                                    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
                                    <circle cx="16" cy="16" r="1.2" fill="currentColor" />
                                    <circle cx="16" cy="8" r="1.2" fill="currentColor" />
                                    <circle cx="8" cy="16" r="1.2" fill="currentColor" />
                                    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                                </svg>
                            </button>
                        </section>

                        {showFilters && (
                            <section className="poem-filters">
                                <div className="poem-filters__header">
                                    <span className="poem-filters__count">共 {filteredPoems.length} 首</span>
                                    {activeFilterCount > 0 && (
                                        <button className="poem-filters__clear" onClick={clearAllFilters}>清除筛选</button>
                                    )}
                                </div>
                                <div className="poem-filter-group">
                                    <span className="poem-filter-group__label">朝代</span>
                                    <div className="poem-filter-group__options">
                                        {DYNASTY_OPTIONS.map(d => (
                                            <button
                                                key={d}
                                                className={`poem-filter-option ${dynastyFilter === d ? 'active' : ''}`}
                                                onClick={() => setDynastyFilter(d)}
                                            >{d}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="poem-filter-group">
                                    <span className="poem-filter-group__label">题材</span>
                                    <div className="poem-filter-group__options">
                                        {THEME_OPTIONS.map(t => (
                                            <button
                                                key={t}
                                                className={`poem-filter-option ${themeFilter === t ? 'active' : ''}`}
                                                onClick={() => setThemeFilter(t)}
                                            >{t}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="poem-filter-group">
                                    <span className="poem-filter-group__label">难度</span>
                                    <div className="poem-filter-group__options">
                                        {DIFFICULTY_LABELS.map((d, i) => (
                                            <button
                                                key={i}
                                                className={`poem-filter-option ${difficultyFilter === d ? 'active' : ''}`}
                                                onClick={() => setDifficultyFilter(d)}
                                            >{d}</button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="poem-grid">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} type="card" />)
                            ) : filteredPoems.length > 0 ? (
                                filteredPoems.map((poem, index) => (
                                    <div key={poem.id} className="poem-card-wrap" style={{ animationDelay: `${index * 0.05}s` }}>
                                        {renderPoemCard(poem)}
                                    </div>
                                ))
                            ) : (
                                <div className="poem-empty">
                                    <div className="poem-empty__art">
                                        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 8h28a8 8 0 0 1 8 8v40H22a8 8 0 0 1-8-8V8Z" />
                                            <path d="M22 18h20M22 28h20M22 38h12" />
                                            <circle cx="46" cy="46" r="10" fill="var(--surface-solid)" />
                                            <path d="M46 41v10M41 46h10" />
                                        </svg>
                                    </div>
                                    <p className="poem-empty__title">{activeTab === 'favorites' ? '还没有收藏诗词' : '没有找到匹配的诗词'}</p>
                                    <p className="poem-empty__desc">{activeTab === 'favorites' ? '快去发现喜欢的诗篇吧' : '换个关键词试试'}</p>
                                    {activeTab === 'favorites' && (
                                        <button className="poem-empty__btn" onClick={() => setActiveTab('all')}>去浏览诗词</button>
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}

                {activeTab === 'games' && (
                    <section className="poem-games">
                        <div className="poem-game__tabs">
                            {GAME_TABS.map(g => (
                                <button
                                    key={g.key}
                                    className={`poem-game__tab ${activeGameTab === g.key ? 'active' : ''}`}
                                    onClick={() => startGame(g.key)}
                                >{g.label}</button>
                            ))}
                        </div>
                        {renderGame()}
                    </section>
                )}

                <div className="poem-stats">
                    <div className="poem-stat" style={{ '--stat-color': '#FF7A45', '--stat-gradient': 'linear-gradient(135deg, #FF7A45 0%, #FF5E9C 100%)' }}>
                        <div className="poem-stat__art">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
                                <path d="M8 8h8M8 12h8M8 16h5" />
                            </svg>
                        </div>
                        <div className="poem-stat__num">{readHistory.length}</div>
                        <div className="poem-stat__label">已读诗词</div>
                    </div>
                    <div className="poem-stat" style={{ '--stat-color': '#FF4D8D', '--stat-gradient': 'linear-gradient(135deg, #FF4D8D 0%, #FF7A45 100%)' }}>
                        <div className="poem-stat__art">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.8 6.6a5.5 5.5 0 0 0-9.3-2.1A5.5 5.5 0 0 0 2.2 9.5c0 5.7 9.3 11.7 9.3 11.7s9.3-6 9.3-11.7a5.5 5.5 0 0 0 0-2.9Z" />
                            </svg>
                        </div>
                        <div className="poem-stat__num">{favorites.length}</div>
                        <div className="poem-stat__label">我的收藏</div>
                    </div>
                    <div className="poem-stat" style={{ '--stat-color': '#6C5CE7', '--stat-gradient': 'linear-gradient(135deg, #6C5CE7 0%, #00B8D9 100%)' }}>
                        <div className="poem-stat__art">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 5h16v14H4z" />
                                <path d="M8 9h8M8 13h6M8 17h4" />
                                <path d="M16 3l4 4-4 4" />
                            </svg>
                        </div>
                        <div className="poem-stat__num">{Object.values(notes).filter(Boolean).length}</div>
                        <div className="poem-stat__label">学习笔记</div>
                    </div>
                </div>
            </main>

            {renderDetailOverlay()}

            {showScrollTop && (
                <button
                    className="poem-scroll-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="回到顶部"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    )
}
