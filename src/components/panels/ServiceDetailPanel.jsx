import { useEffect, useState } from 'react';
import { servicePackages, serviceCatalogSections } from '../../data/appData';

function ServiceDetailPanel({ selectedServiceItem, onNavigateToPayment, onBack }) {
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [targetLink, setTargetLink] = useState('');
  const [commentContent, setCommentContent] = useState('');

  if (!selectedServiceItem) {
    return null;
  }

  const { itemId, sectionId } = selectedServiceItem;
  const isCommentBoost = itemId === 'facebook-comment-boost';
  const isFollowProfile = itemId === 'facebook-follow-profile';
  const isFollowPage = itemId === 'facebook-follow-page';
  const isGroupMembers = itemId === 'facebook-group-members';
  const isVideoViews = itemId === 'facebook-video-views';
  const isLiveViews = itemId === 'facebook-live-views';
  const isLiveViewsV2 = itemId === 'facebook-live-views-v2';
  const isShareBoost = itemId === 'facebook-share-boost';
  const isStoryViews = itemId === 'facebook-story-views';
  const isPageReviews = itemId === 'facebook-page-reviews';
  const isInstagramService = itemId.startsWith('instagram-');
  const isVipLikeMonth = itemId === 'facebook-vip-like-month';
  const isVipLikeMonthV2 = itemId === 'facebook-vip-like-month-v2';
  const isVipLiveMonth = itemId === 'facebook-vip-live-month';
  const isVipCommentMonth = itemId === 'facebook-vip-comment-month';
  const isReelsViews = itemId === 'facebook-reels-views';
  const isReelsLikes = itemId === 'facebook-reels-likes';
  const isReelsComments = itemId === 'facebook-reels-comments';
  const isReelsShares = itemId === 'facebook-reels-shares';
  const isAutoLiveStream = itemId === 'facebook-auto-live-stream';
  const section = serviceCatalogSections.find((s) => s.id === sectionId);
  const item = section?.items.find((i) => i.id === itemId);
  const packages = servicePackages[itemId];

  if (!item || !packages) {
    return null;
  }

  const getPriceMultiplier = (providerAmount) => {
    if (providerAmount < 10000) return 4;
    if (providerAmount < 50000) return 3;
    return 2;
  };

  const calculateDisplayTotalPrice = (providerTotal) => {
    const multiplied = providerTotal * getPriceMultiplier(providerTotal);

    let surcharge = 0;
    if (providerTotal > 10000000) surcharge = 4000000;
    else if (providerTotal > 5000000) surcharge = 2000000;
    else if (providerTotal > 1000000) surcharge = 1000000;

    return Math.round(multiplied + surcharge);
  };

  // Get selected package details
  const selectedPackage = selectedPackageId
    ? packages.find((pkg) => pkg.id === selectedPackageId)
    : null;

  const getDefaultMinimumQuantity = () => {
    if (isVipCommentMonth) return 5;
    if (isVipLikeMonth || itemId === 'instagram-vip-like') return 50;
    return 100;
  };

  const getAutoDetectedMinimumQuantity = () => {
    if (!selectedPackage) return getDefaultMinimumQuantity();

    const rawText = `${selectedPackage.name ?? ''} ${selectedPackage.note ?? ''}`.toLowerCase();
    const isMinOneThousand = /(min\s*1\s*k|min\s*1000|\b1\s*k\b|\b1000\b)/i.test(rawText);

    if (isMinOneThousand) return 1000;
    return getDefaultMinimumQuantity();
  };

  const minimumQuantity = selectedPackage?.minQuantity ?? getAutoDetectedMinimumQuantity();

  const formatServerPrice = (providerPrice) => {
    const displayPrice = providerPrice * getPriceMultiplier(providerPrice);
    return displayPrice.toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  };

  const handleQuantityBlur = () => {
    setQuantity((prev) => Math.max(minimumQuantity, prev || 0));
  };

  // Calculate total price in VND
  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const providerTotal = selectedPackage.price * quantity;
    return calculateDisplayTotalPrice(providerTotal);
  };

  const totalPriceVND = calculateTotalPrice();
  const commentLinesCount = commentContent
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean).length;

  useEffect(() => {
    if (isVipLikeMonth) {
      setQuantity(50);
    } else if (isVipCommentMonth) {
      setQuantity(5);
    } else if (isVipLikeMonthV2 || isVipLiveMonth || isVipCommentMonth || isReelsViews || isReelsLikes || isReelsComments || isReelsShares || isAutoLiveStream || isPageReviews || isStoryViews || isShareBoost || isLiveViews || isLiveViewsV2 || isVideoViews || isFollowProfile || isFollowPage || isGroupMembers || isCommentBoost) {
      setQuantity(100);
    } else if (itemId === 'instagram-vip-like') {
      setQuantity(50);
    } else if (isInstagramService) {
      setQuantity(100);
    }
  }, [isVipLikeMonth, isVipLikeMonthV2, isVipLiveMonth, isVipCommentMonth, isReelsViews, isReelsLikes, isReelsComments, isReelsShares, isAutoLiveStream, isPageReviews, isStoryViews, isShareBoost, isLiveViews, isLiveViewsV2, isVideoViews, isFollowProfile, isFollowPage, isGroupMembers, isCommentBoost, itemId]);

  const handleSubmit = () => {
    if (!selectedPackage) {
      alert('Vui lòng chọn một gói dịch vụ');
      return;
    }
    if (quantity < minimumQuantity) {
      alert(`Số lượng tối thiểu là ${minimumQuantity}`);
      return;
    }
    if (isFollowProfile && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isFollowPage && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isGroupMembers && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isVideoViews && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isLiveViews && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isLiveViewsV2 && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isStoryViews && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isPageReviews && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if ((isVipLikeMonth || isVipLikeMonthV2 || isVipLiveMonth || isVipCommentMonth || isReelsViews || isReelsLikes || isReelsComments || isReelsShares || isAutoLiveStream) && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isShareBoost && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isCommentBoost && !targetLink.trim()) {
      alert('Vui lòng nhập Link hoặc ID');
      return;
    }
    if (isCommentBoost && commentLinesCount === 0) {
      alert('Vui lòng nhập nội dung bình luận (mỗi dòng là 1 bình luận)');
      return;
    }
    if ((isVipCommentMonth || isReelsComments || isPageReviews) && commentLinesCount === 0) {
      alert('Vui lòng nhập nội dung bình luận (mỗi dòng là 1 bình luận)');
      return;
    }
    onNavigateToPayment({
      itemId,
      sectionId,
      packageId: selectedPackage.id,
      quantity,
      targetLink,
      commentContent,
    });
  };

  const renderInstagramPanel = () => {
    const instagramConfig = (() => {
      switch (itemId) {
        case 'instagram-like':
          return {
            warningTitle: 'ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN',
            warningLines: ['Tăng Like bài viết Instagram bằng link đã mở công khai', 'Xem bài viết hướng dẫn chi tiết : Tại đây'],
          };
        case 'instagram-follow':
          return {
            warningTitle: 'ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN',
            warningLines: ['Tăng theo dõi/follow instagram bằng username công khai, username phải tắt chế độ riêng tư..', 'Xem bài viết hướng dẫn chi tiết : Tại đây'],
          };
        case 'instagram-comment':
          return {
            warningTitle: 'ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN',
            warningLines: ['Tăng comment cần mở công khai bài viết', 'Xem bài viết chi tiết : Tại đây'],
            hasComment: true,
          };
        case 'instagram-view':
          return {
            warningTitle: 'ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-igtv-views':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-live-video-views':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['Trước khi tăng mắt livestream cần mở công khai bài đăng', 'Lấy đúng link livestream Instagram'],
          };
        case 'instagram-reel-views':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-story-views':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-impressions':
        case 'instagram-saves':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-reach-impressions':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-profile-visits':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-auto-hq-likes':
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG', '- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
          };
        case 'instagram-auto-views':
          return {
            warningTitle: '- CẦN MỞ CÔNG KHAI BÀI ĐĂNG',
            warningLines: ['- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)'],
            hideQuantityNote: true,
          };
        case 'instagram-vip-like':
          return {
            warningTitle: 'VUI LÒNG MỞ CÔNG KHAI LIKE BÀI VIẾT TRƯỚC KHI CÀI VIPLIKE',
            warningLines: ['Viplike là gói MỌI NGƯỜI tự động like bài viết của bạn theo tháng.', 'Khi bạn đăng bài lên, sẽ tự động có người like bài viết của bạn, từ đó giúp nâng cao tương tác trên trang cá nhân.'],
            hasVipFields: true,
            vipLikeMonthDays: ['7 ngày', '30 ngày', '60 ngày', '90 ngày'],
            vipLikeMonthQuantities: ['50', '100', '150', '200', '250', '300', '500', '750', '1000', '1500', '2000', '3000', '5000', '75000', '100000'],
          };
        default:
          return {
            warningTitle: 'ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN',
            warningLines: ['- CẦN MỞ CÔNG KHAI BÀI ĐĂNG'],
            hideQuantityNote: false,
          };
      }
    })();

    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button>
        </div>

        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name={`instagram-${itemId}-server`}
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          {instagramConfig.hasComment ? (
            <div className="comment-boost-field">
              <label className="package-option-label">Bình luận : {commentLinesCount} cmts</label>
              <textarea
                className="comment-boost-textarea"
                placeholder="Mỗi dòng là 1 bình luận"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
              />
            </div>
          ) : null}

          {instagramConfig.hasVipFields ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="comment-boost-field">
                <label className="package-option-label">Số ngày thuê</label>
                <select className="quantity-input" defaultValue={instagramConfig.vipLikeMonthDays?.[0] ?? '7 ngày'}>
                  {(instagramConfig.vipLikeMonthDays ?? ['7 ngày', '30 ngày', '60 ngày', '90 ngày']).map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="comment-boost-field">
                <label className="package-option-label">Số lượng</label>
                <select className="quantity-input" value={String(quantity)} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}>
                  {(instagramConfig.vipLikeMonthQuantities ?? ['50', '100', '150', '200', '250', '300', '500', '750', '1000', '1500', '2000', '3000', '5000', '75000', '100000']).map((amount) => (
                    <option key={amount} value={amount}>
                      {amount}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="comment-boost-field">
              <label className="package-option-label">Số lượng</label>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                onBlur={handleQuantityBlur}
                min={minimumQuantity}
                step="1"
              />
              {!instagramConfig.hideQuantityNote ? <p className="quantity-note">Tối thiểu {minimumQuantity}</p> : null}
            </div>
          )}

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">{instagramConfig.warningTitle}</p>
            {instagramConfig.warningLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai, không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  };

  if (isCommentBoost) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="comment-boost-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{Math.round(pkg.price * getPriceMultiplier(pkg.price))}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Bình luận : {commentLinesCount} cmts</label>
            <textarea
              className="comment-boost-textarea"
              placeholder="Mỗi dòng là 1 bình luận"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="comment-emoji-box">
            <p className="comment-emoji-row">
              😳 😃 😁 😆 😅 😂 🤣 😉 😊 ☺️ 😌 😍 🥰 😘 😗 😙 😚 🤗 🤩 🤔 🤨 😐 😑 🙄 😏 😣 😥 😮 😯 😪 😫 😴 😌
            </p>
            <p className="comment-emoji-row">
              👌 👍 👎 👏 🙌 🤝 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✌️ 🤟 🤲 💖 💗 💛 💚 💙 💜 🤎 🖤 ❤️‍🔥 💔
            </p>
            <p className="comment-emoji-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng bình luận phải tiền hành mở công khai comment trong mục cài đặt & quyền riêng tư.</p>
            <p>Mỗi dòng là 1 bình luận, không nhập nội dung bị cấm, nhạy cảm, bạo lực, ngôn từ gây thù ghét, chính trị...</p>
            <p>LƯU Ý : Lấy ID chính xác.</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Nghiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồi trụy,... Nếu cố tình buff bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai, không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isFollowProfile) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="follow-profile-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng Theo dõi/Follow phải đảm bảo Facebook bạn đã trên 18t & Theo dõi ở chế độ công khai, Mở hiển thị số người theo dõi đã có lên.</p>
            <p>Lưu ý : Lấy ID Facebook cá nhân chính xác.</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isFollowPage) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="follow-page-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className={`comment-server-note ${pkg.badge === 'maintenance' ? 'is-maintenance' : ''}`}>{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng nhớ kiểm tra xem Fanpage của bạn là Fanpage loại nào (Nếu Page có cả lượt thích + lượt Follow thì dùng tại đây), còn nếu Fanpage chỉ có lượt Follow thì hãy qua mục: Tăng follow Facebook cá nhân để dùng.</p>
            <p>Lưu ý : Lấy đúng ID Fanpage.</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isGroupMembers) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="group-member-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng Mem group cần mở nhóm ở chế độ công khai, và tắt phê duyệt trước khi tăng Mem.</p>
            <p>Lưu ý : Lấy đúng ID Group.</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isVideoViews) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="video-view-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng view video cần mở công khai bài viết, Và cần lấy đúng định dạng VD : https://www.facebook.com/leduyhiep.vn/videos/4558383383159454</p>
            <p>Chọn loại nào thì thời hạn video phải dài hơn thời hạn chọn VD : Chọn seve 3s thì video phải dài tối thiểu 4s</p>
            <p>Lưu ý : Lấy đúng định dạng Link</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isLiveViews) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link livestream hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="live-view-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng mắt livestream cần mở công khai livestream, Và cần lấy đúng định dạng VD : https://www.facebook.com/leduyhiep.vn/live/4558383383159454</p>
            <p>Chọn loại nào thì thời hạn livestream phải dài hơn thời hạn chọn VD : Chọn 30 phút thì livestream phải dài tối thiểu 31 phút</p>
            <p>Lưu ý : Lấy đúng định dạng Link livestream công khai</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id livestream, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id livestream công khai không nhập id khác, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isLiveViewsV2) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link livestream hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="live-view-v2-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng mắt livestream V2 cần mở công khai livestream, Và cần lấy đúng định dạng VD : https://www.facebook.com/username/videos/4558383383159454</p>
            <p>Không hỗ trợ bài viết trong nhóm, không chạy livestream chia sẻ âm nhạc.</p>
            <p>Lưu ý : Lấy đúng định dạng Link</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id livestream, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id livestream công khai không nhập id khác, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isStoryViews) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link story hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="story-view-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng view story cần mở Story ở chế độ công khai tất cả mọi người.</p>
            <p>Lưu ý: Lấy đúng đường link story.</p>
            <p>Định dạng link Story: https://www.facebook.com/stories/27964844343/8</p>
            <p>Bài viết hướng dẫn chi tiết tăng view story: Tại đây</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id story, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id story công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isPageReviews) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id tuỳ gói"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="page-review-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Bình luận : {commentLinesCount} cmts</label>
            <textarea
              className="comment-boost-textarea"
              placeholder="Mỗi dòng là 1 bình luận"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng đánh giá bạn cần mở checkin fanpage đánh giá để mọi người có thể đánh giá được.</p>
            <p>Nội dung đánh giá không được chứa những từ cấm nhạy cảm khiêu khích ...</p>
            <p>Lưu ý : Lấy đúng ID Fanpage</p>
            <p>Bài viết hướng dẫn chi tiết : Tại đây</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id fanpage, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id fanpage công khai không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (isInstagramService) {
    return renderInstagramPanel();
  }

  if (isVipLikeMonth) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button>
        </div>

        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input type="radio" name="vip-like-month-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="comment-boost-field">
              <label className="package-option-label">Số lượng</label>
              <select className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={200}>200</option>
                <option value={250}>250</option>
                <option value={300}>300</option>
                <option value={500}>500</option>
                <option value={750}>750</option>
                <option value={1000}>1000</option>
                <option value={1500}>1500</option>
                <option value={2000}>2000</option>
                <option value={3000}>3000</option>
                <option value={5000}>5000</option>
                <option value={75000}>75000</option>
                <option value={100000}>100000</option>
              </select>
            </div>
            <div className="comment-boost-field">
              <label className="package-option-label">Số ngày thuê</label>
              <select className="quantity-input" defaultValue="7 ngày">
                <option>7 ngày</option>
                <option>30 ngày</option>
                <option>60 ngày</option>
                <option>90 ngày</option>
              </select>
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số bài viết</label>
            <select className="quantity-input" defaultValue="5 (giá x1)">
              <option>5 (giá x1)</option>
              <option>10 (giá x2)</option>
              <option>15 (giá x3)</option>
              <option>20 (giá x4)</option>
              <option>25 (giá x5)</option>
              <option>30 (giá x6)</option>
              <option>35 (giá x7)</option>
              <option>40 (giá x8)</option>
              <option>45 (giá x9)</option>
              <option>50 (giá x10)</option>
              <option>55 (giá x11)</option>
              <option>60 (giá x12)</option>
              <option>65 (giá x13)</option>
              <option>70 (giá x14)</option>
              <option>75 (giá x15)</option>
              <option>80 (giá x16)</option>
              <option>85 (giá x17)</option>
            </select>
          </div>

          <div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div>
          <button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">VUI LÒNG MỞ CÔNG KHAI LIKE BÀI VIẾT TRƯỚC KHI CÀI VIPLIKE</p>
            <p>Viplike là gói MỌI NGƯỜI tự động like bài viết của bạn theo tháng. Khi bạn đăng bài lên, sẽ tự động có người like bài viết của bạn, từ đó giúp nâng cao tương tác trên trang cá nhân.</p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul>
          </div>
        </div>
      </section>
    );
  }

  if (isVipLikeMonthV2) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card">
          <div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div>
          <div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="vip-like-month-v2-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="comment-boost-field"><label className="package-option-label">Số lượng</label><select className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}><option value={100}>100</option><option value={200}>200</option><option value={500}>500</option></select></div>
            <div className="comment-boost-field"><label className="package-option-label">Số ngày thuê</label><select className="quantity-input" defaultValue="7 Ngày"><option>7 Ngày</option><option>15 Ngày</option><option>30 Ngày</option></select></div>
          </div>
          <div className="comment-boost-field"><label className="package-option-label">Số bài viết</label><select className="quantity-input" defaultValue="5 bài viết mỗi ngày"><option>5 bài viết mỗi ngày</option><option>10 bài viết mỗi ngày</option><option>20 bài viết mỗi ngày</option></select></div>
          <div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button>
          <div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>- Tăng cảm xúc Facebook: Likes</p><p>- Vui lòng mở công khai đường link Facebook/ID trước khi tạo đơn</p></div>
          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div>
        </div>
      </section>
    );
  }

  if (isVipLiveMonth) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card">
          <div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div>
          <div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="vip-live-month-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div>
          <div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div>
          <div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button>
          <div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>Trước khi tăng mắt livestream cần mở công khai bài viết.</p><p>Vui lòng lấy đúng link Facebook/ID.</p></div>
          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div>
        </div>
      </section>
    );
  }

  if (isVipCommentMonth) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card">
          <div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div>
          <div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="vip-comment-month-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div>
          <div className="comment-boost-field"><label className="package-option-label">Bình luận : {commentLinesCount} cmts</label><textarea className="comment-boost-textarea" placeholder="Mỗi dòng là 1 bình luận" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} rows={4} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="comment-boost-field"><label className="package-option-label">Số ngày thuê</label><select className="quantity-input" defaultValue="30 ngày"><option>30 ngày</option><option>60 ngày</option><option>90 ngày</option></select></div>
            <div className="comment-boost-field"><label className="package-option-label">Số lượng bài viết</label><select className="quantity-input" defaultValue="5 (giá x1)"><option>5 (giá x1)</option><option>10 (giá x2)</option><option>15 (giá x3)</option><option>20 (giá x4)</option><option>25 (giá x5)</option><option>30 (giá x6)</option><option>35 (giá x7)</option><option>40 (giá x8)</option><option>45 (giá x9)</option><option>50 (giá x10)</option><option>55 (giá x11)</option><option>60 (giá x12)</option><option>65 (giá x13)</option><option>70 (giá x14)</option><option>75 (giá x15)</option><option>80 (giá x16)</option><option>85 (giá x17)</option><option>90 (giá x18)</option><option>95 (giá x19)</option></select></div>
          </div>
          <div className="comment-boost-field"><label className="package-option-label">Số lượng</label><select className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}><option value={5}>5 comment</option><option value={10}>10 comment</option><option value={15}>15 comment</option><option value={20}>20 comment</option><option value={25}>25 comment</option><option value={30}>30 comment</option><option value={35}>35 comment</option><option value={40}>40 comment</option><option value={45}>45 comment</option><option value={50}>50 comment</option><option value={55}>55 comment</option><option value={60}>60 comment</option><option value={65}>65 comment</option><option value={70}>70 comment</option><option value={75}>75 comment</option><option value={80}>80 comment</option><option value={85}>85 comment</option><option value={90}>90 comment</option><option value={95}>95 comment</option><option value={100}>100 comment</option></select></div>
          <div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button>
          <div className="follow-warning-box"><p className="follow-warning-title">VUI LÒNG MỞ CÔNG KHAI BÌNH LUẬN BÀI VIẾT TRƯỚC KHI CÀI VIPCOMMENT</p><p>Viplike là gói MỌI NGƯỜI tự động comment bài viết của bạn theo tháng. Khi bạn đăng bài lên, sẽ tự động có người comment bài viết của bạn, từ đó giúp nâng cao tương tác trên trang cá nhân.</p></div>
          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div>
        </div>
      </section>
    );
  }

  if (isReelsViews) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card"><div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div><div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="reels-views-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div><div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div><div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button><div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>Trước khi tăng like phải mở video/reels ở chế độ công khai.</p><p>Lưu ý: Lấy chính xác ID.</p></div><div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div></div>
      </section>
    );
  }

  if (isReelsLikes) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card"><div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div><div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="reels-likes-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>{pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}</label>))}</div></div><div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div><div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button><div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>Trước khi tăng like reels phải mở video/reels ở chế độ công khai.</p><p>Lưu ý: Lấy chính xác ID.</p></div><div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div></div>
      </section>
    );
  }

  if (isReelsComments) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card"><div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div><div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="reels-comments-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div><div className="comment-boost-field"><label className="package-option-label">Bình luận : {commentLinesCount} cmts</label><textarea className="comment-boost-textarea" placeholder="Mỗi dòng là 1 bình luận" value={commentContent} onChange={(e) => setCommentContent(e.target.value)} rows={4} /></div><div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div><div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button><div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>Trước khi tăng comment reels cần mở bài viết ở chế độ công khai.</p><p>Lưu ý: Mỗi dòng là 1 bình luận, không nhập nội dung bị cấm.</p></div><div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div></div>
      </section>
    );
  }

  if (isReelsShares) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card"><div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div><div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="reels-shares-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div><div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div><div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button><div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>Trước khi tăng share reels cần mở reels ở chế độ công khai.</p><p>Lưu ý: Lấy đúng ID bài viết.</p></div><div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li></ul></div></div>
      </section>
    );
  }

  if (isAutoLiveStream) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading"><p className="panel-label">Chi tiết dịch vụ</p><h2>{item.label}</h2><p className="service-detail-subtitle">{section.label}</p><button className="back-button" onClick={onBack} title="Quay lại">← Quay lại</button></div>
        <div className="pricing-notice-box">Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá</div>
        <div className="comment-boost-card"><div className="comment-boost-field"><label className="package-option-label">Link hoặc ID</label><input type="text" className="quantity-input" placeholder="Nhập link hoặc id tuỳ gói" value={targetLink} onChange={(e) => setTargetLink(e.target.value)} /></div><div className="comment-boost-field"><p className="package-option-label">Máy chủ</p><div className="comment-server-list">{packages.map((pkg) => (<label key={pkg.id} className="comment-server-item"><input type="radio" name="auto-live-stream-server" value={pkg.id} checked={selectedPackageId === pkg.id} onChange={() => setSelectedPackageId(pkg.id)} /><span className="comment-server-name">{pkg.name}</span><span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span></label>))}</div></div><div className="comment-boost-field"><label className="package-option-label">Số lượng</label><input type="number" className="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} onBlur={handleQuantityBlur} min={minimumQuantity} step="1" /><p className="quantity-note">Tối thiểu {minimumQuantity}</p></div><div className="comment-boost-total"><p>Tổng tiền: <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span></p></div><button className="package-submit-btn" onClick={handleSubmit}>Tạo tiền trình</button><div className="follow-warning-box"><p className="follow-warning-title">ĐỌC TRƯỚC KHI TĂNG TRÁNH MẤT TIỀN</p><p>- CẦN MỞ CÔNG KHAI BÀI ĐĂNG</p><p>- LẤY ĐÚNG LINK (LẤY SAI LINK KHÔNG HOÀN TIỀN)</p></div><div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ"><p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p><ul className="service-policy-list"><li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li><li>Nếu đơn đang chạy trên hệ thống mà bạn vẫn mua ở các hệ thống bên khác, nếu có tình trạng hụt, thiếu số lượng giữa 2 bên thì sẽ không được xử lí.</li></ul></div></div>
      </section>
    );
  }

  if (isShareBoost) {
    return (
      <section className="panel-screen service-detail-panel">
        <div className="panel-heading">
          <p className="panel-label">Chi tiết dịch vụ</p>
          <h2>{item.label}</h2>
          <p className="service-detail-subtitle">{section.label}</p>
          <button className="back-button" onClick={onBack} title="Quay lại">
            ← Quay lại
          </button>
        </div>

        <div className="pricing-notice-box">
          Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
        </div>

        <div className="comment-boost-card">
          <div className="comment-boost-field">
            <label className="package-option-label">Link hoặc ID</label>
            <input
              type="text"
              className="quantity-input"
              placeholder="Nhập link hoặc id bài viết"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
            />
          </div>

          <div className="comment-boost-field">
            <p className="package-option-label">Máy chủ</p>
            <div className="comment-server-list">
              {packages.map((pkg) => (
                <label key={pkg.id} className="comment-server-item">
                  <input
                    type="radio"
                    name="share-boost-server"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={() => setSelectedPackageId(pkg.id)}
                  />
                  <span className="comment-server-name">{pkg.name}</span>
                  <span className="comment-server-price">{(pkg.price * getPriceMultiplier(pkg.price)).toFixed(3).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')}đ</span>
                  {pkg.note ? <span className="comment-server-note">{pkg.note}</span> : null}
                </label>
              ))}
            </div>
          </div>

          <div className="comment-boost-field">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="comment-boost-total">
            <p>
              Tổng tiền:{' '}
              <span className="total-amount">{totalPriceVND.toLocaleString('vi-VN')}đ</span>
            </p>
          </div>

          <button className="package-submit-btn" onClick={handleSubmit}>
            Tạo tiền trình
          </button>

          <div className="follow-warning-box">
            <p className="follow-warning-title">ĐỌC LƯU Ý TRƯỚC KHI TẠO ĐƠN TRÁNH MẤT TIỀN</p>
            <p>Trước khi tăng Share/chia sẻ sẽ cần <span style={{color: '#ff6b6b', fontWeight: 600}}>mở công khai bài viết</span>, Nhằm mục đích ai cũng có thể chia sẻ bài viết của bạn được.</p>
            <p>Lưu ý : <span style={{color: '#ff6b6b', fontWeight: 600}}>Lấy đúng ID bài viết bạn cần tăng chia sẻ</span></p>
          </div>

          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Ngiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồ trụy... Nếu cố tình buff bạn sẽ bị trừ hết tiền và band khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.....</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai, không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-screen service-detail-panel">
      <div className="panel-heading">
        <p className="panel-label">Chi tiết dịch vụ</p>
        <h2>{item.label}</h2>
        <p className="service-detail-subtitle">{section.label}</p>
        <button className="back-button" onClick={onBack} title="Quay lại">
          ← Quay lại
        </button>
      </div>

      <div className="pricing-notice-box">
        Lưu ý: Giá sẽ được cập nhật sau, xin vui lòng liên hệ admin để báo giá
      </div>

      <div className="service-detail-container">
        <div className="service-detail-left">
          <div className="service-package-list">
            {packages.map((pkg) => (
              <label key={pkg.id} className="service-package-item">
                <input
                  type="radio"
                  name="service-package"
                  value={pkg.id}
                  checked={selectedPackageId === pkg.id}
                  onChange={() => setSelectedPackageId(pkg.id)}
                  className="service-package-radio"
                />
                <div className="service-package-info">
                  <span className="service-package-name">{pkg.name}</span>
                  {pkg.note && <p className="service-package-note">{pkg.note}</p>}
                </div>
                <div className="service-package-price">
                  <span className={`price ${pkg.badge ? `badge-${pkg.badge}` : ''}`}>
                    {formatServerPrice(pkg.price)}đ
                  </span>
                </div>
              </label>
            ))}
          </div>
          <div className="service-policy-note" role="note" aria-label="Lưu ý điều khoản dịch vụ">
            <p className="service-policy-title">Lưu ý điều khoản trước khi tạo tiến trình:</p>
            <ul className="service-policy-list">
              <li>Nghiêm cấm Buff các ID Seeding có nội dung vi phạm pháp luật, chính trị, đồi trụy,... Nếu cố tình buff bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.</li>
              <li>Hệ thống sử dụng 99% tài khoản người VN, fb thật để tương tác like, comment, share....</li>
              <li>Vui lòng lấy đúng id bài viết, công khai và check kỹ job tránh tạo nhầm, tính năng đang trong giai đoạn thử nghiệm nên sẽ không hoàn tiền nếu bạn tạo nhầm.</li>
              <li>Chỉ nhận id bài viết công khai, không nhập id album, id comment, id trang cá nhân, id page,...</li>
              <li>Nhập id lỗi hoặc trong thời gian chạy die id thì hệ thống không hoàn lại tiền.</li>
            </ul>
          </div>
        </div>

        <div className="service-detail-right">
          <div className="package-option-group">
            <label className="package-option-label">Cấm xúc</label>
            <div className="emotion-buttons">
              <button className="emotion-btn">👍</button>
              <button className="emotion-btn">😆</button>
              <button className="emotion-btn">❤️</button>
              <button className="emotion-btn">😲</button>
              <button className="emotion-btn">😢</button>
              <button className="emotion-btn">🤔</button>
              <button className="emotion-btn">😠</button>
            </div>
          </div>

          <div className="package-option-group">
            <label className="package-option-label">Số lượng</label>
            <input
              type="number"
              className="quantity-input"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
              onBlur={handleQuantityBlur}
              min={minimumQuantity}
              step="1"
            />
            <p className="quantity-note">Tối thiểu {minimumQuantity}</p>
          </div>

          <div className="package-total-price">
            <p>
              Tống tiền:{' '}
              <span className="total-amount">
                {totalPriceVND.toLocaleString('vi-VN')}đ
              </span>
            </p>
          </div>

          <button
            className="package-submit-btn"
            onClick={handleSubmit}
          >
            Tạo tiền trình
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServiceDetailPanel;

