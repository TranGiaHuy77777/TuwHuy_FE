import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';

function AdminPanel({ authUser }) {
  const [summary, setSummary] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [partnerOrders, setPartnerOrders] = useState([]);
  const [partnerStatus, setPartnerStatus] = useState('');
  const [partnerPage, setPartnerPage] = useState('1');
  const [partnerLimit, setPartnerLimit] = useState('10');
  const [partnerForm, setPartnerForm] = useState({
    object_id: '',
    quantity: '50',
    server_id: '',
    provider: 'facebook',
    service_slug: 'like-post',
  });
  const [partnerSubmitLoading, setPartnerSubmitLoading] = useState(false);
  const [partnerMessage, setPartnerMessage] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [partnerLastResponse, setPartnerLastResponse] = useState(null);
  const [webhookEvents, setWebhookEvents] = useState([]);
  const [webhookStatusFilter, setWebhookStatusFilter] = useState('all');
  const [expandedWebhookId, setExpandedWebhookId] = useState(null);
  const [message, setMessage] = useState('');

  const statusOptions = ['all', 'running', 'pending', 'completed', 'refunded', 'success', 'pending_verify'];
  const webhookStatusOptions = ['all', 'matched', 'unmatched', 'duplicate', 'invalid', 'unauthorized', 'error'];

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

  async function loadPartnerOrders() {
    if (!authUser?.token) return;

    try {
      const query = new URLSearchParams();
      if (partnerStatus && partnerStatus !== 'all') query.set('status', partnerStatus);
      if (partnerPage) query.set('page', partnerPage);
      if (partnerLimit) query.set('limit', partnerLimit);

      const result = await apiRequest(`/api/admin/partner/orders${query.toString() ? `?${query.toString()}` : ''}`, {
        token: authUser.token,
      });

      const rows = Array.isArray(result) ? result : result?.orders || result?.data?.orders || [];
      setPartnerOrders(rows);
      setPartnerLastResponse(result);
      setPartnerMessage('');
    } catch (error) {
      setPartnerMessage(error.message);
    }
  }

  async function loadWebhookEvents() {
    if (!authUser?.token) return;

    try {
      const query = new URLSearchParams();
      if (webhookStatusFilter && webhookStatusFilter !== 'all') query.set('status', webhookStatusFilter);
      query.set('limit', '80');

      const rows = await apiRequest(`/api/deposits/admin/bank-webhook-events?${query.toString()}`, {
        token: authUser.token,
      });
      setWebhookEvents(Array.isArray(rows) ? rows : []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [authUser?.token]);

  useEffect(() => {
    loadPartnerOrders();
  }, [authUser?.token, partnerStatus, partnerPage, partnerLimit]);

  useEffect(() => {
    loadWebhookEvents();
  }, [authUser?.token, webhookStatusFilter]);

  async function handleApprove(id) {
    await apiRequest(`/api/deposits/admin/${id}/approve`, { method: 'PATCH', token: authUser.token });
    await loadData();
  }

  async function handleReject(id) {
    await apiRequest(`/api/deposits/admin/${id}/reject`, { method: 'PATCH', token: authUser.token });
    await loadData();
  }

  async function handlePartnerServiceCreate(event) {
    event.preventDefault();
    setPartnerSubmitLoading(true);
    setPartnerMessage('');

    try {
      const result = await apiRequest('/api/admin/partner/service/create', {
        method: 'POST',
        token: authUser.token,
        body: JSON.stringify({
          ...partnerForm,
          quantity: Number(partnerForm.quantity),
        }),
      });

      setPartnerMessage(result?.message || 'Khởi tạo dịch vụ thành công');
      await loadPartnerOrders();
    } catch (error) {
      setPartnerMessage(error.message);
    } finally {
      setPartnerSubmitLoading(false);
    }
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
      {partnerMessage ? <div className="pricing-notice-box">{partnerMessage}</div> : null}

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

        <div className="comment-boost-field">
          <p className="package-option-label">Partner API - Tạo dịch vụ</p>
          <form className="comment-boost-card" onSubmit={handlePartnerServiceCreate}>
            <div className="comment-boost-field">
              <label className="package-option-label">Object ID / Link</label>
              <input
                className="quantity-input"
                value={partnerForm.object_id}
                onChange={(event) => setPartnerForm((current) => ({ ...current, object_id: event.target.value }))}
                placeholder="644196367075820"
              />
            </div>

            <div className="comment-boost-field">
              <label className="package-option-label">Số lượng</label>
              <input
                className="quantity-input"
                type="number"
                value={partnerForm.quantity}
                onChange={(event) => setPartnerForm((current) => ({ ...current, quantity: event.target.value }))}
              />
            </div>

            <div className="comment-boost-field">
              <label className="package-option-label">Server ID</label>
              <input
                className="quantity-input"
                value={partnerForm.server_id}
                onChange={(event) => setPartnerForm((current) => ({ ...current, server_id: event.target.value }))}
                placeholder="sv3"
              />
            </div>

            <div className="comment-boost-field">
              <label className="package-option-label">Provider</label>
              <input
                className="quantity-input"
                value={partnerForm.provider}
                onChange={(event) => setPartnerForm((current) => ({ ...current, provider: event.target.value }))}
                placeholder="facebook"
              />
            </div>

            <div className="comment-boost-field">
              <label className="package-option-label">Service slug</label>
              <input
                className="quantity-input"
                value={partnerForm.service_slug}
                onChange={(event) => setPartnerForm((current) => ({ ...current, service_slug: event.target.value }))}
                placeholder="like-post"
              />
            </div>

            <button className="package-submit-btn" type="submit" disabled={partnerSubmitLoading}>
              {partnerSubmitLoading ? 'Đang tạo...' : 'Tạo dịch vụ partner'}
            </button>
          </form>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Ngân hàng webhook - Nhật ký auto nhận tiền</p>

          <div className="service-policy-note" style={{ marginBottom: '12px' }}>
            <div className="comment-boost-field" style={{ marginBottom: '0' }}>
              <label className="package-option-label">Lọc trạng thái</label>
              <select
                className="quantity-input"
                value={webhookStatusFilter}
                onChange={(event) => setWebhookStatusFilter(event.target.value)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                {webhookStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="comment-server-list">
            {webhookEvents.map((event) => (
              <div
                key={event._id}
                className="comment-server-item"
                style={{ cursor: 'pointer', backgroundColor: expandedWebhookId === event._id ? 'rgba(33, 150, 243, 0.1)' : 'transparent' }}
                onClick={() => setExpandedWebhookId(expandedWebhookId === event._id ? null : event._id)}
              >
                <span className="comment-server-name">
                  {new Date(event.createdAt).toLocaleString('vi-VN')} • {Number(event.amount || 0).toLocaleString('vi-VN')}đ
                </span>
                <span className="comment-server-note">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        event.status === 'matched'
                          ? 'rgba(76, 175, 80, 0.3)'
                          : event.status === 'unmatched'
                            ? 'rgba(255, 152, 0, 0.3)'
                            : event.status === 'duplicate'
                              ? 'rgba(33, 150, 243, 0.3)'
                              : 'rgba(244, 67, 54, 0.3)',
                      marginRight: '8px',
                    }}
                  >
                    {event.status}
                  </span>
                  {event.txRef || 'no-txref'}
                </span>
                <span className="comment-server-note">{event.description || event.note}</span>

                {expandedWebhookId === event._id ? (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                      {JSON.stringify(event, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>
            ))}

            {webhookEvents.length === 0 ? (
              <div className="comment-server-item">
                <span className="comment-server-name">Chưa có log webhook</span>
                <span className="comment-server-note">Hệ thống sẽ hiển thị tại đây khi có giao dịch vào.</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="comment-boost-field">
          <p className="package-option-label">Partner API - Danh sách đơn</p>
          <div className="service-policy-note" style={{ marginBottom: '12px' }}>
            <div className="comment-boost-field" style={{ marginBottom: '0' }}>
              <label className="package-option-label">Trạng thái lọc</label>
              <select
                className="quantity-input"
                value={partnerStatus}
                onChange={(event) => setPartnerStatus(event.target.value)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'Tất cả' : status}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              <div className="comment-boost-field" style={{ marginBottom: '0' }}>
                <label className="package-option-label">Page</label>
                <input className="quantity-input" type="number" value={partnerPage} onChange={(event) => setPartnerPage(event.target.value)} />
              </div>
              <div className="comment-boost-field" style={{ marginBottom: '0' }}>
                <label className="package-option-label">Limit</label>
                <input className="quantity-input" type="number" value={partnerLimit} onChange={(event) => setPartnerLimit(event.target.value)} />
              </div>
            </div>
          </div>

          {partnerLastResponse ? (
            <div className="service-policy-note" style={{ marginBottom: '12px', maxHeight: '200px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>API Response:</div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {JSON.stringify(partnerLastResponse, null, 2)}
              </pre>
            </div>
          ) : null}

          <div className="comment-server-list">
            {partnerOrders.map((order) => (
              <div key={order.id || order.order_code} className="comment-server-item" style={{ cursor: 'pointer', backgroundColor: expandedOrderId === (order.id || order.order_code) ? 'rgba(33, 150, 243, 0.1)' : 'transparent' }} onClick={() => setExpandedOrderId(expandedOrderId === (order.id || order.order_code) ? null : (order.id || order.order_code))}>
                <span className="comment-server-name">
                  #{order.order_code || order.id} • {order.server_name || order.service_slug}
                </span>
                <span className="comment-server-note">
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', backgroundColor: order.status === 'completed' || order.status === 'success' ? 'rgba(76, 175, 80, 0.3)' : order.status === 'running' ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 152, 0, 0.3)', marginRight: '8px' }}>
                    {order.status}
                  </span>
                  {Number(order.payment || 0).toLocaleString('vi-VN')}đ • SL {order.quantity}
                </span>
                {expandedOrderId === (order.id || order.order_code) ? (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                      {JSON.stringify(order, null, 2)}
                    </pre>
                  </div>
                ) : null}
                <span className="comment-server-note">{order.object_id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
