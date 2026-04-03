import { useState } from 'react';
import { apiRequest, setAuthToken } from '../../services/api';

function AuthPanel({ mode = 'login', onModeChange, onAuthChange }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isRegister = mode === 'register';
  const isAdminLogin = mode === 'admin';

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : isAdminLogin ? '/api/auth/adminlogin' : '/api/auth/login';
      const payload = isRegister ? { fullName, phone, email, password } : { email, password };
      const result = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        token: '',
      });

      if (isRegister) {
        setMessage('Tạo tài khoản thành công. Hãy đăng nhập.');
        onModeChange?.('login');
      } else {
        setAuthToken(result.token);
        const profile = result.user || (await apiRequest('/api/auth/me', { token: result.token }));
        onAuthChange?.({ ...profile, token: result.token });
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel-screen service-detail-panel auth-panel-shell">
      <div className="panel-heading">
        <p className="panel-label">Authenticationsss</p>
        <h2>{isRegister ? 'Đăng ký tài khoản' : isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập tài khoản'}</h2>
        <p className="auth-panel-lead">
          {isRegister
            ? 'Tạo tài khoản mới để sử dụng đầy đủ các chức năng trên hệ thống.'
            : isAdminLogin
              ? 'Đăng nhập quản trị để truy cập khu vực admin riêng.'
              : 'Đăng nhập để quản lý tài khoản, nạp tiền và theo dõi đơn hàng.'}
        </p>
      </div>

      <form className="comment-boost-card auth-panel-card" onSubmit={handleSubmit}>
        {isRegister ? (
          <div className="comment-boost-field">
            <label className="package-option-label">Họ tên</label>
            <input className="quantity-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
        ) : null}

        {isRegister ? (
          <div className="comment-boost-field">
            <label className="package-option-label">Số điện thoại</label>
            <input className="quantity-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
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

        <button className="package-submit-btn auth-submit-btn" type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
        </button>

        {message ? <p className="quantity-note">{message}</p> : null}
      </form>
    </section>
  );
}

export default AuthPanel;
