import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Science.less';

const experiments = [
  {
    id: 1,
    name: '小苏打与醋的火山喷发',
    category: '化学',
    difficulty: '简单',
    duration: '15分钟',
    materials: ['小苏打', '白醋', '食用色素', '洗洁精', '塑料瓶', '托盘'],
    summary: '模拟火山喷发，观察酸碱中和反应产生二氧化碳气体的现象。',
    steps: [
      '在塑料瓶中加入2勺小苏打。',
      '滴入几滴食用色素和少量洗洁精。',
      '将瓶子放在托盘上，防止弄脏桌面。',
      '慢慢倒入白醋，观察“火山喷发”效果。',
      '记录观察到的现象，思考为什么会产生气泡。'
    ],
    safety: '实验需在成人监督下进行。避免醋溅入眼睛，若不慎溅入，立即用清水冲洗。',
    principle: '小苏打（碳酸氢钠）与醋（醋酸）发生酸碱中和反应，生成二氧化碳气体、水和醋酸钠。气体迅速逸出形成气泡，模拟火山喷发。',
    questions: [
      '如果用柠檬汁代替醋，会发生什么？',
      '为什么加入洗洁精后泡沫更多？',
      '生活中还有哪些地方用到酸碱反应？'
    ],
    hot: true,
    quiz: {
      question: '在这个实验中，为什么会产生气泡？',
      answer: '因为小苏打和醋发生酸碱中和反应，生成二氧化碳气体。',
      explanation: '小苏打是碳酸氢钠，醋是醋酸，两者反应生成二氧化碳、水和醋酸钠。二氧化碳气体迅速逸出形成气泡。'
    }
  },
  {
    id: 2,
    name: '自制彩虹',
    category: '光学',
    difficulty: '中等',
    duration: '20分钟',
    materials: ['一杯水', '手电筒', '白纸', '镜子', '黑暗房间'],
    summary: '利用光的折射和色散原理，在家中制造彩虹。',
    steps: [
      '将镜子斜放在水杯中，使镜子一部分浸在水里。',
      '在黑暗房间中，用手电筒照射水中的镜子。',
      '调整角度，在白纸上寻找彩虹色带。',
      '观察彩虹的颜色顺序，记录下来。',
      '尝试改变水深或镜子角度，观察变化。'
    ],
    safety: '使用手电筒时避免直射眼睛。小心镜子破碎，建议使用塑料镜片。',
    principle: '白光是由不同颜色的光混合而成。当光从空气进入水中时发生折射，不同颜色的光折射角度不同，从而分散成彩虹色带。',
    questions: [
      '彩虹为什么总是弯曲的？',
      '为什么雨后容易看到彩虹？',
      '除了水，还有什么材料可以分光？'
    ],
    hot: false,
    quiz: {
      question: '彩虹的颜色顺序是什么？',
      answer: '红、橙、黄、绿、蓝、靛、紫。',
      explanation: '白光通过折射分散成不同颜色的光，按照波长从长到短排列，形成彩虹。'
    }
  },
  {
    id: 3,
    name: '植物染色',
    category: '生物',
    difficulty: '简单',
    duration: '30分钟',
    materials: ['白色花朵（如康乃馨）', '食用色素', '水', '杯子'],
    summary: '观察植物如何通过茎吸收水分，了解毛细现象。',
    steps: [
      '在杯子中加入水和几滴食用色素，搅拌均匀。',
      '将白色花朵的茎斜切后插入有色水中。',
      '放置几小时，观察花瓣颜色变化。',
      '记录颜色变化的时间线。',
      '尝试不同颜色的色素，观察哪种颜色染色最快。'
    ],
    safety: '使用食用色素，避免使用工业染料。实验后洗手。',
    principle: '植物通过茎中的导管吸收水分，水分通过毛细作用上升，色素随之进入花瓣细胞，使花瓣变色。',
    questions: [
      '为什么茎需要斜切？',
      '如果花朵已经染色，还能恢复白色吗？',
      '树木为什么能从根部输送水分到高处？'
    ],
    hot: true,
    quiz: {
      question: '植物是如何吸收水分的？',
      answer: '通过茎中的导管，利用毛细作用将水分从根部输送到花瓣。',
      explanation: '植物茎中有许多细小的导管，水分通过毛细作用上升，色素随之进入花瓣细胞，使花瓣变色。'
    }
  },
  {
    id: 4,
    name: '简易电路',
    category: '物理',
    difficulty: '中等',
    duration: '25分钟',
    materials: ['电池', '导线', '小灯泡', '回形针', '铝箔'],
    summary: '搭建简单电路，了解电流流动和开关原理。',
    steps: [
      '用导线连接电池和小灯泡，使灯泡亮起。',
      '在电路中留出一个开口，用回形针连接。',
      '用铝箔代替回形针，观察是否还能导电。',
      '测试其他材料（如橡皮、塑料尺）是否导电。',
      '记录哪些材料是导体，哪些是绝缘体。'
    ],
    safety: '使用低电压电池（如1.5V），避免使用家用电。小心导线发热。',
    principle: '电流需要闭合回路才能流动。导体（如金属）允许电流通过，绝缘体（如塑料）阻止电流通过。',
    questions: [
      '为什么金属是导体？',
      '如果电路中加入更多灯泡，亮度会怎样变化？',
      '家用电路是如何保护我们的？'
    ],
    hot: false,
    quiz: {
      question: '电流需要什么条件才能流动？',
      answer: '需要一个闭合的回路和导体材料。',
      explanation: '电流是电荷的定向移动，需要闭合回路让电荷能够循环流动，导体材料允许电荷通过。'
    }
  },
  {
    id: 5,
    name: '磁铁迷宫',
    category: '物理',
    difficulty: '简单',
    duration: '20分钟',
    materials: ['磁铁', '纸板', '回形针', '彩笔'],
    summary: '利用磁力隔空移动物体，探索磁场的作用。',
    steps: [
      '在纸板上绘制迷宫图案。',
      '将回形针放在迷宫起点。',
      '在纸板下方用磁铁吸引回形针。',
      '移动磁铁引导回形针走出迷宫。',
      '尝试不同强度的磁铁，观察效果差异。'
    ],
    safety: '小心磁铁夹伤手指。远离电子设备和信用卡。',
    principle: '磁铁周围存在磁场，可以隔空吸引铁磁性物质（如回形针）。磁场可以穿透非磁性材料（如纸板）。',
    questions: [
      '磁铁为什么有南北极？',
      '地球为什么像一块大磁铁？',
      '除了铁，还有哪些材料能被磁铁吸引？'
    ],
    hot: true,
    quiz: {
      question: '磁铁能吸引哪些材料？',
      answer: '铁、钴、镍等铁磁性材料。',
      explanation: '磁铁能够吸引铁磁性材料，这些材料内部的磁畴能够被外部磁场排列，从而产生吸引力。'
    }
  }
];

const categories = ['全部', '化学', '物理', '生物', '光学'];
const difficulties = ['全部', '简单', '中等', '困难'];

export default function SciencePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedDifficulty, setSelectedDifficulty] = useState('全部');
  const [showHotOnly, setShowHotOnly] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const filteredExperiments = experiments.filter(exp => {
    const categoryMatch = selectedCategory === '全部' || exp.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === '全部' || exp.difficulty === selectedDifficulty;
    const hotMatch = !showHotOnly || exp.hot;
    return categoryMatch && difficultyMatch && hotMatch;
  });

  const openExperiment = (experiment) => {
    setSelectedExperiment(experiment);
    setCurrentStep(0);
    setQuizAnswer('');
    setShowQuizResult(false);
    setCurrentQuizIndex(0);
  };

  const closeExperiment = () => {
    setSelectedExperiment(null);
  };

  const nextStep = () => {
    if (selectedExperiment && currentStep < selectedExperiment.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="science-root">
      {/* 英雄区域 */}
      <header className="science-hero">
        <div className="science-hero__top">
          <button className="science-back-btn" onClick={() => navigate('/home')}>
            <i className="iconfont icon-fanhui"></i>
          </button>
          <div className="science-hero__title-wrapper">
            <p className="science-hero__eyebrow">安全实验 · 好奇心培养</p>
            <h1>科学小实验室</h1>
          </div>
        </div>
        <p className="science-hero__sub">
          使用家中安全材料，动手做实验，探索科学奥秘，培养好奇心与创造力
        </p>
        <div className="science-hero__actions">
          <button className="science-btn science-btn--primary">开始实验</button>
        </div>
        <div className="science-hero__bubble">
          <span>安全第一</span>
          <span>动手实践</span>
          <span>科学思维</span>
          <span>亲子互动</span>
        </div>
      </header>

      {/* 导航系统 */}
      <nav className="science-nav">
        <div className="science-nav__section">
          <h3>实验分类</h3>
          <div className="science-nav__tags">
            {categories.map(category => (
              <button
                key={category}
                className={`science-nav__tag ${selectedCategory === category ? 'science-nav__tag--active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="science-nav__section">
          <h3>难度筛选</h3>
          <div className="science-nav__tags">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                className={`science-nav__tag ${selectedDifficulty === difficulty ? 'science-nav__tag--active' : ''}`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
        <div className="science-nav__section">
          <h3>热门推荐</h3>
          <button
            className={`science-nav__tag ${showHotOnly ? 'science-nav__tag--active' : ''}`}
            onClick={() => setShowHotOnly(!showHotOnly)}
          >
            {showHotOnly ? '显示全部' : '仅显示热门'}
          </button>
        </div>
      </nav>

      {/* 实验展示模块 */}
      <section className="science-experiments">
        <h2>实验列表</h2>
        <p>找到 {filteredExperiments.length} 个实验</p>
        <div className="science-experiments__grid">
          {filteredExperiments.map(experiment => (
            <div key={experiment.id} className="science-card" onClick={() => openExperiment(experiment)}>
              <div className="science-card__header">
                <span className="science-card__category">{experiment.category}</span>
                <span className="science-card__difficulty">{experiment.difficulty}</span>
                {experiment.hot && <span className="science-card__hot">热门</span>}
              </div>
              <h3>{experiment.name}</h3>
              <p>{experiment.summary}</p>
              <div className="science-card__footer">
                <span className="science-card__duration">{experiment.duration}</span>
                <button className="science-btn science-btn--small">查看详情</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 实验详情模态框 */}
      {selectedExperiment && (
        <div className="science-modal">
          <div className="science-modal__content">
            <button className="science-modal__close" onClick={closeExperiment}>×</button>
            <h2>{selectedExperiment.name}</h2>
            <div className="science-modal__meta">
              <span>分类: {selectedExperiment.category}</span>
              <span>难度: {selectedExperiment.difficulty}</span>
              <span>时长: {selectedExperiment.duration}</span>
            </div>
            
            <div className="science-modal__section">
              <h3>实验材料</h3>
              <ul className="science-materials">
                {selectedExperiment.materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>

            <div className="science-modal__section">
              <h3>实验步骤</h3>
              <div className="science-steps">
                <div className="science-steps__current">
                  <span className="science-steps__number">步骤 {currentStep + 1}</span>
                  <p>{selectedExperiment.steps[currentStep]}</p>
                </div>
                <div className="science-steps__controls">
                  <button onClick={prevStep} disabled={currentStep === 0}>上一步</button>
                  <span>{currentStep + 1} / {selectedExperiment.steps.length}</span>
                  <button onClick={nextStep} disabled={currentStep === selectedExperiment.steps.length - 1}>下一步</button>
                </div>
              </div>
            </div>

            <div className="science-modal__section">
              <h3>安全提示</h3>
              <p className="science-safety">{selectedExperiment.safety}</p>
            </div>

            <div className="science-modal__section">
              <h3>科学原理</h3>
              <p>{selectedExperiment.principle}</p>
            </div>

            <div className="science-modal__section">
              <h3>拓展思考</h3>
              <ul className="science-questions">
                {selectedExperiment.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>

            <div className="science-modal__section">
              <h3>互动问答</h3>
              <div className="science-quiz">
                <p className="science-quiz__question">{selectedExperiment.quiz.question}</p>
                <div className="science-quiz__input">
                  <input
                    type="text"
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="输入你的答案"
                    disabled={showQuizResult}
                  />
                  <button 
                    onClick={() => setShowQuizResult(true)}
                    disabled={!quizAnswer.trim() || showQuizResult}
                  >
                    提交答案
                  </button>
                </div>
                {showQuizResult && (
                  <div className="science-quiz__result">
                    <p><strong>正确答案：</strong>{selectedExperiment.quiz.answer}</p>
                    <p><strong>解释：</strong>{selectedExperiment.quiz.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 材料安全说明板块 */}
      <section className="science-safety-section">
        <h2>材料安全说明</h2>
        <div className="science-safety-section__content">
          <div className="science-safety-section__item">
            <h3>常见实验材料安全等级</h3>
            <p>所有实验均使用家庭常见安全材料，如小苏打、醋、食用色素等。避免使用有毒、易燃或腐蚀性化学品。</p>
          </div>
          <div className="science-safety-section__item">
            <h3>安全操作规范</h3>
            <ul>
              <li>实验前洗手，实验后清理工作区域</li>
              <li>穿戴适当防护（如围裙、护目镜）</li>
              <li>在成人监督下进行实验</li>
              <li>了解急救措施，如溅入眼睛立即用清水冲洗</li>
            </ul>
          </div>
          <div className="science-safety-section__item">
            <h3>安全替代品建议</h3>
            <p>若缺少某些材料，可使用安全替代品。例如：柠檬汁代替醋，植物色素代替食用色素。</p>
          </div>
        </div>
      </section>

      {/* 好奇心培养区 */}
      <section className="science-curiosity">
        <h2>好奇心培养区</h2>
        <div className="science-curiosity__content">
          <div className="science-curiosity__item">
            <h3>科学原理科普</h3>
            <p>每个实验都附有详细的科学原理说明，帮助孩子理解现象背后的科学知识。</p>
          </div>
          <div className="science-curiosity__item">
            <h3>拓展思考问题</h3>
            <p>提供开放性问题，鼓励孩子进一步思考和探索，培养科学思维。</p>
          </div>
          <div className="science-curiosity__item">
            <h3>相关实验推荐</h3>
            <p>根据兴趣推荐相关实验，拓展学习范围，保持好奇心。</p>
          </div>
        </div>
      </section>
    </div>
  );
}