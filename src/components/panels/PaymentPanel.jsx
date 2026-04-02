import paymentQrImage from '../../assets/c615f654-61e1-437b-acd9-17e3543f83d8.jpg';
import { paymentInfo } from '../../data/appData';

function PaymentPanel() {
  return (
    <section className="panel-screen payment-panel">
      <div className="panel-heading">
        <p className="panel-label">Nạp tiền</p>
        <h2>Quét mã QR hoặc dùng đúng thông tin tài khoản bên dưới để chuyển khoản nhanh.</h2>
      </div>

      <div className="payment-grid">
        <article className="payment-card payment-card--info">
          <span className="payment-badge">QR Payment</span>
          <h3>{paymentInfo.qrTitle}</h3>
          <p className="payment-description">{paymentInfo.note}</p>

          <div className="payment-detail-list">
            <div className="payment-detail-item">
              <span>Ngân hàng</span>
              <strong>{paymentInfo.bank}</strong>
            </div>
            <div className="payment-detail-item">
              <span>Chủ tài khoản</span>
              <strong>{paymentInfo.accountName}</strong>
            </div>
            <div className="payment-detail-item">
              <span>Số tài khoản</span>
              <strong>{paymentInfo.accountNumber}</strong>
            </div>
          </div>

          <a className="payment-help-link" href={paymentInfo.helpHref} target="_blank" rel="noreferrer">
            {paymentInfo.helpText}
          </a>

          <div className="payment-warning-note">
            <p className="warning-title">⚠️ Lưu ý quan trọng:</p>
            <p className="warning-text">
              Vì hệ thống chưa hoạt động tự động được nên khi chuyển khoản xong chụp bill lại gửi qua mess hoặc zalo gửi admin. Nếu tự hoạt động bằng hệ thống vẫn phải có nhân viên để xử lý sự cố hệ thống cũng như giải quyết đơn cho khách nên cứ chuyển xong gửi bill cho admin nhé. Admin sẽ gửi mã đơn sau khi thấy bill.Nhớ ghi buff bao nhiêu, buff nền tảng gì, chức năng gì qua zalo/mess cho admin nhé . Chân thành cám ơn vì đã tin tưởng ủng hộ .
            </p>
          </div>
        </article>

        <article className="payment-card payment-card--qr">
          <div className="payment-qr-frame">
            <img className="payment-qr-image" src={paymentQrImage} alt={`Mã QR chuyển khoản ${paymentInfo.bank}`} />
          </div>

          <div className="payment-qr-caption">
            <p><strong>Chủ tài khoản:</strong> {paymentInfo.accountName}</p>
            <p><strong>Số tài khoản:</strong> [{paymentInfo.accountNumber}]</p>
            <p><strong>Ngân hàng:</strong> [{paymentInfo.bank}]</p>
            <p><strong>Nội dung chuyển khoản:</strong> {paymentInfo.transferContent}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default PaymentPanel;
