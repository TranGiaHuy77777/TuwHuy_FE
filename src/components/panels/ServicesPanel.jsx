import { useEffect, useState } from 'react';
import {
  FaApple,
  FaArrowUpRightDots,
  FaBookOpen,
  FaBookmark,
  FaChartLine,
  FaCircleInfo,
  FaCommentDots,
  FaDiscord,
  FaEye,
  FaFacebookF,
  FaFileContract,
  FaGlobe,
  FaGoogle,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaLink,
  FaPinterestP,
  FaPlay,
  FaShareNodes,
  FaSignal,
  FaSoundcloud,
  FaSpotify,
  FaStar,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaUserPlus,
  FaUsers,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { SiAudiomack, SiShopee, SiThreads } from 'react-icons/si';
import { otherFunctionLinks, serviceCatalogSections, servicePackages } from '../../data/appData';

const serviceHighlightLookup = Object.fromEntries(
  serviceCatalogSections.flatMap((section) => [
    [section.id, section.id],
    ...section.items.map((item) => [item.id, section.id]),
  ]),
);

const serviceCatalogItemLookup = Object.fromEntries(
  serviceCatalogSections.flatMap((section) =>
    section.items.map((item) => [item.id, { sectionId: section.id, item }]),
  ),
);

const serviceCatalogIconMap = {
  'catalog-facebook': FaFacebookF,
  'catalog-instagram': FaInstagram,
  'catalog-tiktok': FaTiktok,
  'catalog-bigo': FaArrowUpRightDots,
  'catalog-youtube': FaYoutube,
  'catalog-shopee': SiShopee,
  'catalog-google': FaGoogle,
  'catalog-twitter': FaXTwitter,
  'catalog-twitch': FaTwitch,
  'catalog-telegram': FaTelegram,
  'catalog-soundcloud': FaSoundcloud,
  'catalog-spotify': FaSpotify,
  'catalog-discord': FaDiscord,
  'catalog-threads': SiThreads,
  'catalog-web-traffic': FaGlobe,
  'catalog-pinterest': FaPinterestP,
  'catalog-apple-music': FaApple,
  'catalog-audiomack': SiAudiomack,
  'catalog-linkedin': FaLinkedinIn,
  'catalog-whatsapp': FaWhatsapp,
};

const otherFunctionIconMap = {
  'other-support-contact': FaCircleInfo,
  'other-tiktok-link': FaLink,
  'other-facebook-via': FaFacebookF,
  'other-terms': FaFileContract,
  'other-api-docs': FaBookOpen,
};

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

function getServiceCatalogIcon(sectionId) {
  return serviceCatalogIconMap[sectionId] ?? FaCircleInfo;
}

function getOtherFunctionIcon(itemId) {
  return otherFunctionIconMap[itemId] ?? FaCircleInfo;
}

function getServiceItemIcon(label) {
  const normalized = normalizeText(label);

  if (normalized.includes('review') || normalized.includes('star')) return FaStar;
  if (normalized.includes('comment') || normalized.includes('reply') || normalized.includes('binh luan')) return FaCommentDots;
  if (normalized.includes('share') || normalized.includes('retweet') || normalized.includes('mention')) return FaShareNodes;
  if (normalized.includes('member')) return FaUsers;
  if (normalized.includes('follow') || normalized.includes('subscriber') || normalized.includes('subscribe') || normalized.includes('theo doi')) return FaUserPlus;
  if (normalized.includes('like') || normalized.includes('tim')) return FaHeart;
  if (normalized.includes('save')) return FaBookmark;
  if (normalized.includes('traffic') || normalized.includes('impression') || normalized.includes('reach') || normalized.includes('visitor')) return FaChartLine;
  if (normalized.includes('poll') || normalized.includes('vote')) return FaSignal;
  if (normalized.includes('view') || normalized.includes('mat') || normalized.includes('eye')) return FaEye;
  if (normalized.includes('live') || normalized.includes('video') || normalized.includes('stream') || normalized.includes('reel') || normalized.includes('short') || normalized.includes('play')) return FaPlay;

  return FaCircleInfo;
}

function getServicePanelStateFromHighlight(value) {
  const sectionId = serviceHighlightLookup[value] ?? serviceCatalogSections[0].id;
  const itemEntry = serviceCatalogItemLookup[value];

  return {
    sectionId,
    itemId: itemEntry?.item.id ?? '',
  };
}

function getServiceItemCategory(label) {
  const normalized = normalizeText(label);

  if (normalized.includes('follow') || normalized.includes('subscriber') || normalized.includes('member')) return 'Tăng theo dõi';
  if (normalized.includes('like') || normalized.includes('comment') || normalized.includes('share') || normalized.includes('review')) return 'Tăng tương tác';
  if (normalized.includes('view') || normalized.includes('stream') || normalized.includes('live') || normalized.includes('play') || normalized.includes('traffic')) return 'Tăng hiển thị';

  return 'Dịch vụ hỗ trợ';
}

function getServiceItemPreviewText(section, item) {
  return `${item.label} thuộc ${section.label}. Khu vực bên phải đang được chừa sẵn để hiển thị bảng giá, mô tả chi tiết, hình minh hoạ hoặc nội dung bạn muốn gắn khi khách bấm vào từng mục.`;
}

export function ServiceCatalogBadge({ section, size = 'md' }) {
  const Icon = getServiceCatalogIcon(section.id);

  return (
    <span
      className={`service-catalog-badge service-catalog-badge--${size}`}
      style={{ '--catalog-color': section.color, '--catalog-soft-color': section.softColor }}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}

export function ServiceCatalogOtherIcon({ item }) {
  const Icon = getOtherFunctionIcon(item.id);

  return (
    <span
      className="service-catalog-other-item__icon"
      style={{ '--catalog-color': item.color, '--catalog-soft-color': item.softColor }}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}

function ServiceCatalogEntryIcon({ item, section }) {
  const Icon = getServiceItemIcon(item.label);

  return (
    <span
      className="service-catalog-entry__icon"
      style={{ '--catalog-color': section.color, '--catalog-soft-color': section.softColor }}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}

function ServicesPanel({ highlightedId, onSelectServiceItem }) {
  const initialState = getServicePanelStateFromHighlight(highlightedId);
  const [activeSectionId, setActiveSectionId] = useState(initialState.sectionId);
  const [activeItemId, setActiveItemId] = useState(initialState.itemId);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [quantity, setQuantity] = useState(100);

  useEffect(() => {
    const nextState = getServicePanelStateFromHighlight(highlightedId);
    setActiveSectionId(nextState.sectionId);
    setActiveItemId(nextState.itemId);
    setSelectedPackageId(null);
    setQuantity(100);
  }, [highlightedId]);

  const activeSection = serviceCatalogSections.find((section) => section.id === activeSectionId) ?? serviceCatalogSections[0];
  const activeItem = activeSection.items.find((item) => item.id === activeItemId) ?? null;

  const handleItemSelect = (sectionId, itemId) => {
    setActiveSectionId(sectionId);
    setActiveItemId(itemId);
    setSelectedPackageId(null);
    setQuantity(100);
    // Call callback to navigate to service detail view
    if (onSelectServiceItem) {
      onSelectServiceItem(itemId, sectionId);
    }
  };

  // Get service packages for the active item
  const activeItemPackages = activeItemId && servicePackages[activeItemId] ? servicePackages[activeItemId] : null;

  // Prices are already baked in data; no runtime multiplier.
  const priceMultiplier = 1;

  // Get selected package details
  const selectedPackage = activeItemPackages && selectedPackageId ? activeItemPackages.find(pkg => pkg.id === selectedPackageId) : null;

  // Calculate total price in VND
  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    return Math.round(selectedPackage.price * priceMultiplier * quantity);
  };

  // Convert VND to USD (1 USD = ~24,000 VND approximately)
  const convertVNDtoUSD = (vnd) => {
    return (vnd / 24000).toFixed(3);
  };

  const totalPriceVND = calculateTotalPrice();
  const totalPriceUSD = convertVNDtoUSD(totalPriceVND);

  return (
    <section className="panel-screen service-catalog-panel">
      <div className="panel-heading">
        <p className="panel-label">Danh mục dịch vụ</p>
        <h2>Thông tin các dịch vụ MXH</h2>
      </div>

      <div className="service-catalog-layout service-catalog-layout--single">
        <section className="service-catalog-detail">
          <article className={`service-catalog-detail-card ${activeItem ? 'is-highlighted' : ''}`}>
            <div className="service-catalog-detail-header">
              <div className="service-catalog-detail-header__main">
                <ServiceCatalogBadge section={activeSection} size="lg" />
                <div>
                  <h3>{activeItem ? activeItem.label : activeSection.label}</h3>
                  <p>{activeItem ? `${activeSection.label} • ${getServiceItemCategory(activeItem.label)}` : activeSection.note}</p>
                </div>
              </div>
            </div>

            <div className="service-catalog-preview">
              <div className="service-catalog-preview__meta">
                <span className="service-catalog-preview__pill">{activeSection.label}</span>
                <span className="service-catalog-preview__pill">{activeItem ? getServiceItemCategory(activeItem.label) : 'Chọn dịch vụ'}</span>
                <span className="service-catalog-preview__pill">Click để hiển thị</span>
              </div>

              {activeSection.items.length > 0 ? (
                <div className="service-catalog-inline-list">
                  {activeSection.items.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={`service-catalog-subitem ${activeItemId === item.id ? 'is-active' : ''}`}
                      onClick={() => handleItemSelect(activeSection.id, item.id)}
                    >
                      <ServiceCatalogEntryIcon item={item} section={activeSection} />
                      <span className={`service-catalog-subitem__text ${item.highlight ? 'is-accent' : ''}`}>{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="service-catalog-submenu service-catalog-submenu--empty">
                  <p>{activeSection.emptyMessage ?? 'Danh mục đang được cập nhật thêm.'}</p>
                </div>
              )}

              {activeItem ? (
                <>
                  {activeItemPackages ? (
                    <>
                      <p className="service-catalog-preview__text">Danh sách các gói dịch vụ {activeItem.label} - Giá đã được {priceMultiplier === 3.3 ? 'nhân lên 3.3 lần' : 'cập nhật'}</p>
                      <div className="pricing-notice-box">
                        Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
                      </div>
                      <div className="service-package-container">
                        <div className="service-package-main">
                          <div className="service-package-list">
                            {activeItemPackages.map((pkg) => (
                              <label key={pkg.id} className="service-package-item">
                                <input
                                  type="radio"
                                  name="service-package"
                                  value={pkg.id}
                                  checked={selectedPackageId === pkg.id}
                                  onChange={() => setSelectedPackageId(pkg.id)}
                                  className="service-package-radio"
                                />
                                <div className="service-package-info">
                                  <span className="service-package-name">{pkg.name}</span>
                                  {pkg.note && <p className="service-package-note">{pkg.note}</p>}
                                </div>
                                <div className="service-package-price">
                                  <span className={`price ${pkg.badge ? `badge-${pkg.badge}` : ''}`}>
                                    {(pkg.price * priceMultiplier).toFixed(1)}đ
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
                            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
                            <ul className="service-policy-list">
                              <li>Nghiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồi trụy,... Nếu cố tình buff bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.</li>
                              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
                              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
                              <li>Chỉ nhận id bài viết công khai, không nhập id album, id comment, id trang cá nhân, id page,...</li>
                              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="service-package-options">
                          <div className="package-option-group">
                            <label className="package-option-label">Cấm xúc</label>
                            <div className="emotion-buttons">
                              <button className="emotion-btn">👍</button>
                              <button className="emotion-btn">😆</button>
                              <button className="emotion-btn">❤️</button>
                              <button className="emotion-btn">😲</button>
                              <button className="emotion-btn">😢</button>
                              <button className="emotion-btn">🤔</button>
                              <button className="emotion-btn">😠</button>
                            </div>
                          </div>
                          <div className="package-option-group">
                            <label className="package-option-label">Số lượng</label>
                            <input 
                              type="number" 
                              className="quantity-input" 
                              value={quantity}
                              onChange={(e) => setQuantity(Math.max(100, parseInt(e.target.value) || 100))}
                              min="100"
                              step="100"
                            />
                          </div>
                          <div className="package-total-price">
                            <p>Tống tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span> | <span className="total-usd">{totalPriceUSD}$</span></p>
                          </div>
                          <button className="package-submit-btn">Tạo tiền trình</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="service-catalog-preview__text">{getServiceItemPreviewText(activeSection, activeItem)}</p>
                      <div className="service-catalog-preview__canvas">
                        <p className="service-catalog-preview__eyebrow">Khu vực hiển thị nội dung</p>
                        <h4>{activeItem.label}</h4>
                        <p>
                          Bạn có thể gắn bảng giá, mô tả chi tiết, ảnh dịch vụ, hướng dẫn mua hoặc bất kỳ nội dung nào dành riêng cho mục này vào khung bên phải.
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="service-catalog-placeholder__canvas">
                  <p className="service-catalog-preview__eyebrow">Khung hiển thị bên phải</p>
                  <h4>Chọn một mục nhỏ ở bên trái</h4>
                  <p>Bấm từng dịch vụ trong danh sách để xem nội dung chi tiết tương ứng.</p>
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}

export default ServicesPanel;
