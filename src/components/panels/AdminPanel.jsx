import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

function AdminPanel({ authUser }) {
  const [summary, setSummary] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  async function loadData() {
    if (!authUser?.token) return;
    try {
      const [summaryData, depositData, orderData, userData] = await Promise.all([
        apiRequest('/api/admin/summary', { token: authUser.token }),
        apiRequest('/api/admin/deposits', { token: authUser.token }),
        apiRequest('/api/admin/orders', { token: authUser.token }),
        apiRequest('/api/admin/users', { token: authUser.token }),
      ]);
      setSummary(summaryData);
      setDeposits(depositData);
      setOrders(orderData);
      setUsers(userData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [authUser?.token]);

  async function handleApprove(id) {
    await apiRequest(`/api/deposits/admin/${id}/approve`, { method: 'PATCH', token: authUser.token });
    await loadData();
  }

  async function handleReject(id) {
    await apiRequest(`/api/deposits/admin/${id}/reject`, { method: 'PATCH', token: authUser.token });
    await loadData();
  }

  if (!authUser) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Quản trị</p>
          <h2>Vui lòng đăng nhập tài khoản admin</h2>
        </div>
      </section>
    );
  }

  if (authUser.role !== 'admin') {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Quản trị</p>
          <h2>Tài khoản hiện tại không có quyền admin</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-screen service-detail-panel">
      <div className="panel-heading">
        <p className="panel-label">Quản trị</p>
        <h2>Duyệt nạp tiền và theo dõi đơn</h2>
      </div>

      {summary ? (
        <div className="service-policy-note">
          <p><strong>Chờ duyệt nạp:</strong> {summary.pendingDeposits}</p>
          <p><strong>Tổng đơn:</strong> {summary.totalOrders}</p>
          <p><strong>Đơn chờ:</strong> {summary.pendingOrders}</p>
          <p><strong>Tổng user:</strong> {summary.totalUsers}</p>
        </div>
      ) : null}

      {message ? <div className="pricing-notice-box">{message}</div> : null}

      <div className="comment-boost-card">
        <div className="comment-boost-field">
          <p className="package-option-label">Nạp tiền chờ duyệt</p>
          <div className="comment-server-list">
            {deposits.map((deposit) => (
              <div key={deposit._id} className="comment-server-item">
                <span className="comment-server-name">{deposit.userId?.fullName || 'Unknown'} • {deposit.amount.toLocaleString('vi-VN')}đ</span>
                <span className="comment-server-note">{deposit.status}</span>
                {deposit.status === 'pending' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="package-submit-btn" type="button" onClick={() => handleApprove(deposit._id)}>Duyệt</button>
                    <button className="package-submit-btn" type="button" onClick={() => handleReject(deposit._id)}>Từ chối</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Theo dõi đơn</p>
          <div className="comment-server-list">
            {orders.map((order) => (
              <div key={order._id} className="comment-server-item">
                <span className="comment-server-name">{order.itemId} • {order.quantity}</span>
                <span className="comment-server-note">{order.status} • {order.sellTotal.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Danh sách user</p>
          <div className="comment-server-list">
            {users.map((user) => (
              <div key={user._id} className="comment-server-item">
                <span className="comment-server-name">{user.fullName} • {user.email}</span>
                <span className="comment-server-note">{user.role} • {user.walletBalance.toLocaleString('vi-VN')}đ</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
