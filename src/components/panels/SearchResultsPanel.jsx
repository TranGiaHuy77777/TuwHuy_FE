function SearchResultsPanel({ query, results, onOpenResult }) {
  return (
    <section className="panel-screen search-results-panel">
      <div className="panel-heading">
        <p className="panel-label">Quick Search</p>
        <h2>
          {results.length > 0
            ? `Đã tìm thấy ${results.length} kết quả cho "${query}"`
            : `Chưa tìm thấy kết quả phù hợp với "${query}"`}
        </h2>
      </div>

      {results.length > 0 ? (
        <div className="search-results-grid">
          {results.map((result) => (
            <article className="search-result-card" key={result.id}>
              <div className="search-result-card__meta">
                <span className="search-result-tag">{result.group}</span>
                <span className="search-result-tab">{result.tabLabel}</span>
              </div>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
              <button type="button" className="search-result-action" onClick={() => onOpenResult(result)}>
                Mở mục này
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="search-empty-state">
          <p>Thử tìm theo tên tab, dịch vụ hoặc nền tảng như Facebook, TikTok, Dịch vụ, Google Maps, follow...</p>
        </div>
      )}
    </section>
  );
}

export default SearchResultsPanel;
