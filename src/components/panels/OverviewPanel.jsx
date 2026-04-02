import UiIcon from '../icons/UiIcon';
import { highlights, homeSummary } from '../../data/appData';

function OverviewPanel({ highlightedId }) {
  return (
    <section className="overview-grid overview-grid--single">
      <section className="content-panel overview-content-panel">
        <div className="content-top" aria-hidden="true">
          <span />
          <span />
        </div>

        <ul className="highlight-list">
          {highlights.map((item, index) => (
            <li className={`highlight-item ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
              <span className="item-icon">
                <UiIcon type={item.icon} />
              </span>
              <div className="item-copy">
                <div className="item-copy__header">
                  <span className="item-number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <article className="overview-summary-card">
          <span className="overview-summary-badge">{homeSummary.badge}</span>
          <h3>{homeSummary.title}</h3>
          <p>{homeSummary.description}</p>
          <div className="overview-summary-points">
            {homeSummary.points.map((point) => (
              <span className="overview-summary-point" key={point}>
                {point}
              </span>
            ))}
          </div>
          <span className="overview-contact-note">{homeSummary.contactLabel}</span>
          <a className="overview-contact" href={homeSummary.contactHref} target="_blank" rel="noreferrer">
            {homeSummary.contactValue}
          </a>
        </article>
      </section>
    </section>
  );
}

export default OverviewPanel;
