import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import paymentQrImage from '../../assets/payment-qr.jpg';
import { paymentInfo } from '../../data/appData';

function OrderDepositPanel({ authUser, orderDraft, onClearDraft }) {
  const defaultTransferContent = authUser?.depositCode ? `NAP ${authUser.depositCode}` : paymentInfo.transferContent;
  const [qrSrc, setQrSrc] = useState(paymentQrImage);
  const [qrFallbackTried, setQrFallbackTried] = useState(false);
  const [quote, setQuote] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [transferContent, setTransferContent] = useState(defaultTransferContent);
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadQuote() {
      if (!authUser?.token || !orderDraft?.itemId) return;
      try {
        const result = await apiRequest('/api/orders/quote', {
          method: 'POST',
          token: authUser.token,
          body: JSON.stringify({
            itemId: orderDraft.itemId,
            packageId: orderDraft.packageId,
            quantity: orderDraft.quantity,
          }),
        });
        setQuote(result);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadQuote();
  }, [authUser?.token, orderDraft]);

  useEffect(() => {
    setTransferContent(defaultTransferContent);
  }, [defaultTransferContent]);

  async function handleCreateOrder() {
    setLoading(true);
    setMessage('');
    try {
      const result = await apiRequest('/api/orders/create', {
        method: 'POST',
        token: authUser.token,
        body: JSON.stringify(orderDraft),
      });
      setMessage(`Tạo đơn thành công. Số dư còn lại: ${result.balance.toLocaleString('vi-VN')}đ`);
      onClearDraft?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDeposit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiRequest('/api/deposits/create', {
        method: 'POST',
        token: authUser?.token,
        body: JSON.stringify({
          amount: Number(depositAmount),
          transferContent,
          proofImageUrl,
        }),
      });
      setMessage('Đã gửi yêu cầu nạp tiền, chờ admin duyệt.');
      setDepositAmount('');
      setTransferContent(defaultTransferContent);
      setProofImageUrl('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`Đã copy ${label}`);
    } catch (error) {
      setCopyMessage('Không thể copy tự động. Bạn vui lòng copy thủ công.');
    }

    window.setTimeout(() => {
      setCopyMessage('');
    }, 1800);
  }

  return (
    <section className="panel-screen payment-panel">
      <div className="panel-heading">
        <p className="panel-label">Nạp tiền / tạo đơn</p>
        <h2>Quét mã QR để nạp hoặc tạo đơn trực tiếp bằng số dư ví</h2>
      </div>

      {orderDraft ? (
        <div className="service-policy-note" style={{ marginBottom: '20px' }}>
          <p><strong>Đơn nháp:</strong> {orderDraft.itemId}</p>
          <p><strong>Số lượng:</strong> {orderDraft.quantity}</p>
          <p><strong>Link/ID:</strong> {orderDraft.targetLink}</p>
          {quote ? <p><strong>Giá thanh toán:</strong> {quote.sellTotal.toLocaleString('vi-VN')}đ</p> : null}
          <button className="package-submit-btn" type="button" onClick={handleCreateOrder} disabled={loading || !authUser?.token}>
            {loading ? 'Đang tạo đơn...' : 'Tạo đơn ngay'}
          </button>
        </div>
      ) : null}

      {message ? <div className="pricing-notice-box" style={{ marginBottom: '20px' }}>{message}</div> : null}

      <div className="payment-grid">
        <article className="payment-card payment-card--info">
          <span className="payment-badge">QR Payment</span>
          <h3>{'Nạp tiền vào tài khoản'}</h3>
          <p className="payment-description">Sau khi chuyển khoản, tạo yêu cầu nạp bên dưới để admin duyệt cộng ví.</p>

          <form className="comment-boost-card" onSubmit={handleCreateDeposit}>
            <div className="comment-boost-field">
              <label className="package-option-label">Số tiền nạp</label>
              <input className="quantity-input" type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            </div>
            <div className="comment-boost-field">
              <label className="package-option-label">Nội dung chuyển khoản</label>
              <input
                className="quantity-input"
                value={transferContent}
                onChange={(e) => setTransferContent(e.target.value)}
                placeholder={defaultTransferContent}
              />
            </div>
            <div className="comment-boost-field">
              <label className="package-option-label">Link ảnh bill</label>
              <input className="quantity-input" value={proofImageUrl} onChange={(e) => setProofImageUrl(e.target.value)} />
            </div>
            <button className="package-submit-btn" type="submit" disabled={loading || !authUser?.token}>Gửi yêu cầu nạp</button>
          </form>
        </article>

        <article className="payment-card payment-card--qr">
          <div className="payment-qr-frame">
            {qrSrc ? (
              <img
                className="payment-qr-image"
                src={qrSrc}
                alt={`Mã QR chuyển khoản ${paymentInfo.bank}`}
                onError={() => {
                  if (!qrFallbackTried) {
                    setQrFallbackTried(true);
                    setQrSrc('/payment-qr.jpg');
                    return;
                  }
                  setQrSrc('');
                }}
              />
            ) : (
              <p className="quantity-note">Không tải được mã QR. Vui lòng kiểm tra lại file ảnh.</p>
            )}
          </div>

          <div className="payment-qr-caption">
            <p><strong>Chủ tài khoản:</strong> {paymentInfo.accountName}</p>
            <p><strong>Số tài khoản:</strong> [{paymentInfo.accountNumber}]</p>
            <p><strong>Ngân hàng:</strong> [{paymentInfo.bank}]</p>
            <p><strong>Nội dung chuyển khoản:</strong> {defaultTransferContent}</p>
            <p><strong>Mã nạp của bạn:</strong> {authUser?.depositCode || 'Chưa có mã'}</p>

            <div className="payment-copy-actions">
              <button
                type="button"
                className="payment-copy-btn"
                onClick={() => handleCopy(paymentInfo.accountNumber, 'số tài khoản')}
              >
                Copy số tài khoản
              </button>
              <button
                type="button"
                className="payment-copy-btn"
                onClick={() => handleCopy(defaultTransferContent, 'nội dung chuyển khoản')}
              >
                Copy nội dung CK
              </button>
            </div>
            {copyMessage ? <p className="payment-copy-note">{copyMessage}</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

export default OrderDepositPanel;
