import React from 'react';
import { CreditCard, ShieldCheck, ArrowUpRight, BellRinging } from '@phosphor-icons/react';

const PaymentsPage: React.FC = () => <div className="workflow-page">
  <header className="module-heading"><div><span className="eyebrow">PAYMENT SERVICES</span><h1>Payments</h1></div><p>Manage payment activity and payment methods from one place.</p></header>
  <section className="payment-readiness"><div className="readiness-art"><span><CreditCard size={30} weight="duotone"/></span><i/><i/><i/></div><div className="readiness-copy"><span className="readiness-label"><span/> PROVIDER CONNECTION REQUIRED</span><h2>Payment services are getting ready.</h2><p>Payment processing is unavailable until a payment provider is connected. No charges, refunds, or scheduled payments can be made here.</p><div className="readiness-features"><span><ShieldCheck size={16}/> Secure provider setup</span><span><BellRinging size={16}/> Activity notifications</span></div></div></section>
  <section className="workflow-panel payment-method-panel"><div className="panel-heading"><span className="eyebrow">PAYMENT METHODS</span><h2>Methods will appear here</h2></div><div className="empty-state"><strong>No payment methods connected</strong><p>When payment services are configured, you can manage saved methods and review their status here.</p></div></section>
  <div className="payment-readiness-foot"><span className="readiness-lock"><ShieldCheck size={18}/></span><span><b>Your payment details are protected</b><small>Payment credentials should only be collected through a verified payment provider.</small></span><ArrowUpRight size={16}/></div>
</div>;
export default PaymentsPage;
