import { useEffect, useState } from 'react';
import { apiRequest, setAuthToken } from '../../services/api';

function AccountPanel({ authUser, onAuthChange, onLogout }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [wallet, setWallet] = useState({ balance: 0 });
  const [deposits, setDeposits] = useState([]);
  const [orders, setOrders] = useState([]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = mode === 'register' ? { fullName, email, password } : { email, password };
      const result = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        token: '',
      });

      if (mode === 'login') {
        setAuthToken(result.token);
        const profile = await apiRequest('/api/auth/me', { token: result.token });
        onAuthChange?.({ ...profile, token: result.token });
      } else {
        setMessage('Tạo tài khoản thành công. Hãy đăng nhập.');
        setMode('login');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setAuthToken('');
    onLogout?.();
  }

  return (
    <section className="panel-screen service-detail-panel">
      <div className="panel-heading">
        <p className="panel-label">Tài khoản</p>
        <h2>{authUser ? 'Thông tin và ví của bạn' : 'Đăng nhập / đăng ký'}</h2>
      </div>

      {!authUser ? (
        <form className="comment-boost-card" onSubmit={handleSubmit}>
          <div className="comment-boost-field">
            <label className="package-option-label">Chế độ</label>
            <div className="emotion-buttons">
              <button type="button" className="emotion-btn" onClick={() => setMode('login')}>Đăng nhập</button>
              <button type="button" className="emotion-btn" onClick={() => setMode('register')}>Đăng ký</button>
            </div>
          </div>

          {mode === 'register' ? (
            <div className="comment-boost-field">
              <label className="package-option-label">Họ tên</label>
              <input className="quantity-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          ) : null}

          <div className="comment-boost-field">
            <label className="package-option-label">Email</label>
            <input type="email" className="quantity-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Mật khẩu</label>
            <input type="password" className="quantity-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="package-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : mode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'}
          </button>

          {message ? <p className="quantity-note">{message}</p> : null}
        </form>
      ) : (
        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <p className="package-option-label">Hồ sơ</p>
            <div className="service-policy-note">
              <p><strong>Họ tên:</strong> {authUser.fullName}</p>
              <p><strong>Email:</strong> {authUser.email}</p>
              <p><strong>Vai trò:</strong> {authUser.role}</p>
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
      )}
    </section>
  );
}

export default AccountPanel;
