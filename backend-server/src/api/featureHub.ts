import { randomUUID } from 'crypto';
import { Router } from 'express';

type QuizQuestion = { id: string; prompt: string; answers: string[]; correct: number; explanation: string };

const resources = [
  { id: 'budget-basics', title: 'A practical monthly budget', category: 'Budgeting', minutes: 4, summary: 'Separate fixed costs, flexible spending, and savings before the month begins.' },
  { id: 'emergency-fund', title: 'Building an emergency fund', category: 'Saving', minutes: 5, summary: 'Set a realistic first milestone and automate a contribution you can sustain.' },
  { id: 'compound-growth', title: 'How compound growth works', category: 'Investing', minutes: 6, summary: 'Learn how time, contributions, and uncertain returns affect long-term growth.' },
];

const quiz: QuizQuestion[] = [
  { id: 'q1', prompt: 'What is a useful first step when a monthly budget is consistently exceeded?', answers: ['Review the categories and actual spending', 'Increase every category by the same amount', 'Ignore one-off expenses'], correct: 0, explanation: 'Compare planned categories with recorded spending, then adjust the plan deliberately.' },
  { id: 'q2', prompt: 'Which statement about investment returns is most accurate?', answers: ['Past returns guarantee future results', 'Returns can vary and capital can be lost', 'A higher advertised return always means lower risk'], correct: 1, explanation: 'Investment values can rise or fall, and historical performance is not a guarantee.' },
  { id: 'q3', prompt: 'Why can an emergency fund be useful?', answers: ['It removes all financial risk', 'It can help cover unplanned essential costs', 'It guarantees investment growth'], correct: 1, explanation: 'A cash reserve can help absorb unexpected essential expenses.' },
];

const investments = [
  { id: 'cash-reserve', name: 'Cash reserve', category: 'Cash equivalent', risk: 'Lower volatility; inflation can reduce purchasing power.', availability: 'Illustrative information only' },
  { id: 'broad-market-fund', name: 'Broad-market fund', category: 'Diversified fund', risk: 'Market value can fall; suitable horizon depends on personal circumstances.', availability: 'Illustrative information only' },
  { id: 'government-bonds', name: 'Government bonds', category: 'Fixed income', risk: 'Prices and income can vary with rates, issuer, and term.', availability: 'Illustrative information only' },
];

const strategies = new Map<string, { userId: string; optionIds: string[]; updatedAt: string }>();
const quizAttempts = new Map<string, Array<{ attemptId: string; score: number; total: number; completedAt: string }>>();
const consultations = new Map<string, Array<{ requestId: string; topic: string; status: 'Provider unavailable'; requestedAt: string }>>();

function isText(value: unknown, maxLength = 240): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

export function createFeatureHubRouter(): Router {
  const router = Router();

  router.get('/investments/options', (_req, res) => {
    res.json({ success: true, source: 'illustrative-demo', connected: false, options: investments });
  });
  router.get('/investments/:userId/strategy', (req, res) => {
    const strategy = strategies.get(req.params.userId);
    res.json({ success: true, strategy: strategy ?? null, persistence: 'process-memory' });
  });
  router.put('/investments/:userId/strategy', (req, res) => {
    const optionIds = req.body?.optionIds;
    if (!Array.isArray(optionIds) || optionIds.length > investments.length || optionIds.some((id: unknown) => typeof id !== 'string' || !investments.some((option) => option.id === id))) {
      res.status(400).json({ success: false, message: 'Choose one or more options from the available list.' });
      return;
    }
    const strategy = { userId: req.params.userId, optionIds: [...new Set(optionIds as string[])], updatedAt: new Date().toISOString() };
    strategies.set(req.params.userId, strategy);
    res.json({ success: true, strategy, source: 'illustrative-demo' });
  });

  router.get('/advisory/:userId/insights', (_req, res) => {
    res.json({ success: true, insights: [
      { id: 'plan-review', title: 'Review your plan regularly', detail: 'Compare planned and recorded spending at the end of each week.' },
      { id: 'goal-cadence', title: 'Make goals measurable', detail: 'Choose a contribution schedule that fits your income timing.' },
    ], personalized: false, limitation: 'General educational guidance only; this demo does not analyze connected financial records or provide regulated advice.' });
  });
  router.post('/advisory/:userId/questions', (req, res) => {
    if (!isText(req.body?.question, 500)) {
      res.status(400).json({ success: false, message: 'Enter a question up to 500 characters.' });
      return;
    }
    res.json({ success: true, answer: 'Start by clarifying the amount, timing, and trade-offs involved, then compare the choice with your written budget and goals.', limitation: 'This general educational response is not personalized financial, investment, tax, or legal advice.' });
  });
  router.post('/advisory/:userId/consultations', (req, res) => {
    const topic = isText(req.body?.topic, 160) ? req.body.topic.trim() : 'General consultation';
    const entry = { requestId: randomUUID(), topic, status: 'Provider unavailable' as const, requestedAt: new Date().toISOString() };
    const history = consultations.get(req.params.userId) ?? [];
    history.unshift(entry);
    consultations.set(req.params.userId, history.slice(0, 50));
    res.status(202).json({ success: true, request: entry, message: 'The request is recorded in this local demo. No advisor service is connected.' });
  });
  router.get('/advisory/:userId/history', (req, res) => res.json({ success: true, consultations: consultations.get(req.params.userId) ?? [] }));

  router.get('/learning/resources', (_req, res) => res.json({ success: true, resources }));
  router.get('/learning/quiz', (_req, res) => res.json({ success: true, quiz: quiz.map(({ id, prompt, answers }) => ({ id, prompt, answers })) }));
  router.post('/learning/quiz/submit', (req, res) => {
    const answers = req.body?.answers;
    const userId = req.body?.userId;
    if (!isText(userId, 100) || !Array.isArray(answers) || answers.length !== quiz.length || answers.some((answer: unknown) => !Number.isInteger(answer) || (answer as number) < 0 || (answer as number) >= 3)) {
      res.status(400).json({ success: false, message: 'Submit one valid answer for each quiz question.' });
      return;
    }
    const score = quiz.reduce((total, question, index) => total + (answers[index] === question.correct ? 1 : 0), 0);
    const result = { attemptId: randomUUID(), score, total: quiz.length, completedAt: new Date().toISOString() };
    const history = quizAttempts.get(userId) ?? [];
    history.unshift(result);
    quizAttempts.set(userId, history.slice(0, 50));
    res.json({ success: true, result, feedback: quiz.map((question, index) => ({ questionId: question.id, correct: answers[index] === question.correct, explanation: question.explanation })) });
  });
  router.get('/learning/:userId/history', (req, res) => res.json({ success: true, attempts: quizAttempts.get(req.params.userId) ?? [] }));

  router.get('/offers', (_req, res) => res.json({ success: true, available: false, offers: [], message: 'Partner offers are unavailable until a partner catalogue is configured.' }));
  router.get('/cards/:userId/activity', (_req, res) => res.json({ success: true, available: false, cards: [], message: 'Card issuance and activity are unavailable until a card provider is configured.' }));
  router.get('/connections/:userId', (_req, res) => res.json({ success: true, connections: [
    { provider: 'Bank data', configured: false, status: 'Unavailable' },
    { provider: 'Digital wallet', configured: false, status: 'Unavailable' },
  ] }));

  return router;
}
