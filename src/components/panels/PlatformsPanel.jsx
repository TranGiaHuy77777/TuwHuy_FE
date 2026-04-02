import UiIcon from '../icons/UiIcon';
import { platformCards } from '../../data/appData';

function PlatformsPanel({ highlightedId }) {
  return (
    <section className="panel-screen">
      <div className="panel-heading">
        <p className="panel-label">Nền tảng hỗ trợ</p>
      </div>

      <div className="platform-grid">
        {platformCards.map((item) => (
          <article className={`platform-card ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
            <span className="platform-card__icon">
              <UiIcon type={item.icon} />
            </span>
            <h3>{item.name}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PlatformsPanel;
