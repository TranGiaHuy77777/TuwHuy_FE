import clientLogo from '../../assets/client-logo.svg';
import { caseCards, caseHeroCard } from '../../data/appData';

function CaseStudyPanel({ highlightedId }) {
  return (
    <section className="panel-screen">
      <div className="panel-heading">
        <p className="panel-label">Case Study</p>
        <h2>Phần này mô phỏng khu vực chia sẻ kinh nghiệm và portfolio riêng tư.</h2>
      </div>

      <div className="case-grid">
        <article className={`case-hero ${highlightedId === caseHeroCard.id ? 'is-highlighted' : ''}`}>
          <div className="case-hero__logo">
            <img src={clientLogo} alt="Tu Huy logo preview" />
          </div>
          <div>
            <h3>{caseHeroCard.title}</h3>
            <p>{caseHeroCard.description}</p>
          </div>
        </article>

        {caseCards.map((item, index) => (
          <article className={`case-card ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
            <span className="case-card__number">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CaseStudyPanel;
