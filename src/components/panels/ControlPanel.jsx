import { useState } from 'react';
import { apiRequest } from '../../services/api';
import { controlPanelActions } from '../../data/appData';

function ControlPanel({ authUser, onNavigate }) {
  const [giftCode, setGiftCode] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleGiftCodeSubmit(event) {
    event.preventDefault();
    if (!giftCode.trim()) {
      setMessage('Vui lòng nhập gift code.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await apiRequest('/api/giftcode/apply', {
        method: 'POST',
        body: JSON.stringify({ code: giftCode }),
        token: authUser?.token,
      });

      setMessage(`✓ ${result.message}`);
      setGiftCode('');
      
      // Trigger a callback to update wallet balance if needed
      if (onNavigate && result.newBalance !== undefined) {
        // You can add a callback here to update the authUser balance
      }
    } catch (error) {
      setMessage(`✗ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="panel-screen control-panel">
      <div className="panel-heading">
        <p className="panel-label">Control panel</p>
        <h2>Bảng điều khiển nhanh cho dịch vụ và đơn hàng</h2>
        <p className="service-detail-subtitle">Giao diện gom các lối vào chính giống cấu trúc trang gốc.</p>
      </div>

      <div className="control-panel-banner">
        <div>
          <span className="control-panel-banner__eyebrow">Current Balance</span>
          <strong>{Number(authUser?.walletBalance || 0).toLocaleString('vi-VN')} VND</strong>
        </div>
        <div>
          <span className="control-panel-banner__eyebrow">Monthly total deposit</span>
          <strong>0 VND</strong>
        </div>
        <div>
          <span className="control-panel-banner__eyebrow">Level</span>
          <strong>{authUser?.role || 'Member'}</strong>
        </div>
      </div>

      <div className="control-panel-grid">
        {controlPanelActions.map((item) => (
          <article className="control-action-card" key={item.id}>
            <p className="control-action-card__title">{item.title}</p>
            <p className="control-action-card__description">{item.description}</p>
            <button type="button" className="package-submit-btn" onClick={() => onNavigate?.(item.action)}>
              Open
            </button>
          </article>
        ))}
      </div>

      <div className="control-panel-grid control-panel-grid--split">
        <article className="control-action-card control-action-card--wide">
          <p className="control-action-card__title">Service price list</p>
          <p className="control-action-card__description">
            Chọn tab dịch vụ để xem catalog theo nền tảng Facebook, Instagram, TikTok, YouTube, Google và Shopee.
          </p>
          <button type="button" className="package-submit-btn" onClick={() => onNavigate?.('services')}>
            View services
          </button>
        </article>

        <article className="control-action-card control-action-card--wide">
          <p className="control-action-card__title">Enter gift code</p>
          <form className="control-gift-form" onSubmit={handleGiftCodeSubmit}>
            <input
              className="quantity-input"
              value={giftCode}
              onChange={(event) => setGiftCode(event.target.value)}
              placeholder="Nhập gift code"
              disabled={isLoading}
            />
            <button type="submit" className="package-submit-btn" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Apply code'}
            </button>
          </form>
          {message ? <p className="quantity-note" style={{ color: message.startsWith('✓') ? '#4CAF50' : '#FF5252' }}>{message}</p> : null}
        </article>
      </div>
    </section>
  );
}

export default ControlPanel;