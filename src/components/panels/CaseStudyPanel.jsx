import pageCoverImage from '../../assets/z7702200089031_9744637952ef32b5d59114e2200cb6c8.jpg';
import { websiteTemplateCards, websiteTemplateCategories } from '../../data/appData';

function CaseStudyPanel({ highlightedId }) {
  return (
    <section className="template-catalog">
      <aside className="template-catalog__sidebar">
        <h3>Xem theo lĩnh vực</h3>
        <ul>
          {websiteTemplateCategories.map((category) => (
            <li key={category.id}>
              <button type="button" className={`${category.id === 'all' ? 'is-active' : ''}`}>
                {category.label} ({category.count})
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="template-catalog__content">
        <div className="template-catalog__topbar">
          <h2>273 mẫu thiết kế</h2>
          <label className="template-sort">
            <span>Sắp xếp theo</span>
            <select defaultValue="newest">
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến</option>
            </select>
          </label>
        </div>

        <div className="template-card-grid">
          {websiteTemplateCards.map((item) => (
            <article className={`template-card ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
              <div className="template-card__thumb">
                {item.isNew ? <span className="template-badge-new">NEW</span> : null}
                <img src={pageCoverImage} alt={item.title} />
              </div>
              <div className="template-card__body">
                <h3>{item.title}</h3>
                <p>{item.category}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStudyPanel;
