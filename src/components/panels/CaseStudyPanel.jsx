import { useState, useMemo } from 'react';
import { websiteTemplateCards, websiteTemplateCategories } from '../../data/appData';

const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160"><rect fill="%23456ACF" width="400" height="160" opacity="0.1"/></svg>';

function CaseStudyPanel({ highlightedId }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [failedImages, setFailedImages] = useState(new Set());

  // Tính count thực tế cho mỗi category từ websiteTemplateCards
  const categoryCounts = useMemo(() => {
    const counts = { all: websiteTemplateCards.length };
    websiteTemplateCards.forEach((card) => {
      const categoryLabel = card.category;
      counts[categoryLabel] = (counts[categoryLabel] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter templates dựa theo category được chọn
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') {
      return websiteTemplateCards;
    }
    // Tìm category label từ id hoặc dùng trực tiếp
    const selectedCategoryObj = websiteTemplateCategories.find((cat) => cat.id === selectedCategory);
    if (!selectedCategoryObj) return websiteTemplateCards;
    return websiteTemplateCards.filter((card) => card.category === selectedCategoryObj.label);
  }, [selectedCategory]);

  const handleImageError = (cardId) => {
    setFailedImages(prev => new Set([...prev, cardId]));
  };

  return (
    <section className="template-catalog">
      <aside className="template-catalog__sidebar">
        <h3>Xem theo lĩnh vực</h3>
        <ul>
          {websiteTemplateCategories.map((category) => {
            // Lấy count thực tế từ dữ liệu
            const realCount = category.id === 'all' 
              ? websiteTemplateCards.length 
              : (categoryCounts[category.label] || 0);
            
            return (
              <li key={category.id}>
                <button 
                  type="button" 
                  className={`${selectedCategory === category.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label} ({realCount})
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="template-catalog__content">
        <div className="template-catalog__topbar">
          <h2>{filteredTemplates.length} mẫu thiết kế</h2>
          <label className="template-sort">
            <span>Sắp xếp theo</span>
            <select defaultValue="newest">
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến</option>
            </select>
          </label>
        </div>

        <div className="template-card-grid">
          {filteredTemplates.map((item) => (
            <article className={`template-card ${highlightedId === item.id ? 'is-highlighted' : ''}`} key={item.id}>
              <div className="template-card__thumb">
                {item.isNew ? <span className="template-badge-new">NEW</span> : null}
                <img 
                  src={failedImages.has(item.id) ? DEFAULT_PLACEHOLDER : item.thumbImage} 
                  alt={item.title}
                  loading="lazy"
                  onError={() => handleImageError(item.id)}
                />
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
