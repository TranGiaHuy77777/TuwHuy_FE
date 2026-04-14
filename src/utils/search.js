import {
  caseCards,
  caseHeroCard,
  highlights,
  homeSummary,
  paymentInfo,
  portfolioProjects,
  platformCards,
  serviceCatalogSections,
  tabs,
} from '../data/appData';

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

const tabLookup = Object.fromEntries(tabs.map((tab) => [tab.id, tab]));

const searchEntries = [
  ...tabs.map((tab) => ({
    id: `tab-${tab.id}`,
    tabId: tab.id,
    group: 'Tab',
    tabLabel: tab.label,
    title: tab.title,
    description: `${tab.eyebrow} • ${tab.stats.map((card) => `${card.label}: ${card.value}`).join(' • ')}`,
    keywords: `${tab.label} ${tab.eyebrow}`,
  })),
  ...highlights.map((item, index) => ({
    id: item.id,
    highlightId: item.id,
    tabId: 'overview',
    group: 'Điểm nổi bật',
    tabLabel: tabLookup.overview.label,
    title: item.title,
    description: item.text,
    keywords: `tong quan overview thiet ke web app do an startup ${index + 1}`,
  })),
  {
    id: 'overview-bonus-web-app',
    tabId: 'overview',
    group: 'Bonus',
    tabLabel: tabLookup.overview.label,
    title: homeSummary.title,
    description: `${homeSummary.description} ${homeSummary.contactValue}`,
    keywords: `thiet ke website web app do an sinh vien startup software ${homeSummary.points.join(' ')}`,
  },
  {
    id: 'payment-qr',
    highlightId: 'payment-qr',
    tabId: 'payment',
    group: 'Nạp tiền',
    tabLabel: tabLookup.payment.label,
    title: paymentInfo.qrTitle,
    description: `${paymentInfo.bank} • ${paymentInfo.accountName} • ${paymentInfo.accountNumber}`,
    keywords: `nap tien qr tpbank vietqr ${paymentInfo.accountName} ${paymentInfo.accountNumber}`,
  },
  ...serviceCatalogSections.flatMap((section) => [
    {
      id: section.id,
      highlightId: section.id,
      tabId: 'services',
      group: 'Dịch vụ',
      tabLabel: tabLookup.services.label,
      title: section.label,
      description: section.note,
      keywords: `${section.label} ${section.items.map((item) => item.label).join(' ')}`,
    },
    ...section.items.map((item) => ({
      id: item.id,
      highlightId: item.id,
      tabId: 'services',
      group: section.label,
      tabLabel: tabLookup.services.label,
      title: item.label,
      description: `${section.label} • ${section.note}`,
      keywords: `${section.label} ${item.label}`,
    })),
  ]),
  ...platformCards.map((item) => ({
    id: item.id,
    highlightId: item.id,
    tabId: 'platforms',
    group: 'Nền tảng',
    tabLabel: tabLookup.platforms.label,
    title: item.name,
    description: item.detail,
    keywords: 'facebook instagram tiktok youtube google shopee',
  })),
  {
    id: caseHeroCard.id,
    highlightId: caseHeroCard.id,
    tabId: 'case-study',
    group: 'Case Study',
    tabLabel: tabLookup['case-study'].label,
    title: caseHeroCard.title,
    description: caseHeroCard.description,
    keywords: 'portfolio inbox rieng tu',
  },
  ...caseCards.map((item) => ({
    id: item.id,
    highlightId: item.id,
    tabId: 'case-study',
    group: 'Case Study',
    tabLabel: tabLookup['case-study'].label,
    title: item.title,
    description: item.description,
    keywords: 'portfolio du an da lam website web app khach hang',
  })),
  ...portfolioProjects.map((project) => ({
    id: project.id,
    highlightId: project.id,
    tabId: 'case-study',
    group: 'Portfolio',
    tabLabel: tabLookup['case-study'].label,
    title: project.name,
    description: `${project.type} • ${project.stack} • ${project.summary}`,
    keywords: `du an ${project.type} ${project.stack} ${project.name}`,
  })),
];

function getSearchScore(entry, normalizedQuery, queryWords) {
  const title = normalizeText(entry.title);
  const description = normalizeText(entry.description);
  const meta = normalizeText(`${entry.group} ${entry.tabLabel} ${entry.keywords ?? ''}`);
  const haystack = `${title} ${description} ${meta}`;

  let score = 0;

  if (haystack.includes(normalizedQuery)) {
    score += 18;
  }

  queryWords.forEach((word) => {
    if (title.includes(word)) score += 8;
    if (description.includes(word)) score += 4;
    if (meta.includes(word)) score += 3;
  });

  if (queryWords.length > 0 && queryWords.every((word) => haystack.includes(word))) {
    score += 10;
  }

  return score;
}

export function getSearchResults(query) {
  const normalizedQuery = normalizeText(query.trim());

  if (!normalizedQuery) {
    return [];
  }

  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  return searchEntries
    .map((entry) => ({
      ...entry,
      score: getSearchScore(entry, normalizedQuery, queryWords),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.title.localeCompare(right.title, 'vi');
    });
}
