const STATE = {
  apis: [],
  results: {},
  sortKey: 'name',
  sortDir: 'asc',
  activeTags: new Set(),
};

async function loadData() {
  const [apisRes, resultsRes] = await Promise.all([
    fetch('apis.json'),
    fetch('results.json'),
  ]);
  STATE.apis = await apisRes.json();
  const resultsData = await resultsRes.json();
  STATE.results = resultsData.results || {};
  return resultsData;
}

function getStatus(apiId) {
  return STATE.results[apiId] || { status: 'unknown' };
}

function getAllTags() {
  const tags = new Set();
  for (const api of STATE.apis) {
    for (const tag of api.tags) {
      tags.add(tag);
    }
  }
  return [...tags].sort();
}

function populateTags() {
  const tags = getAllTags();
  const container = document.getElementById('tag-filters');
  container.innerHTML = '';

  for (const tag of tags) {
    const btn = document.createElement('button');
    btn.className = 'tag-chip';
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      if (STATE.activeTags.has(tag)) {
        STATE.activeTags.delete(tag);
        btn.classList.remove('active');
      } else {
        STATE.activeTags.add(tag);
        btn.classList.add('active');
      }
      renderTable();
    });
    container.appendChild(btn);
  }
}

function updateSummary(resultsData) {
  document.getElementById('total-count').textContent = resultsData.total || STATE.apis.length;
  document.getElementById('up-count').textContent = resultsData.up || 0;
  document.getElementById('degraded-count').textContent = resultsData.degraded || 0;
  document.getElementById('down-count').textContent = resultsData.down || 0;

  const total = resultsData.total || STATE.apis.length;
  const up = (resultsData.up || 0) + (resultsData.degraded || 0);
  const pct = total > 0 ? Math.round((up / total) * 100) : 0;
  document.getElementById('uptime-pct').textContent = pct + '%';

  if (resultsData.last_run) {
    const date = new Date(resultsData.last_run);
    document.getElementById('last-check').textContent =
      'Last checked: ' + date.toLocaleString();
  }
}

function responseTimeClass(ms) {
  if (ms == null) return '';
  if (ms < 1000) return 'fast';
  if (ms < 3000) return 'medium';
  return 'slow';
}

function formatResponseTime(ms) {
  if (ms == null) return '-';
  if (ms < 1000) return ms + 'ms';
  return (ms / 1000).toFixed(1) + 's';
}

function getFilteredApis() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const status = document.getElementById('status-filter').value;
  const auth = document.getElementById('auth-filter').value;

  return STATE.apis.filter(api => {
    if (auth && api.auth !== auth) return false;

    const apiStatus = getStatus(api.id);
    if (status && apiStatus.status !== status) return false;

    if (STATE.activeTags.size > 0) {
      const hasMatchingTag = [...STATE.activeTags].some(tag => api.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    if (search) {
      const haystack = (api.name + ' ' + api.description + ' ' + api.tags.join(' ')).toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}

function sortApis(apis) {
  const { sortKey, sortDir } = STATE;
  const dir = sortDir === 'asc' ? 1 : -1;

  return [...apis].sort((a, b) => {
    let va, vb;

    switch (sortKey) {
      case 'name':
        va = a.name.toLowerCase();
        vb = b.name.toLowerCase();
        break;
      case 'auth':
        va = a.auth;
        vb = b.auth;
        break;
      case 'status': {
        const order = { up: 0, degraded: 1, 'rate-limited': 2, down: 3, unknown: 4 };
        va = order[getStatus(a.id).status] ?? 4;
        vb = order[getStatus(b.id).status] ?? 4;
        break;
      }
      case 'response_time': {
        va = getStatus(a.id).response_time_ms ?? 99999;
        vb = getStatus(b.id).response_time_ms ?? 99999;
        break;
      }
      default:
        va = a.name.toLowerCase();
        vb = b.name.toLowerCase();
    }

    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
}

function renderTags(tags) {
  return tags.map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join(' ');
}

function renderTable() {
  const filtered = sortApis(getFilteredApis());
  const tbody = document.getElementById('api-tbody');
  const noResults = document.getElementById('no-results');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;

  const rows = filtered.map(api => {
    const s = getStatus(api.id);
    const rtClass = responseTimeClass(s.response_time_ms);

    return `<tr>
      <td>
        <span class="status-dot ${s.status}"></span>
        <span class="status-text">${s.status}</span>
      </td>
      <td class="api-name">
        <a href="${escapeHtml(api.url)}" target="_blank" rel="noopener">${escapeHtml(api.name)}</a>
      </td>
      <td class="td-desc">
        <span class="api-desc">${escapeHtml(api.description)}</span>
      </td>
      <td class="td-tags">${renderTags(api.tags)}</td>
      <td><span class="auth-badge">${api.auth === 'none' ? 'None' : api.auth}</span></td>
      <td><span class="response-time ${rtClass}">${formatResponseTime(s.response_time_ms)}</span></td>
    </tr>`;
  });

  tbody.innerHTML = rows.join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function setupSort() {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (STATE.sortKey === key) {
        STATE.sortDir = STATE.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        STATE.sortKey = key;
        STATE.sortDir = 'asc';
      }

      document.querySelectorAll('th.sortable').forEach(el => {
        el.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(STATE.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');

      renderTable();
    });
  });
}

function setupFilters() {
  document.getElementById('search').addEventListener('input', renderTable);
  document.getElementById('status-filter').addEventListener('change', renderTable);
  document.getElementById('auth-filter').addEventListener('change', renderTable);
}

async function init() {
  try {
    const resultsData = await loadData();
    populateTags();
    updateSummary(resultsData);
    setupSort();
    setupFilters();
    renderTable();
  } catch (err) {
    const isFileProtocol = window.location.protocol === 'file:';
    const message = isFileProtocol
      ? 'Cannot load data from file:// protocol. Run <code>npm run dev</code> and open <code>http://localhost:3000</code>'
      : 'Failed to load data. Please try again later.';
    document.getElementById('api-tbody').innerHTML =
      `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">
        ${message}
      </td></tr>`;
  }
}

init();
