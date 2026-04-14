import { useState } from 'react';

function ConsultationPanel({ authUser }) {
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName ?? '',
    phone: authUser?.phone ?? '',
    email: authUser?.email ?? '',
    projectType: 'Website doanh nghiệp',
    budget: 'Dưới 20 triệu',
    preferredDate: '',
    note: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <section className="panel-screen consultation-panel">
      <div className="panel-heading">
        <p className="panel-label">Consultation</p>
        <h2>Để lại thông tin dự án để đặt lịch tư vấn</h2>
      </div>

      {isSubmitted ? (
        <article className="consultation-success">
          <h3>Đã ghi nhận thông tin tư vấn</h3>
          <p>
            Cảm ơn {formData.fullName || 'bạn'}. Đội ngũ sẽ liên hệ qua số {formData.phone || 'bạn cung cấp'} trong thời gian sớm nhất.
          </p>
        </article>
      ) : (
        <form className="consultation-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input name="fullName" value={formData.fullName} onChange={handleChange} required />
          </label>

          <label>
            Số điện thoại
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Loại dự án
            <select name="projectType" value={formData.projectType} onChange={handleChange}>
              <option>Website doanh nghiệp</option>
              <option>Web app quản trị</option>
              <option>Đồ án sinh viên</option>
              <option>Mobile app</option>
            </select>
          </label>

          <label>
            Ngân sách dự kiến
            <select name="budget" value={formData.budget} onChange={handleChange}>
              <option>Dưới 20 triệu</option>
              <option>20 - 50 triệu</option>
              <option>50 - 100 triệu</option>
              <option>Trên 100 triệu</option>
            </select>
          </label>

          <label>
            Thời điểm mong muốn tư vấn
            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
          </label>

          <label className="consultation-form__full">
            Mô tả nhanh yêu cầu
            <textarea name="note" value={formData.note} onChange={handleChange} rows={5} placeholder="Ví dụ: cần website giới thiệu công ty + form lấy lead + tích hợp chatbot..." />
          </label>

          <button type="submit" className="consultation-submit">Gửi thông tin tư vấn</button>
        </form>
      )}
    </section>
  );
}

export default ConsultationPanel;
