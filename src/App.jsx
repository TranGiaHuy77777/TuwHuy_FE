import { useEffect, useRef, useState } from 'react';
import { FaFacebookMessenger } from 'react-icons/fa6';
import clientLogo from './assets/logo11.jpg';
import pageCoverImage from './assets/z7702200089031_9744637952ef32b5d59114e2200cb6c8.jpg';
import UiIcon from './components/icons/UiIcon';
import CaseStudyPanel from './components/panels/CaseStudyPanel';
import AccountPanel from './components/panels/AccountPanel';
import AuthPanel from './components/panels/AuthPanel';
import ControlPanel from './components/panels/ControlPanel';
import AdminPanel from './components/panels/AdminPanel';
import OverviewPanel from './components/panels/OverviewPanel';
import OrderDepositPanel from './components/panels/OrderDepositPanel';
import PlatformsPanel from './components/panels/PlatformsPanel';
import SearchResultsPanel from './components/panels/SearchResultsPanel';
import ServiceDetailPanel from './components/panels/ServiceDetailPanel';
import ServicesPanel, { ServiceCatalogBadge, ServiceCatalogOtherIcon } from './components/panels/ServicesPanel';
import {
  homeSummary,
  contactSupportLinks,
  otherFunctionLinks,
  serviceCatalogSections,
  sidebarUserLinks,
  tabs,
  themeStorageKey,
} from './data/appData';
import { getSearchResults } from './utils/search';
import { apiRequest, getAuthToken, setAuthToken } from './services/api';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
}

function getAuthModeFromPath(pathname = '') {
  const normalizedPath = pathname.toLowerCase();
  if (normalizedPath === '/login') return 'login';
  if (normalizedPath === '/register') return 'register';
  if (normalizedPath === '/adminlogin') return 'admin';
  return '';
}

function getInitialAuthRouteState() {
  if (typeof window === 'undefined') {
    return { activeTab: 'services', authMode: 'login' };
  }

  const routeAuthMode = getAuthModeFromPath(window.location.pathname);
  if (routeAuthMode) {
    return { activeTab: 'auth', authMode: routeAuthMode };
  }

  return { activeTab: 'services', authMode: 'login' };
}

function App() {
  const initialAuthRouteState = getInitialAuthRouteState();
  const [activeTab, setActiveTab] = useState(initialAuthRouteState.activeTab);
  const [authMode, setAuthMode] = useState(initialAuthRouteState.authMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedResultId, setHighlightedResultId] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isContactsMenuOpen, setIsContactsMenuOpen] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [pendingOrderDraft, setPendingOrderDraft] = useState(null);
  const settingsMenuRef = useRef(null);
  const contactsMenuRef = useRef(null);

  const trimmedSearchQuery = searchQuery.trim();
  const searchResults = trimmedSearchQuery ? getSearchResults(trimmedSearchQuery) : [];
  const activeMeta = tabs.find((tab) => tab.id === activeTab) ?? {
    eyebrow: 'Authentication',
    title: 'Đăng nhập / đăng ký',
    stats: [
      { label: 'Chế độ', value: authMode === 'admin' ? 'Admin login' : authMode === 'register' ? 'Đăng ký' : 'Đăng nhập' },
      { label: 'Endpoint', value: authMode === 'admin' ? '/adminlogin' : authMode === 'register' ? '/register' : '/login' },
      { label: 'Trạng thái', value: 'Ready' },
    ],
  };
  const sidebarTabs = tabs.filter((tab) => tab.id !== 'services');
  const isDarkTheme = theme === 'dark';

  function updateAuthPath(mode, replace = false) {
    if (typeof window === 'undefined') return;

    const nextPath = mode === 'register' ? '/register' : mode === 'admin' ? '/adminlogin' : '/login';
    if (window.location.pathname === nextPath) return;

    if (replace) {
      window.history.replaceState({}, '', nextPath);
    } else {
      window.history.pushState({}, '', nextPath);
    }
  }

  function clearAuthPath() {
    if (typeof window === 'undefined') return;
    if (!getAuthModeFromPath(window.location.pathname)) return;
    window.history.replaceState({}, '', '/');
  }

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    async function restoreSession() {
      const token = getAuthToken();
      if (!token) return;

      try {
        const profile = await apiRequest('/api/auth/me', { token });
        setAuthUser({ ...profile, token });
      } catch {
        setAuthToken('');
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setIsSettingsMenuOpen(false);
      }
      if (contactsMenuRef.current && !contactsMenuRef.current.contains(event.target)) {
        setIsContactsMenuOpen(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        setIsSettingsMenuOpen(false);
        setIsContactsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    function handlePopState() {
      const routeAuthMode = getAuthModeFromPath(window.location.pathname);
      if (!routeAuthMode) return;

      setAuthMode(routeAuthMode);
      setActiveTab('auth');
      setSearchQuery('');
      setHighlightedResultId('');
    }

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  function handleTabChange(tabId) {
    if (tabId === 'admin' && !authUser) {
      openAuthScreen('admin');
      return;
    }

    clearAuthPath();
    setActiveTab(tabId);
    setSearchQuery('');
    setHighlightedResultId('');
  }

  function handleAuthModeChange(mode = 'login') {
    setAuthMode(mode);
    setActiveTab('auth');
    setSearchQuery('');
    setHighlightedResultId('');
    setIsSettingsMenuOpen(false);
    updateAuthPath(mode);
  }

  function openAuthScreen(mode = 'login') {
    handleAuthModeChange(mode);
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
    setHighlightedResultId('');
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (searchResults.length > 0) {
      handleOpenResult(searchResults[0]);
    }
  }

  function handleClearSearch() {
    setSearchQuery('');
    setHighlightedResultId('');
  }

  function handleNotificationsClick() {
    return null;
  }

  function handleThemeToggle() {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  function handleSettingsMenuToggle() {
    setIsSettingsMenuOpen((currentState) => !currentState);
  }

  function handleSettingsAction(action) {
    const comingSoonActions = new Set(['affiliate', 'transaction-history', 'change-password']);

    if (comingSoonActions.has(action)) {
      setSearchQuery('');
      setHighlightedResultId('');
      setIsSettingsMenuOpen(false);
      return;
    }

    if (action === 'account-info') {
      if (authUser) setActiveTab('account');
      else openAuthScreen('login');
    }

    if (action === 'control-panel') {
      setActiveTab('control-panel');
    }

    if (action === 'top-up') {
      setActiveTab('payment');
      setPendingOrderDraft(null);
    }

    if (action === 'admin-panel') {
      if (authUser?.role === 'admin') setActiveTab('admin');
      else openAuthScreen('admin');
    }

    if (action === 'logout') {
      handleLogout();
    }

    setSearchQuery('');
    setHighlightedResultId('');
    setIsSettingsMenuOpen(false);
  }

  function handleSidebarServiceShortcut(sectionId) {
    setActiveTab('services');
    setSearchQuery('');
    setHighlightedResultId(sectionId);
    setIsSettingsMenuOpen(false);
  }

  function handleOpenResult(result) {
    clearAuthPath();
    setActiveTab(result.tabId);
    setSearchQuery('');
    setHighlightedResultId(result.highlightId ?? '');
  }

  function handleSelectServiceItem(itemId, sectionId) {
    clearAuthPath();
    setSelectedServiceItem({ itemId, sectionId });
    setActiveTab('service-detail');
    setSearchQuery('');
    setHighlightedResultId('');
  }

  function handleNavigateToPayment(orderDraft = null) {
    clearAuthPath();
    setPendingOrderDraft(orderDraft);
    setActiveTab('payment');
    setSelectedServiceItem(null);
  }

  function handleBackToServices(sectionId = '') {
    clearAuthPath();
    setActiveTab('services');
    if (sectionId) {
      setHighlightedResultId(sectionId);
    }
    setSelectedServiceItem(null);
  }

  function handleAuthChange(nextUser) {
    setAuthUser(nextUser);
    if (nextUser?.token) {
      clearAuthPath();
      setAuthToken(nextUser.token);
      if (authMode === 'admin' && nextUser.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('account');
      }
    }
  }

  function handleLogout() {
    clearAuthPath();
    setAuthUser(null);
    setAuthToken('');
    setPendingOrderDraft(null);
    setActiveTab('overview');
  }

  return (
    <div className="page-shell" style={{ '--page-cover-image': `url(${pageCoverImage})` }}>
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

          <div className="sidebar-scroll">
            <nav className="sidebar-nav" aria-label="Sidebar navigation">
              {sidebarTabs.map((item) => (
                <button
                  type="button"
                  className={`sidebar-item ${activeTab === item.id ? 'is-active' : ''}`}
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                >
                  <span className="sidebar-item__icon">
                    <UiIcon type={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <section className="sidebar-section">
              <p className="sidebar-section__title">User Function</p>
              <div className="sidebar-service-list">
                {sidebarUserLinks.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="sidebar-item sidebar-item--ghost"
                    onClick={() => handleSettingsAction(item.action)}
                  >
                    <span className="sidebar-item__icon">
                      <UiIcon type={item.icon} />
                    </span>
                    <span className="sidebar-item__meta">
                      <span>{item.label}</span>
                      {item.comingSoon ? <small>COMING SOON. CODER đang code</small> : null}
                    </span>
                    {item.badge ? <span className="sidebar-item__badge">{item.badge}</span> : null}
                    <span className="sidebar-item__chevron"></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="sidebar-section">
              <p className="sidebar-section__title">Extra Function</p>
              <div className="sidebar-service-list">
                {serviceCatalogSections.map((section) => (
                  <button
                    type="button"
                    key={section.id}
                    className={`sidebar-item sidebar-item--ghost ${activeTab === 'services' && highlightedResultId === section.id ? 'is-active' : ''}`}
                    onClick={() => handleSidebarServiceShortcut(section.id)}
                  >
                    <ServiceCatalogBadge section={section} size="md" />
                    <span>{section.label}</span>
                    <span className="sidebar-item__chevron"></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="sidebar-section sidebar-section--tail">
              <p className="sidebar-section__title">Other Function</p>
              <div className="sidebar-service-list">
                {otherFunctionLinks.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="sidebar-item sidebar-item--ghost"
                    onClick={() => setIsSettingsMenuOpen(false)}
                  >
                    <ServiceCatalogOtherIcon item={item} />
                    <span>{item.label}</span>
                    <span className="sidebar-item__chevron"></span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        <section className="workspace">
          <header className="workspace-header">
            <div className="workspace-header__title">
              <p className="eyebrow">{activeMeta.eyebrow}</p>
              <h1>{activeMeta.title}</h1>
            </div>

            <div className="workspace-header__actions">
              <form className="search-box" onSubmit={handleSearchSubmit}>
                <UiIcon type="search" />
                <input
                  type="search"
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm nhanh..."
                  aria-label="Tìm kiếm nhanh trong dashboard"
                />
                {trimmedSearchQuery ? (
                  <button type="button" className="search-clear" onClick={handleClearSearch} aria-label="Xóa từ khóa tìm kiếm">
                    Xóa
                  </button>
                ) : null}
              </form>
              <button
                type="button"
                className="icon-button"
                onClick={handleNotificationsClick}
                aria-label="Thông báo tạm thời chưa có nội dung"
                title="Thông báo"
              >
                <UiIcon type="bell" />
              </button>

              {!authUser ? (
                <div className="header-auth-group">
                  <button type="button" className="header-auth-btn" onClick={() => openAuthScreen('login')}>Đăng nhập</button>
                  <button type="button" className="header-auth-btn" onClick={() => openAuthScreen('register')}>Đăng ký</button>
                </div>
              ) : null}

              {authUser ? (
                <div className="contacts-menu" ref={contactsMenuRef}>
                <button
                  type="button"
                  className={`icon-button ${isContactsMenuOpen ? 'is-active' : ''}`}
                  onClick={() => setIsContactsMenuOpen((state) => !state)}
                  aria-label="Mở liên hệ hỗ trợ"
                  aria-expanded={isContactsMenuOpen}
                  aria-haspopup="menu"
                  title="Liên hệ hỗ trợ"
                >
                  <span style={{ fontSize: '1.2em' }}>💬</span>
                </button>

                {isContactsMenuOpen ? (
                  <div className="contacts-dropdown" role="menu" aria-label="Liên hệ hỗ trợ">
                    {contactSupportLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="contacts-dropdown__item"
                        role="menuitem"
                        onClick={() => setIsContactsMenuOpen(false)}
                      >
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                ) : null}
                </div>
              ) : null}

              {authUser ? (
                <div className="settings-menu" ref={settingsMenuRef}>
                <button
                  type="button"
                  className={`icon-button ${isSettingsMenuOpen ? 'is-active' : ''}`}
                  onClick={handleSettingsMenuToggle}
                  aria-label="Mở cài đặt tài khoản"
                  aria-expanded={isSettingsMenuOpen}
                  aria-haspopup="menu"
                  title="Cài đặt"
                >
                  <UiIcon type="settings" />
                </button>

                {isSettingsMenuOpen ? (
                  <div className="settings-dropdown" role="menu" aria-label="Cài đặt tài khoản">
                    <button type="button" className="settings-dropdown__item is-active" onClick={() => handleSettingsAction('account-info')} role="menuitem">
                      <span className="settings-dropdown__item-icon"><UiIcon type="account" /></span>
                      <span>Thông tin tài khoản</span>
                    </button>

                    <button type="button" className="settings-dropdown__item" onClick={() => handleSettingsAction('top-up')} role="menuitem">
                      <span className="settings-dropdown__item-icon"><UiIcon type="wallet" /></span>
                      <span>Nạp tiền tài khoản</span>
                    </button>

                    <button type="button" className="settings-dropdown__item" onClick={() => handleSettingsAction('transaction-history')} role="menuitem">
                      <span className="settings-dropdown__item-icon"><UiIcon type="history" /></span>
                      <span>Lịch sử giao dịch</span>
                      <span className="settings-dropdown__tag">COMING SOON</span>
                    </button>

                    <button type="button" className="settings-dropdown__item" onClick={() => handleSettingsAction('change-password')} role="menuitem">
                      <span className="settings-dropdown__item-icon"><UiIcon type="lock" /></span>
                      <span>Thay đổi mật khẩu</span>
                      <span className="settings-dropdown__tag">COMING SOON</span>
                    </button>

                    <button
                      type="button"
                      className="settings-dropdown__item settings-dropdown__item--toggle"
                      onClick={handleThemeToggle}
                      role="menuitemcheckbox"
                      aria-checked={isDarkTheme}
                    >
                      <span className="settings-dropdown__item-icon"><UiIcon type="moon" /></span>
                      <span>Giao diện tối</span>
                      <span className={`settings-theme-switch ${isDarkTheme ? 'is-on' : ''}`} aria-hidden="true">
                        <span className="settings-theme-switch__thumb" />
                      </span>
                    </button>

                    <div className="settings-dropdown__divider" />

                    <button type="button" className="settings-dropdown__item" onClick={() => handleSettingsAction('logout')} role="menuitem">
                      <span className="settings-dropdown__item-icon"><UiIcon type="logout" /></span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : null}
                </div>
              ) : null}

              {authUser ? <span className="profile-badge">Online</span> : null}
            </div>
          </header>

          {activeTab !== 'auth' ? (
            <section className="status-grid">
              {activeMeta.stats.map((card) => (
                <article className="status-card" key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                </article>
              ))}
            </section>
          ) : null}

          <section className="workspace-body">
            {trimmedSearchQuery ? (
              <SearchResultsPanel query={trimmedSearchQuery} results={searchResults} onOpenResult={handleOpenResult} />
            ) : null}
            {!trimmedSearchQuery && activeTab === 'overview' && <OverviewPanel highlightedId={highlightedResultId} />}
            {!trimmedSearchQuery && activeTab === 'services' && <ServicesPanel highlightedId={highlightedResultId} onSelectServiceItem={handleSelectServiceItem} />}
            {!trimmedSearchQuery && activeTab === 'service-detail' && selectedServiceItem && <ServiceDetailPanel selectedServiceItem={selectedServiceItem} onNavigateToPayment={handleNavigateToPayment} onBack={() => handleBackToServices(selectedServiceItem.sectionId)} />}
            {!trimmedSearchQuery && activeTab === 'platforms' && <PlatformsPanel highlightedId={highlightedResultId} />}
            {!trimmedSearchQuery && activeTab === 'case-study' && <CaseStudyPanel highlightedId={highlightedResultId} />}
            {!trimmedSearchQuery && activeTab === 'control-panel' && <ControlPanel authUser={authUser} onNavigate={setActiveTab} />}
            {!trimmedSearchQuery && activeTab === 'payment' && <OrderDepositPanel authUser={authUser} orderDraft={pendingOrderDraft} onClearDraft={() => setPendingOrderDraft(null)} />}
            {!trimmedSearchQuery && activeTab === 'auth' && <AuthPanel mode={authMode} onModeChange={handleAuthModeChange} onAuthChange={handleAuthChange} />}
            {!trimmedSearchQuery && activeTab === 'account' && <AccountPanel authUser={authUser} onLogout={handleLogout} />}
            {!trimmedSearchQuery && activeTab === 'admin' && <AdminPanel authUser={authUser} />}
          </section>
        </section>
      </main>

      <div className="floating-contact-actions" aria-label="Li�n h? nhanh">
        <a
          className="floating-contact floating-contact--zalo"
          href={homeSummary.contactHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Li�n h? Zalo"
          title="Li�n h? Zalo"
        >
          <span>Zalo</span>
        </a>

        <a
          className="floating-contact floating-contact--messenger"
          href="https://www.facebook.com/tu.ma.huy.540893"
          target="_blank"
          rel="noreferrer"
          aria-label="Li�n h? Messenger/Facebook"
          title="Li�n h? Messenger/Facebook"
        >
          <FaFacebookMessenger />
        </a>
      </div>

      <footer className="site-footer"> 2026 tuhuybusiness.vercel.app</footer>
    </div>
  );
}

export default App;
