import { useEffect, useState } from 'react';
import { apiRequest, setAuthToken } from '../../services/api';

function AccountPanel({ authUser, onLogout }) {
  const [wallet, setWallet] = useState({ balance: 0 });
  const [deposits, setDeposits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!authUser?.token) return;
      try {
        const [walletData, depositData, orderData] = await Promise.all([
          apiRequest('/api/wallet', { token: authUser.token }),
          apiRequest('/api/deposits/mine', { token: authUser.token }),
          apiRequest('/api/orders/mine', { token: authUser.token }),
        ]);
        setWallet(walletData);
        setDeposits(depositData);
        setOrders(orderData);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadProfile();
  }, [authUser?.token]);

  function handleLogout() {
    setAuthToken('');
    onLogout?.();
  }

  if (!authUser) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Tài khoản</p>
          <h2>Bạn chưa đăng nhập</h2>
        </div>

        <div className="comment-boost-card">
          <p className="quantity-note">Vui lòng Đăng nhậpppp / Đăng kí</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-screen service-detail-panel">
      <div className="panel-heading">
        <p className="panel-label">Tài khoản</p>
        <h2>Thông tin và ví của bạn</h2>
      </div>

      {message ? <div className="pricing-notice-box">{message}</div> : null}

      <div className="comment-boost-card">
        <div className="comment-boost-field">
          <p className="package-option-label">Hồ sơ</p>
          <div className="service-policy-note">
            <p><strong>Họ tên:</strong> {authUser.fullName}</p>
            <p><strong>Email:</strong> {authUser.email}</p>
            <p><strong>Vai trò:</strong> {authUser.role}</p>
            <p><strong>Mã nạp:</strong> {authUser.depositCode || 'Chưa có'}</p>
            <p><strong>Số dư:</strong> {wallet.balance?.toLocaleString('vi-VN') || 0}đ</p>
          </div>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Lịch sử nạp tiền</p>
          <div className="comment-server-list">
            {deposits.map((item) => (
              <div key={item._id} className="comment-server-item">
                <span className="comment-server-name">{item.amount.toLocaleString('vi-VN')}đ</span>
                <span className="comment-server-note">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Lịch sử đơn</p>
          <div className="comment-server-list">
            {orders.map((item) => (
              <div key={item._id} className="comment-server-item">
                <span className="comment-server-name">{item.itemId}</span>
                <span className="comment-server-note">{item.sellTotal.toLocaleString('vi-VN')}đ • {item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="package-submit-btn" type="button" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </section>
  );
}

export default AccountPanel;
