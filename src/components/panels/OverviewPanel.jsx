import clientLogo from '../../assets/logo11.jpg';
import pageCoverImage from '../../assets/z7702200089031_9744637952ef32b5d59114e2200cb6c8.jpg';
import { homeSummary } from '../../data/appData';

function OverviewPanel({ highlightedId, onConsultationRequest }) {
  const heroStats = [
    { id: 'intro-exp', value: '19+', label: 'Năm kinh nghiệm' },
    { id: 'intro-brand', value: '200+', label: 'Thương hiệu lớn' },
    { id: 'intro-project', value: '5000+', label: 'Dự án' },
  ];

  return (
    <section className="intro-hero">
      <div className="intro-hero__content">
        <div className="intro-brand-mark">
          <img src={clientLogo} alt="Tu Huy brand" />
          <span>Tu Huy Business</span>
        </div>

        <h2 className="intro-hero__title">Dịch vụ thiết kế website theo yêu cầu cho doanh nghiệp và startup</h2>
        <p className="intro-hero__desc">{homeSummary.description}</p>

        <div className="intro-hero__stats">
          {heroStats.map((item) => (
            <article className={`intro-stat-card ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>

        <div className="intro-hero__actions">
          <button type="button" className="intro-btn intro-btn--primary" onClick={onConsultationRequest}>
            Gặp chuyên gia của chúng tôi
          </button>
          <a className="intro-btn intro-btn--ghost" href={homeSummary.contactHref} target="_blank" rel="noreferrer">
            Tư vấn miễn phí
          </a>
        </div>
      </div>

      <div className="intro-hero__visual" aria-hidden="true">
        <div className="intro-hero__orb" />
        <div className="intro-hero__screen intro-hero__screen--main">
          <img src={pageCoverImage} alt="" />
        </div>
        <div className="intro-hero__screen intro-hero__screen--top">
          <img src={pageCoverImage} alt="" />
        </div>
        <div className="intro-hero__screen intro-hero__screen--side">
          <img src={pageCoverImage} alt="" />
        </div>
      </div>
    </section>
  );
}

export default OverviewPanel;
