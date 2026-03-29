import { useState } from 'react';
import clientLogo from './assets/client-logo.svg';

const highlights = [
  {
    text: 'Nhận hỗ trợ phát triển kênh và tối ưu các chỉ số follow, like, comment ,.. đầy đủ chức năng theo hướng chuyên nghiệp.',
    icon: 'growth',
  },
  {
    text: 'Hỗ trợ Facebook, Instagram, TikTok, đánh giá trên Google, Google Maps, YouTube và Shopee với mức phí sinh viên.',
    icon: 'platforms',
  },
  {
    text: 'Đã làm cho nhiều page, shop và cả acc cá nhân. Có thể ib riêng để xem mẫu và case study.',
    icon: 'proof',
  },
];

const serviceCards = [
  {
    title: 'Buff Follow / Like / Comment',
    description: 'Hỗ trợ tăng hiện diện và tương tác cho page, profile, shop hoặc kênh nội dung theo nhu cầu.',
    icon: 'growth',
  },
  {
    title: 'Facebook / Instagram',
    description: 'Phù hợp cho page bán hàng, thương hiệu cá nhân hoặc acc cần tăng độ tin cậy và sức hút.',
    icon: 'platforms',
  },
  {
    title: 'TikTok / YouTube',
    description: 'Tối ưu chỉ số nền tảng video để kênh nhìn chuyên nghiệp hơn và dễ kéo thêm người xem.',
    icon: 'spark',
  },
  {
    title: 'Google Review / Maps',
    description: 'Có hỗ trợ phần đánh giá Google, Google Maps và các nhu cầu tăng nhận diện doanh nghiệp.',
    icon: 'proof',
  },
  {
    title: 'Shopee / Shop Social',
    description: 'Hỗ trợ tăng độ uy tín và mức độ thu hút cho shop, đặc biệt phù hợp mô hình bán hàng online.',
    icon: 'layers',
  },
  {
    title: 'Mức phí sinh viên',
    description: 'Chi phí linh hoạt, dễ bắt đầu, phù hợp người mới làm page hoặc cần chạy nhanh một gói cơ bản.',
    icon: 'chat',
  },
];

const platformCards = [
  {
    name: 'Facebook',
    detail: 'Page bán hàng, thương hiệu cá nhân, profile dịch vụ.',
    icon: 'grid',
  },
  {
    name: 'Instagram',
    detail: 'Trang cá nhân, social branding, tương tác hình ảnh.',
    icon: 'spark',
  },
  {
    name: 'TikTok',
    detail: 'Kênh video ngắn, creator profile và tăng độ phủ.',
    icon: 'layers',
  },
  {
    name: 'Google / Maps',
    detail: 'Hiển thị doanh nghiệp, review và độ tin cậy thương hiệu.',
    icon: 'proof',
  },
  {
    name: 'YouTube',
    detail: 'Kênh nội dung dài, tăng độ nhận diện và chỉ số social.',
    icon: 'people',
  },
  {
    name: 'Shopee',
    detail: 'Shop online, độ uy tín gian hàng và sức hút mua hàng.',
    icon: 'chat',
  },
];

const caseCards = [
  {
    title: 'Đã triển khai nhiều page',
    description: 'Từng hỗ trợ nhiều page bán hàng, shop online và cả tài khoản cá nhân ở nhiều nhóm lĩnh vực khác nhau.',
  },
  {
    title: 'Case study gửi riêng',
    description: 'Do ưu tiên quyền riêng tư của khách hàng nên ảnh mẫu, số liệu và ví dụ thực tế sẽ được gửi qua inbox riêng.',
  },
  {
    title: 'Nhận làm linh hoạt',
    description: 'Có thể nhận theo mục tiêu cụ thể như tăng tương tác, làm đẹp profile hoặc hỗ trợ chỉ số cho từng nền tảng.',
  },
];

const tabs = [
  {
    id: 'overview',
    label: 'Tổng quan',
    icon: 'grid',
    eyebrow: 'Preview Dashboard',
    title: 'Hồ sơ dịch vụ Tu Huy',
    stats: [
      { label: 'Giao diện', value: 'Landing CV' },
      { label: 'Nền tảng', value: '06 kênh' },
      { label: 'Hiển thị', value: 'Overview' },
    ],
  },
  {
    id: 'services',
    label: 'Dịch vụ',
    icon: 'spark',
    eyebrow: 'Service Catalog',
    title: 'Danh mục dịch vụ đang hỗ trợ',
    stats: [
      { label: 'Nhóm dịch vụ', value: '06 gói' },
      { label: 'Chi phí', value: 'Sinh viên' },
      { label: 'Hiển thị', value: 'Service UI' },
    ],
  },
  {
    id: 'platforms',
    label: 'Nền tảng',
    icon: 'layers',
    eyebrow: 'Platform Coverage',
    title: 'Các nền tảng đang nhận hỗ trợ',
    stats: [
      { label: 'Facebook', value: 'Co' },
      { label: 'TikTok', value: 'Co' },
      { label: 'Google', value: 'Co' },
    ],
  },
  {
    id: 'case-study',
    label: 'Case Study',
    icon: 'proof',
    eyebrow: 'Private Portfolio',
    title: 'Case Study và kinh nghiệm triển khai',
    stats: [
      { label: 'Portfolio', value: 'Inbox riêng' },
      { label: 'Khách hàng', value: 'Nhiều page' },
      { label: 'Hiển thị', value: 'Private' },
    ],
  },
];

function UiIcon({ type }) {
  if (type === 'growth') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 17.5L10 12.5L13.5 16L20 8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8.5H20V13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'platforms') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="4.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="13.5" y="4.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8.5" y="13.5" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10.5 8H13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 11.5V13.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'proof') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.5L18 7.2V12.2C18 15.7 15.5 18.7 12 19.5C8.5 18.7 6 15.7 6 12.2V7.2L12 4.5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9.5 12L11.2 13.7L14.8 10.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'grid') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="13" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === 'spark') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3L13.9 8.1L19 10L13.9 11.9L12 17L10.1 11.9L5 10L10.1 8.1L12 3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'layers') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4L20 8L12 12L4 8L12 4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M4 12L12 16L20 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16L12 20L20 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'people') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 11C10.6569 11 12 9.65685 12 8C12 6.34315 10.6569 5 9 5C7.34315 5 6 6.34315 6 8C6 9.65685 7.34315 11 9 11Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M15.5 10C16.8807 10 18 8.88071 18 7.5C18 6.11929 16.8807 5 15.5 5C14.1193 5 13 6.11929 13 7.5C13 8.88071 14.1193 10 15.5 10Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4.5 18C5.2 15.8 7.1 14.5 9.4 14.5C11.7 14.5 13.6 15.8 14.3 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M14.7 17C15.1 15.6 16.3 14.7 17.8 14.7C19 14.7 20 15.2 20.6 16.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'chat') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 17.5L4 20V6.8C4 5.81 4.81 5 5.8 5H18.2C19.19 5 20 5.81 20 6.8V15.2C20 16.19 19.19 17 18.2 17H6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 10H16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 13H13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'search') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20L16.2 16.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'bell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10C7 7.24 9.24 5 12 5C14.76 5 17 7.24 17 10V13.5L18.5 16H5.5L7 13.5V10Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M10 18C10.5 19 11.1 19.5 12 19.5C12.9 19.5 13.5 19 14 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15A1 1 0 0 0 19.6 16.1L19.7 16.2A2 2 0 1 1 16.8 19.1L16.7 19A1 1 0 0 0 15.6 18.8A1 1 0 0 0 15 19.7V20A2 2 0 1 1 11 20V19.8A1 1 0 0 0 10.4 18.9A1 1 0 0 0 9.3 19.1L9.2 19.2A2 2 0 1 1 6.3 16.3L6.4 16.2A1 1 0 0 0 6.6 15.1A1 1 0 0 0 5.7 14.5H5.5A2 2 0 1 1 5.5 10.5H5.7A1 1 0 0 0 6.6 9.9A1 1 0 0 0 6.4 8.8L6.3 8.7A2 2 0 1 1 9.2 5.8L9.3 5.9A1 1 0 0 0 10.4 6.1A1 1 0 0 0 11 5.2V5A2 2 0 1 1 15 5V5.2A1 1 0 0 0 15.6 6.1A1 1 0 0 0 16.7 5.9L16.8 5.8A2 2 0 1 1 19.7 8.7L19.6 8.8A1 1 0 0 0 19.4 9.9A1 1 0 0 0 20.3 10.5H20.5A2 2 0 1 1 20.5 14.5H20.3A1 1 0 0 0 19.4 15Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function OverviewPanel() {
  return (
    <section className="overview-grid">
      <section className="brand-panel">
        <div className="brand-frame">
          <div className="brand-backdrop" aria-hidden="true" />
          <img className="brand-logo" src={clientLogo} alt="Logo Tu Huy Business & Consultancy" />
        </div>
      </section>

      <section className="content-panel">
        <div className="content-top" aria-hidden="true">
          <span />
          <span />
        </div>

        <ul className="highlight-list">
          {highlights.map((item, index) => (
            <li className="highlight-item" key={item.text}>
              <span className="item-icon">
                <UiIcon type={item.icon} />
              </span>
              <div className="item-copy">
                <span className="item-number">0{index + 1}</span>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function ServicesPanel() {
  return (
    <section className="panel-screen">
      <div className="panel-heading">
        <p className="panel-label">Danh mục dịch vụ</p>
        <h2>Chỉ khi bấm tab Dịch vụ thì phần UI này mới hiển thị.</h2>
      </div>

      <div className="service-grid">
        {serviceCards.map((item) => (
          <article className="service-card" key={item.title}>
            <span className="service-card__icon">
              <UiIcon type={item.icon} />
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlatformsPanel() {
  return (
    <section className="panel-screen">
      <div className="panel-heading">
        <p className="panel-label">Nền tảng hỗ trợ</p>
        <h2>Các kênh đang nhận hỗ trợ hiển thị thành từng card riêng.</h2>
      </div>

      <div className="platform-grid">
        {platformCards.map((item) => (
          <article className="platform-card" key={item.name}>
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

function CaseStudyPanel() {
  return (
    <section className="panel-screen">
      <div className="panel-heading">
        <p className="panel-label">Case Study</p>
        <h2>Phần này mô phỏng khu vực chia sẻ kinh nghiệm và portfolio riêng tư.</h2>
      </div>

      <div className="case-grid">
        <article className="case-hero">
          <div className="case-hero__logo">
            <img src={clientLogo} alt="Tu Huy logo preview" />
          </div>
          <div>
            <h3>Portfolio sẽ gửi qua inbox</h3>
            <p>Để đảm bảo riêng tư cho khách hàng, ảnh mẫu và chi tiết case study có thể gửi riêng khi cần.</p>
          </div>
        </article>

        {caseCards.map((item, index) => (
          <article className="case-card" key={item.title}>
            <span className="case-card__number">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const activeMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="page-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <main className="dashboard-shell">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="sidebar-brand__logo">
              <img src={clientLogo} alt="Tu Huy logo" />
            </div>
            <div>
              <strong>Tu Huy</strong>
              <span>Business &amp; Consultancy</span>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Sidebar navigation">
            {tabs.map((item) => (
              <button
                type="button"
                className={`sidebar-item ${activeTab === item.id ? 'is-active' : ''}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="sidebar-item__icon">
                  <UiIcon type={item.icon} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-card">
            <p>Website Preview</p>
            <strong>Header + Sidebar</strong>
            <span>Tab nào được bấm thì phần nội dung tương ứng sẽ hiển thị ngay bên phải.</span>
          </div>
        </aside>

        <section className="workspace">
          <header className="workspace-header">
            <div className="workspace-header__title">
              <p className="eyebrow">{activeMeta.eyebrow}</p>
              <h1>{activeMeta.title}</h1>
            </div>

            <div className="workspace-header__actions">
              <div className="search-box">
                <UiIcon type="search" />
                <span>Tìm kiếm nhanh...</span>
              </div>
              <span className="icon-button">
                <UiIcon type="bell" />
              </span>
              <span className="icon-button">
                <UiIcon type="settings" />
              </span>
              <span className="profile-badge">Online</span>
            </div>
          </header>

          <div className="header-tabs" aria-label="Tabs preview">
            {tabs.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`header-tab ${activeTab === item.id ? 'is-active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <section className="status-grid">
            {activeMeta.stats.map((card) => (
              <article className="status-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </section>

          <section className="workspace-body">
            {activeTab === 'overview' && <OverviewPanel />}
            {activeTab === 'services' && <ServicesPanel />}
            {activeTab === 'platforms' && <PlatformsPanel />}
            {activeTab === 'case-study' && <CaseStudyPanel />}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
