import React, { FormEvent, useEffect, useState } from 'react';
import { ArrowUpRight, BookOpenText, Briefcase, Compass, GraduationCap, ShieldCheck, Sparkle } from '@phosphor-icons/react';
import apiClient from '../api/apiClient';

type Tab = 'insights' | 'learning' | 'investing' | 'offers' | 'connections';
type Option = { id: string; name: string; category: string; risk: string; availability: string };
type Question = { id: string; prompt: string; answers: string[] };
type Insight = { id: string; title: string; detail: string };
type Resource = { id: string; title: string; category: string; minutes: number; summary: string };
type Connection = { provider: string; configured: boolean; status: string };
type QuizResult = { result: { score: number; total: number }; feedback: Array<{ questionId: string; correct: boolean; explanation: string }> };

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'insights', label: 'Money insights', icon: Sparkle },
  { id: 'learning', label: 'Learn', icon: GraduationCap },
  { id: 'investing', label: 'Investing basics', icon: Briefcase },
  { id: 'offers', label: 'Offers', icon: Compass },
  { id: 'connections', label: 'Connections', icon: ShieldCheck },
];

interface FeatureHubPageProps { userId: string; }

const FeatureHubPage: React.FC<FeatureHubPageProps> = ({ userId }) => {
  const [tab, setTab] = useState<Tab>('insights');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [offersAvailable, setOffersAvailable] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [answer, setAnswer] = useState('');
  const [consultationStatus, setConsultationStatus] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    Promise.all([
      apiClient.getAdvisoryInsights(userId),
      apiClient.getInvestmentOptions(),
      apiClient.getInvestmentStrategy(userId),
      apiClient.getLearningResources(),
      apiClient.getLearningQuiz(),
      apiClient.getOffers(),
      apiClient.getFinancialConnections(userId),
    ]).then(([insightResponse, optionResponse, strategyResponse, resourceResponse, quizResponse, offerResponse, connectionResponse]) => {
      if (!current) return;
      setInsights((insightResponse.insights as Insight[]) ?? []);
      setOptions((optionResponse.options as Option[]) ?? []);
      setSelected(strategyResponse.strategy?.optionIds ?? []);
      setResources((resourceResponse.resources as Resource[]) ?? []);
      setQuestions((quizResponse.quiz as Question[]) ?? []);
      setOffersAvailable(offerResponse.available === true);
      setConnections((connectionResponse.connections as Connection[]) ?? []);
      if ([insightResponse, optionResponse, resourceResponse, quizResponse].some((response) => !response.success)) {
        setMessage('Some tools could not load. Refresh the page or check the API connection.');
      }
    }).catch(() => setMessage('Tools could not load. Check the API connection and try again.'))
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [userId]);

  const toggleOption = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const saveStrategy = async () => {
    const response = await apiClient.saveInvestmentStrategy(userId, selected);
    setMessage(response.success ? 'Your sample preference is saved for this service session.' : response.message || 'The preference could not be saved.');
  };
  const askQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const response = await apiClient.askAdvisoryQuestion(userId, questionText);
    setAnswer(response.answer || response.message || 'No response was returned.');
  };
  const requestConsultation = async () => {
    const response = await apiClient.requestAdvisorConsultation(userId, 'Personal finance guidance');
    setConsultationStatus(response.message || 'The request could not be recorded.');
  };
  const recommendedResourceIds: string[] = quizResult?.feedback
    .filter((item) => !item.correct)
    .map((item) => item.questionId === 'q1' ? 'budget-basics' : item.questionId === 'q2' ? 'compound-growth' : 'emergency-fund') ?? [];
  const recommendedResources = resources.filter((resource) => recommendedResourceIds.includes(resource.id));
  const submitQuiz = async (event: FormEvent) => {
    event.preventDefault();
    const response = await apiClient.submitLearningQuiz(userId, quizAnswers);
    setQuizResult(response.success ? { result: response.result as QuizResult['result'], feedback: response.feedback as QuizResult['feedback'] } : null);
    setMessage(response.message || '');
  };

  return (
    <div className="feature-hub">
      <header className="feature-hub-heading">
        <div><span className="section-kicker">Planning, learning, and connected services</span><h1>Explore your financial toolkit</h1><p>Learn the basics, review illustrative information, and see which external services are ready to connect.</p></div>
        <span className="feature-hub-mark" aria-hidden="true"><BookOpenText size={28} weight="duotone" /></span>
      </header>
      <nav className="feature-tabs" aria-label="Financial tools">
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={tab === id ? 'is-active' : ''} aria-current={tab === id ? 'page' : undefined} onClick={() => { setTab(id); setMessage(''); }}><Icon size={17} aria-hidden="true" /><span>{label}</span></button>)}
      </nav>
      {message && <p className="feature-message" role="status">{message}</p>}
      {loading ? <p className="feature-loading" role="status">Loading your tools…</p> : (
        <>
          {tab === 'insights' && <section className="feature-content" aria-labelledby="insights-title"><div className="feature-section-title"><span className="section-kicker">General guidance</span><h2 id="insights-title">A few useful places to start</h2><p>These suggestions are educational and are not personalized financial advice.</p></div><div className="feature-card-grid">{insights.map((item) => <article className="feature-card" key={item.id}><span className="feature-card-icon"><Sparkle size={19} /></span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div><form className="feature-question" onSubmit={askQuestion}><label htmlFor="financial-question">Ask a general money question</label><div><input id="financial-question" value={questionText} onChange={(event) => setQuestionText(event.target.value)} maxLength={500} required placeholder="For example: how do I plan an emergency fund?" /><button type="submit" className="button-primary">Ask <ArrowUpRight size={16} /></button></div>{answer && <p className="feature-answer" role="status">{answer}<small>General education only; not personal, investment, tax, or legal advice.</small></p>}</form><button type="button" className="button-outline" onClick={requestConsultation}>Request an advisor conversation</button>{consultationStatus && <p className="feature-unavailable" role="status">{consultationStatus}</p>}</section>}

          {tab === 'learning' && <section className="feature-content" aria-labelledby="learning-title"><div className="feature-section-title"><span className="section-kicker">Short lessons</span><h2 id="learning-title">Build financial confidence</h2><p>Plain-language learning resources and a quick knowledge check.</p></div><div className="resource-list">{resources.map((resource) => <article className="resource-row" key={resource.id}><span className="resource-icon"><BookOpenText size={20} /></span><div><span>{resource.category} · {resource.minutes} min</span><h3>{resource.title}</h3><p>{resource.summary}</p></div></article>)}</div><form className="quiz-panel" onSubmit={submitQuiz}><div className="panel-heading"><span className="eyebrow">KNOWLEDGE CHECK</span><h2>Check what you learned</h2></div>{questions.map((question, questionIndex) => <fieldset className="quiz-question" key={question.id}><legend>{questionIndex + 1}. {question.prompt}</legend>{question.answers.map((choice, choiceIndex) => <label key={choice}><input type="radio" name={question.id} checked={quizAnswers[questionIndex] === choiceIndex} onChange={() => setQuizAnswers((current) => { const next = [...current]; next[questionIndex] = choiceIndex; return next; })} required />{choice}</label>)}</fieldset>)}<button type="submit" className="button-primary" disabled={quizAnswers.length !== questions.length || quizAnswers.some((value) => value === undefined)}>Submit answers</button>{quizResult && <><p className="quiz-score" role="status">Score: {quizResult.result.score} of {quizResult.result.total}.</p><ul className="quiz-feedback">{quizResult.feedback.map((item) => <li key={item.questionId}><strong>{item.correct ? 'Correct' : 'Review this topic'}</strong><span>{item.explanation}</span></li>)}</ul>{recommendedResources.length > 0 && <div className="quiz-recommendations"><strong>Suggested next lessons</strong>{recommendedResources.map((resource) => <span key={resource.id}>{resource.title}</span>)}</div>}</>}</form></section>}

          {tab === 'investing' && <section className="feature-content" aria-labelledby="investing-title"><div className="feature-section-title"><span className="section-kicker">Illustrative options</span><h2 id="investing-title">Understand risk before comparing options</h2><p>No live market data, brokerage, or portfolio connection is configured. These descriptions are educational examples, not recommendations.</p></div><div className="investment-list">{options.map((option) => <label className="investment-row" key={option.id}><input type="checkbox" checked={selected.includes(option.id)} onChange={() => toggleOption(option.id)} /><span><strong>{option.name}</strong><small>{option.category}</small><p>{option.risk}</p></span><em>{option.availability}</em></label>)}</div><button type="button" className="button-primary" onClick={saveStrategy}>Save sample preferences</button></section>}

          {tab === 'offers' && <section className="feature-content" aria-labelledby="offers-title"><div className="feature-section-title"><span className="section-kicker">Partner catalogue</span><h2 id="offers-title">Offers from connected partners</h2><p>Offers will appear here when a partner catalogue is configured.</p></div>{offersAvailable ? <div className="feature-card-grid" /> : <div className="provider-empty"><Compass size={24} /><strong>No offer catalogue connected</strong><span>There are no active or redeemable partner offers in this environment.</span></div>}</section>}

          {tab === 'connections' && <section className="feature-content" aria-labelledby="connections-title"><div className="feature-section-title"><span className="section-kicker">External providers</span><h2 id="connections-title">Your financial connections</h2><p>Connectors are shown as unavailable until provider credentials and an approved integration are configured.</p></div><div className="connection-list">{connections.map((connection) => <article className="connection-row" key={connection.provider}><span className="connection-symbol"><ShieldCheck size={20} /></span><div><strong>{connection.provider}</strong><small>{connection.status}</small></div><span className="connection-state">Not connected</span></article>)}<article className="connection-row"><span className="connection-symbol"><Briefcase size={20} /></span><div><strong>Payment cards</strong><small>Card provider</small></div><span className="connection-state">Not connected</span></article></div><p className="feature-unavailable">No bank, wallet, card, market-data, advisor, or partner service is connected. No financial credentials are requested or stored here.</p></section>}
        </>
      )}
    </div>
  );
};

export default FeatureHubPage;
