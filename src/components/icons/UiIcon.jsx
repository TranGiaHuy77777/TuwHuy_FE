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

  if (type === 'wallet') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.8 7H18.2C19.19 7 20 7.81 20 8.8V17.2C20 18.19 19.19 19 18.2 19H5.8C4.81 19 4 18.19 4 17.2V8.8C4 7.81 4.81 7 5.8 7Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M16 12.5H20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 7V5.8C7 4.81 7.81 4 8.8 4H17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="15.4" cy="12.5" r="1" fill="currentColor" />
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

  if (type === 'account') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M5 19C6.2 15.9 8.6 14.5 12 14.5C15.4 14.5 17.8 15.9 19 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'history') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 12A7.5 7.5 0 1 0 7 6.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 5.5V10H9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8V12L14.8 13.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'lock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 10V7.8C8 5.7 9.7 4 11.8 4H12.2C14.3 4 16 5.7 16 7.8V10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'moon') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.8 4.8A7.4 7.4 0 1 0 18.9 17.7A7.6 7.6 0 0 1 14.8 4.8Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === 'logout') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5H6.8C5.81 5 5 5.81 5 6.8V17.2C5 18.19 5.81 19 6.8 19H10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 8L17 12L13 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 12H17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

export default UiIcon;
