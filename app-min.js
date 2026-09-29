
const reviewItems = window.reviewItems || [];
const problems = window.problems || [];
const app = document.getElementById("app");
const toastEl = document.getElementById("toast");
const STORAGE_KEY = "imyongcode:v2";

let state = loadState();
let view = { mode: "review", lang: "C", reviewIndex: 0, diagIndex: 0, reveal: false };

function loadState() {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (current) return { review: current.review || {}, diagnostic: current.diagnostic || {} };
    const old = JSON.parse(localStorage.getItem("imyongcode:v1"));
    if (old) return { review: old.review || {}, diagnostic: old.diagnostic || {} };
  } catch {}
  return { review: {}, diagnostic: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function esc(v) {
  return String(v == null ? "" : v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1200);
}

function reviewList() {
  return reviewItems.filter(function (x) { return x.lang === view.lang; });
}

function diagList() {
  return problems.filter(function (x) { return x.lang === view.lang; });
}

function syncNav() {
  document.querySelectorAll(".study-nav button").forEach(function (btn) {
    const sameMode = btn.dataset.go === view.mode;
    const sameLang = !btn.dataset.lang || btn.dataset.lang === view.lang;
    btn.classList.toggle("active", sameMode && sameLang);
  });
}

function go(mode, lang) {
  view.mode = mode;
  if (lang) view.lang = lang;
  view.reveal = false;

  if (mode === "review") {
    const list = reviewList();
    const first = list.findIndex(function (x) { return !state.review[x.id]; });
    view.reviewIndex = first >= 0 ? first : 0;
  }

  if (mode === "diagnostic") {
    const list = diagList();
    const first = list.findIndex(function (x) { return !state.diagnostic[x.id] || !state.diagnostic[x.id].grade; });
    view.diagIndex = first >= 0 ? first : 0;
  }

  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  syncNav();
  if (view.mode === "review") renderReview();
  else if (view.mode === "diagnostic") renderDiagnostic();
  else renderWeak();
}

function renderReview() {
  const list = reviewList();
  if (!list.length) return;
  view.reviewIndex = Math.max(0, Math.min(view.reviewIndex, list.length - 1));
  const item = list[view.reviewIndex];
  const status = state.review[item.id];
  const done = list.filter(function (x) { return !!state.review[x.id]; }).length;
  const show = view.reveal || status === "unsure" || status === "unknown";

  let html = "";
  html += '<div class="topline progress"><span>' + esc(view.lang) + ' 훑기</span><span>' + (view.reviewIndex + 1) + ' / ' + list.length + ' · 완료 ' + done + '</span></div>';
  html += '<section class="card">';
  html += '<div class="meta">10초 안에 판단</div>';
  html += '<h1>' + esc(item.title) + '</h1>';
  html += '<p class="prompt">' + esc(item.prompt) + '</p>';

  if (show) {
    html += '<div class="explain"><ul>';
    item.bullets.forEach(function (b) { html += '<li>' + esc(b) + '</li>'; });
    html += '</ul><pre>' + esc(item.code) + '</pre></div>';
  }

  html += '<div class="actions">';
  html += '<button class="action good" data-act="review-grade" data-grade="known">1 · 바로 앎</button>';
  html += '<button class="action warn" data-act="review-grade" data-grade="unsure">2 · 애매</button>';
  html += '<button class="action bad" data-act="review-grade" data-grade="unknown">3 · 모름</button>';
  if (!show) html += '<button class="action" data-act="review-reveal">설명 보기</button>';
  html += '</div>';

  html += '<div class="actions row">';
  html += '<button class="action" data-act="review-prev"' + (view.reviewIndex === 0 ? ' disabled' : '') + '>←</button>';
  html += '<button class="action" data-act="review-next"' + (view.reviewIndex === list.length - 1 ? ' disabled' : '') + '>→</button>';
  html += '</div>';
  html += '</section>';

  if (done === list.length) {
    html += '<div class="actions"><button class="action primary" data-go="diagnostic" data-lang="' + esc(view.lang) + '">' + esc(view.lang) + ' 진단 시작</button></div>';
  }

  app.innerHTML = html;
}

function normalize(v) {
  return String(v || "").trim().replace(/\r/g, "").replace(/\s+/g, " ").replace(/\s*,\s*/g, ",");
}

function canAutoCheck(p) {
  return p.kind === "predict" && p.id !== "P07";
}

function isCorrect(p, answer) {
  const got = normalize(answer);
  const expected = normalize(p.answer);
  if (p.id === "P01") {
    const m = got.match(/^2\s+([0-9.]+)\s+1$/);
    return !!m && Number(m[1]) > 2.33 && Number(m[1]) < 2.34;
  }
  return got === expected;
}

function renderDiagnostic() {
  const list = diagList();
  if (!list.length) return;
  view.diagIndex = Math.max(0, Math.min(view.diagIndex, list.length - 1));
  const p = list[view.diagIndex];
  const saved = state.diagnostic[p.id] || {};
  const graded = list.filter(function (x) { return state.diagnostic[x.id] && state.diagnostic[x.id].grade; }).length;

  let html = "";
  html += '<div class="topline progress"><span>' + esc(view.lang) + ' 진단</span><span>' + esc(p.id) + ' · ' + graded + ' / ' + list.length + ' 완료</span></div>';
  html += '<div class="problem-grid">';
  list.forEach(function (x, i) {
    const g = state.diagnostic[x.id] && state.diagnostic[x.id].grade ? state.diagnostic[x.id].grade : "";
    html += '<button data-act="diag-jump" data-index="' + i + '" class="' + (i === view.diagIndex ? 'current ' : '') + g + '">' + (i + 1) + '</button>';
  });
  html += '</div>';

  html += '<section class="card">';
  html += '<div class="meta">' + (p.kind === "predict" ? '출력 추적' : '코드 작성') + ' · ' + esc(p.topic) + '</div>';
  html += '<h1>' + esc(p.title) + '</h1>';
  html += '<p class="prompt">' + esc(p.prompt) + '</p>';

  if (p.code) html += '<pre>' + esc(p.code) + '</pre>';

  if (p.sampleIn) {
    html += '<div class="sample">';
    html += '<div><strong>입력</strong><pre>' + esc(p.sampleIn) + '</pre></div>';
    html += '<div><strong>출력</strong><pre>' + esc(p.sampleOut) + '</pre></div>';
    html += '</div>';
  }

  if (p.kind === "predict") {
    html += '<textarea class="answer" data-act="answer" data-id="' + esc(p.id) + '" placeholder="예상 출력">' + esc(saved.answer || "") + '</textarea>';
  } else {
    html += '<textarea class="code" data-act="answer" data-id="' + esc(p.id) + '" placeholder="' + (p.lang === "C" ? '// C 코드' : '# Python 코드') + '">' + esc(saved.answer || "") + '</textarea>';
  }

  html += '<div class="actions">';
  if (canAutoCheck(p)) html += '<button class="action primary" data-act="diag-check">채점</button>';
  else html += '<button class="action primary" data-act="diag-reveal">정답 기준 보기</button>';
  if (p.code) html += '<button class="action" data-act="copy-given">문제 코드 복사</button>';
  if (p.kind === "code") html += '<button class="action" data-act="copy-answer">내 코드 복사</button>';
  html += '<a class="action" href="https://www.mycompiler.io/" target="_blank" rel="noreferrer">MyCompiler ↗</a>';
  html += '</div>';

  if (saved.checked || saved.revealed) {
    const cls = saved.grade || (saved.correct ? "good" : "");
    html += '<div class="result ' + cls + '">';
    html += '<b>' + (saved.checked ? (saved.correct ? '정답' : '오답') : '정답 기준') + '</b>';
    html += '<div style="margin-top:6px;white-space:pre-wrap">' + esc(p.answer) + '</div>';
    html += '<div class="meta" style="margin-top:6px">' + esc(p.explanation) + '</div>';
    html += '</div>';

    html += '<div class="actions">';
    html += '<button class="action good" data-act="diag-grade" data-grade="good">바로 풀림</button>';
    html += '<button class="action warn" data-act="diag-grade" data-grade="unsure">헷갈림</button>';
    html += '<button class="action bad" data-act="diag-grade" data-grade="bad">틀림</button>';
    html += '</div>';
  }

  if (saved.grade === "bad" || saved.grade === "unsure") {
    const reasons = ["문법 기억 안 남", "추적 실수", "작성 막힘", "조건/입력 실수"];
    html += '<div class="reason-box">';
    reasons.forEach(function (reason) {
      html += '<button data-act="set-reason" data-reason="' + esc(reason) + '" class="' + (saved.reason === reason ? 'selected' : '') + '">' + esc(reason) + '</button>';
    });
    html += '</div>';
  }

  html += '<div class="actions row">';
  html += '<button class="action" data-act="diag-prev"' + (view.diagIndex === 0 ? ' disabled' : '') + '>←</button>';
  html += '<button class="action" data-act="diag-next"' + (view.diagIndex === list.length - 1 ? ' disabled' : '') + '>→</button>';
  html += '</div>';
  html += '</section>';

  app.innerHTML = html;
}

function weakQuestions() {
  return problems.filter(function (p) {
    const g = state.diagnostic[p.id] && state.diagnostic[p.id].grade;
    return g === "bad" || g === "unsure";
  });
}

function weakReviews() {
  return reviewItems.filter(function (x) {
    const g = state.review[x.id];
    return g === "unknown" || g === "unsure";
  });
}

function buildPrompt() {
  const q = weakQuestions();
  const r = weakReviews();
  const wrong = q.filter(function (x) { return state.diagnostic[x.id].grade === "bad"; })
    .map(function (x) {
      const reason = state.diagnostic[x.id].reason;
      return x.id + (reason ? "(" + reason + ")" : "");
    });
  const unsure = q.filter(function (x) { return state.diagnostic[x.id].grade === "unsure"; })
    .map(function (x) {
      const reason = state.diagnostic[x.id].reason;
      return x.id + (reason ? "(" + reason + ")" : "");
    });
  const review = r.map(function (x) {
    return x.lang + " " + x.title + "(" + (state.review[x.id] === "unknown" ? "모름" : "애매") + ")";
  });

  return [
    "틀린 문제: " + (wrong.join(", ") || "없음"),
    "헷갈린 문제: " + (unsure.join(", ") || "없음"),
    "문법 훑기 약점: " + (review.join(", ") || "없음"),
    "",
    "위 결과 기준으로 약한 문법만 30~40분짜리 복습 자료로 설명하고, 같은 약점을 확인하는 추가 진단 8문제를 만들어줘. 이미 아는 부분은 반복하지 말고 실행 전에 종이로 추적하는 방식으로 구성해줘."
  ].join("\n");
}

function renderWeak() {
  const q = weakQuestions();
  const r = weakReviews();
  let html = '<div class="topline progress"><span>약점</span><span>' + (q.length + r.length) + '개</span></div>';

  if (!q.length && !r.length) {
    html += '<section class="card">아직 약점 기록이 없습니다.</section>';
    app.innerHTML = html;
    return;
  }

  html += '<div class="weak-list">';
  q.forEach(function (p) {
    const s = state.diagnostic[p.id];
    html += '<div class="weak-item"><b>' + esc(p.id) + '</b><small>' + esc(p.topic) + (s.reason ? ' · ' + esc(s.reason) : '') + '</small></div>';
  });
  r.forEach(function (x) {
    html += '<div class="weak-item"><b>' + esc(x.lang) + '</b><small>' + esc(x.title) + ' · ' + (state.review[x.id] === "unknown" ? '모름' : '애매') + '</small></div>';
  });
  html += '</div>';

  html += '<div class="prompt-copy">';
  html += '<textarea id="weakPrompt" readonly>' + esc(buildPrompt()) + '</textarea>';
  html += '<div class="actions">';
  html += '<button class="action primary" data-act="copy-prompt">프롬프트 복사</button>';
  html += '<button class="action bad" data-act="reset">기록 초기화</button>';
  html += '</div></div>';
  app.innerHTML = html;
}

document.addEventListener("click", function (e) {
  const goBtn = e.target.closest("[data-go]");
  if (goBtn) {
    go(goBtn.dataset.go, goBtn.dataset.lang);
    return;
  }

  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;

  if (act === "review-reveal") {
    view.reveal = true;
    renderReview();
    return;
  }

  if (act === "review-grade") {
    const list = reviewList();
    const item = list[view.reviewIndex];
    state.review[item.id] = el.dataset.grade;
    saveState();

    if (el.dataset.grade === "known" && view.reviewIndex < list.length - 1) {
      view.reviewIndex += 1;
      view.reveal = false;
    } else {
      view.reveal = true;
    }
    renderReview();
    return;
  }

  if (act === "review-prev" || act === "review-next") {
    const list = reviewList();
    const delta = act === "review-prev" ? -1 : 1;
    view.reviewIndex = Math.max(0, Math.min(list.length - 1, view.reviewIndex + delta));
    view.reveal = false;
    renderReview();
    return;
  }

  if (act === "diag-jump") {
    view.diagIndex = Number(el.dataset.index);
    renderDiagnostic();
    return;
  }

  if (act === "diag-prev" || act === "diag-next") {
    const list = diagList();
    const delta = act === "diag-prev" ? -1 : 1;
    view.diagIndex = Math.max(0, Math.min(list.length - 1, view.diagIndex + delta));
    renderDiagnostic();
    return;
  }

  if (act === "diag-check") {
    const p = diagList()[view.diagIndex];
    const saved = state.diagnostic[p.id] || {};
    if (!String(saved.answer || "").trim()) {
      toast("답을 먼저 입력");
      return;
    }
    const correct = isCorrect(p, saved.answer);
    state.diagnostic[p.id] = Object.assign({}, saved, {
      checked: true,
      revealed: true,
      correct: correct,
      grade: correct ? "good" : "bad"
    });
    saveState();
    renderDiagnostic();
    return;
  }

  if (act === "diag-reveal") {
    const p = diagList()[view.diagIndex];
    state.diagnostic[p.id] = Object.assign({}, state.diagnostic[p.id] || {}, { revealed: true });
    saveState();
    renderDiagnostic();
    return;
  }

  if (act === "diag-grade") {
    const list = diagList();
    const p = list[view.diagIndex];
    state.diagnostic[p.id] = Object.assign({}, state.diagnostic[p.id] || {}, { grade: el.dataset.grade });
    saveState();
    if (view.diagIndex < list.length - 1) view.diagIndex += 1;
    renderDiagnostic();
    return;
  }

  if (act === "set-reason") {
    const p = diagList()[view.diagIndex];
    state.diagnostic[p.id] = Object.assign({}, state.diagnostic[p.id] || {}, { reason: el.dataset.reason });
    saveState();
    renderDiagnostic();
    return;
  }

  if (act === "copy-given") {
    const p = diagList()[view.diagIndex];
    navigator.clipboard.writeText(p.code || "").then(function () { toast("복사됨"); });
    return;
  }

  if (act === "copy-answer") {
    const p = diagList()[view.diagIndex];
    navigator.clipboard.writeText((state.diagnostic[p.id] && state.diagnostic[p.id].answer) || "").then(function () { toast("복사됨"); });
    return;
  }

  if (act === "copy-prompt") {
    navigator.clipboard.writeText(buildPrompt()).then(function () { toast("복사됨"); });
    return;
  }

  if (act === "reset") {
    if (confirm("모든 학습 기록을 초기화할까요?")) {
      state = { review: {}, diagnostic: {} };
      saveState();
      renderWeak();
    }
  }
});

document.addEventListener("input", function (e) {
  const el = e.target.closest('[data-act="answer"]');
  if (!el) return;
  const id = el.dataset.id;
  state.diagnostic[id] = Object.assign({}, state.diagnostic[id] || {}, { answer: el.value });
  saveState();
});

document.addEventListener("keydown", function (e) {
  if (document.activeElement && ["TEXTAREA", "INPUT"].includes(document.activeElement.tagName)) return;

  if (view.mode === "review" && ["1", "2", "3"].includes(e.key)) {
    const grades = { "1": "known", "2": "unsure", "3": "unknown" };
    const list = reviewList();
    const item = list[view.reviewIndex];
    state.review[item.id] = grades[e.key];
    saveState();
    if (e.key === "1" && view.reviewIndex < list.length - 1) {
      view.reviewIndex += 1;
      view.reveal = false;
    } else {
      view.reveal = true;
    }
    renderReview();
  }

  if (view.mode === "diagnostic") {
    const list = diagList();
    if (e.key === "ArrowLeft") {
      view.diagIndex = Math.max(0, view.diagIndex - 1);
      renderDiagnostic();
    }
    if (e.key === "ArrowRight") {
      view.diagIndex = Math.min(list.length - 1, view.diagIndex + 1);
      renderDiagnostic();
    }
  }
});

render();
