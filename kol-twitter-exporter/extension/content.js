// ============ KOL Signal 导出器：X(Twitter) 主页推文 → 按月 Markdown 归档 ============
// 参照：得到Clippings导出器(dedao-clippings-exporter) 的目录句柄持久化 + 直写文件模式

(function () {
  'use strict';

  const APP = 'kol-signal-exporter-v1';
  const VERSION = '1.8';
  const DB_NAME = 'kolSignalExportDb';
  const DB_STORE = 'handles';
  const DIR_KEY = 'kolLibraryDir';
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  clearExistingUi();
  boot();

  function boot() {
    if (!document.body) {
      setTimeout(boot, 200);
      return;
    }

    const panel = document.createElement('div');
    panel.id = `${APP}-panel`;
    panel.style.cssText = `
      position: fixed; top: 16px; right: 24px; z-index: 2147483647;
      display: flex; flex-direction: column; gap: 8px; width: 260px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: 14px; box-shadow: 0 8px 28px rgba(0,0,0,.16);
    `;

    const defaultHandle = guessHandleFromUrl();
    const defaultMonth = monthString(new Date());

    panel.innerHTML = `
      <div style="font-size:13px;font-weight:700;color:#0f172a;">KOL Signal 导出器 v${VERSION}</div>
      <label style="font-size:12px;color:#475569;">KOL名（存档文件夹名）</label>
      <input id="${APP}-kol" value="${escapeAttr(defaultHandle)}" style="${inputStyle()}" />
      <label style="font-size:12px;color:#475569;">目标月份 (YYYY-MM)</label>
      <input id="${APP}-month" value="${escapeAttr(defaultMonth)}" style="${inputStyle()}" />
      <button id="${APP}-dir-btn" style="${buttonStyle('#334155')}">① 选择/确认 KOL情报库 文件夹</button>
      <button id="${APP}-run-btn" style="${buttonStyle('#059669')}">② 开始抓取本月推文</button>
      <button id="${APP}-stop-btn" style="${buttonStyle('#dc2626')}">停止</button>
    `;

    const status = document.createElement('div');
    status.id = `${APP}-status`;
    status.style.cssText = `
      position: fixed; top: 16px; right: 296px; z-index: 2147483647;
      display: none; width: 320px; max-height: 70vh; overflow: auto;
      white-space: pre-wrap; background: #111827; color: #f9fafb;
      padding: 12px 16px; border-radius: 10px; font-size: 12px; line-height: 1.55;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,.28);
    `;

    document.body.appendChild(panel);
    document.body.appendChild(status);

    let stopRequested = false;
    document.getElementById(`${APP}-dir-btn`).onclick = handleChooseDir;
    document.getElementById(`${APP}-stop-btn`).onclick = () => { stopRequested = true; setStatus('已请求停止，等待当前滚动结束…'); };
    document.getElementById(`${APP}-run-btn`).onclick = () => {
      stopRequested = false;
      handleRun(() => stopRequested);
    };

    console.log(`[KOL Signal导出器] v${VERSION} ready`, location.href);
  }

  function clearExistingUi() {
    document.getElementById(`${APP}-panel`)?.remove();
    document.getElementById(`${APP}-status`)?.remove();
  }

  // ---------- UI helpers ----------

  function inputStyle() {
    return 'width:100%;box-sizing:border-box;padding:7px 9px;font-size:13px;border:1px solid #cbd5e1;border-radius:7px;margin-bottom:2px;';
  }

  function buttonStyle(bg) {
    return `background:${bg};color:#fff;border:0;border-radius:8px;padding:9px 10px;font-size:13px;font-weight:600;cursor:pointer;`;
  }

  function escapeAttr(value) {
    return String(value ?? '').replace(/"/g, '&quot;');
  }

  function setStatus(text) {
    const el = document.getElementById(`${APP}-status`);
    if (!el) return;
    el.style.display = 'block';
    el.textContent = text;
  }

  function guessHandleFromUrl() {
    const match = location.pathname.match(/^\/([^/]+)\/?$/);
    return match ? match[1] : '';
  }

  function monthString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function safeFileName(name) {
    return String(name || '未命名').replace(/[\\/:*?"<>|]/g, '_').trim() || '未命名';
  }

  // ---------- IndexedDB directory handle persistence (同dedao模式) ----------

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function storeDir(handle) {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(handle, DIR_KEY);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  }

  async function getStoredDir() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(DIR_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async function ensureDirPermission(dir, request) {
    const options = { mode: 'readwrite' };
    if ((await dir.queryPermission(options)) === 'granted') return 'granted';
    if (request && (await dir.requestPermission(options)) === 'granted') return 'granted';
    return 'prompt';
  }

  async function verifyWritable(dir) {
    // 从IndexedDB恢复的handle，queryPermission可能显示granted但实际写入会报NotFoundError
    // ——所以选完文件夹后立刻实测一次真实写入，而不是只信任权限状态
    const testName = '.kol-signal-write-test';
    const handle = await dir.getFileHandle(testName, { create: true });
    const writable = await handle.createWritable();
    await writable.write('ok');
    await writable.close();
    await dir.removeEntry(testName);
  }

  async function chooseKolLibraryDir(forceFresh) {
    if (!window.showDirectoryPicker) {
      throw new Error('当前Chrome不支持直接选择文件夹，请升级Chrome版本。');
    }
    if (!forceFresh) {
      const existing = await getStoredDir();
      if (existing && await ensureDirPermission(existing, true) === 'granted') return existing;
    }
    const dir = await window.showDirectoryPicker({ id: 'kol-signal-library', mode: 'readwrite' });
    await storeDir(dir);
    return dir;
  }

  async function handleChooseDir() {
    try {
      // 点这个按钮永远强制重新选一次——避免复用一个已经失效的旧引用
      const dir = await chooseKolLibraryDir(true);
      await verifyWritable(dir);
      setStatus(`✅ 已选择并验证可写：${dir.name}\n（确认是「05-信号情报/KOL情报库」这个文件夹）现在可以点②开始抓取了`);
    } catch (err) {
      setStatus(`选择/验证文件夹失败(${err.name || 'Error'})：${err.message}`);
    }
  }

  // ---------- 推文抓取 ----------

  function parseAriaCount(button) {
    const label = button?.getAttribute('aria-label') || '';
    const match = label.match(/^([\d,.]+[KMkm]?)/);
    return match ? match[1] : '0';
  }

  function extractQuote(article, mainTimeEl, mainTextEl) {
    const allTimes = Array.from(article.querySelectorAll('time[datetime]'));
    const quoteTimeEl = allTimes.find(t => t !== mainTimeEl);
    if (!quoteTimeEl) return null;

    const allTexts = Array.from(article.querySelectorAll('[data-testid="tweetText"]'));
    const quoteTextEl = allTexts.find(t => t !== mainTextEl);

    const names = Array.from(article.querySelectorAll('[data-testid="User-Name"]'));
    const quoteNameEl = names.length > 1 ? names[names.length - 1] : null;
    const author = (quoteNameEl?.innerText || quoteNameEl?.textContent || '').replace(/\s+/g, ' ').trim();

    // 引用卡片自己的图/视频封面（跟主图分开抓，避免混在一起分不清是谁发的）
    const quoteScope = quoteTimeEl.closest('div[role="link"]') || article;
    const images = extractImages(quoteScope);

    return {
      datetime: quoteTimeEl.getAttribute('datetime'),
      text: (quoteTextEl?.innerText || quoteTextEl?.textContent || '').trim(),
      author,
      images,
    };
  }

  function upgradeImageQuality(url) {
    return url.replace(/([?&]name=)\w+/, '$1large');
  }

  function extractImages(scope) {
    // 不依赖具体data-testid（X的markup会变），直接按图片实际域名/路径识别，更抗改版
    const media = Array.from(scope.querySelectorAll('img[src*="pbs.twimg.com/media"]'))
      .map(img => upgradeImageQuality(img.src));
    const posters = Array.from(scope.querySelectorAll('video[poster]'))
      .map(v => v.getAttribute('poster'));
    return Array.from(new Set([...media, ...posters])).filter(Boolean);
  }

  function extractSocialContext(article) {
    const el = article.querySelector('[data-testid="socialContext"]');
    const text = el ? (el.innerText || el.textContent || '').trim() : '';
    return text || null;
  }

  function extractTweet(article) {
    const timeEl = article.querySelector('time[datetime]');
    if (!timeEl) return null;
    const datetime = timeEl.getAttribute('datetime');
    const permalinkEl = timeEl.closest('a[href*="/status/"]');
    const href = permalinkEl?.getAttribute('href') || '';
    const idMatch = href.match(/status\/(\d+)/);
    const id = idMatch ? idMatch[1] : datetime + Math.random();

    const isAd = !!article.querySelector('[data-testid="placementTracking"]');
    if (isAd) return null;

    const textEl = article.querySelector('[data-testid="tweetText"]');
    const text = (textEl?.innerText || textEl?.textContent || '').trim();

    const quote = extractQuote(article, timeEl, textEl);
    // 主体图/视频封面：排除掉已经算进quote.images的（避免引用卡片里的图被重复计入主体）
    const allImages = extractImages(article);
    const images = quote ? allImages.filter(src => !quote.images.includes(src)) : allImages;

    const author = (() => {
      const nameEl = article.querySelector('[data-testid="User-Name"]');
      return nameEl ? (nameEl.innerText || nameEl.textContent || '').replace(/\s+/g, ' ').trim() : '';
    })();
    const context = extractSocialContext(article);

    if (!text && images.length === 0 && !quote) return null; // 纯空壳（无文字无图无引用）大概率是解析失败，跳过

    const replyBtn = article.querySelector('[data-testid="reply"]');
    const retweetBtn = article.querySelector('[data-testid="retweet"]');
    const likeBtn = article.querySelector('[data-testid="like"]');

    return {
      id,
      datetime,
      text,
      author,
      context,
      reply: parseAriaCount(replyBtn),
      retweet: parseAriaCount(retweetBtn),
      like: parseAriaCount(likeBtn),
      quote,
      images,
    };
  }

  function collectVisibleTweets() {
    return Array.from(document.querySelectorAll('article[data-testid="tweet"]'))
      .map(extractTweet)
      .filter(Boolean);
  }

  function expandTruncatedTweets() {
    // 长推文在时间线里默认折叠，有"显示更多"按钮——不点开的话tweetText只读到截断预览
    const links = document.querySelectorAll('[data-testid="tweet-text-show-more-link"]');
    links.forEach(link => link.click());
    return links.length;
  }

  async function scrollAndCollect(monthStart, monthEnd, isStopped, onProgress) {
    const seen = new Map();
    let staleRounds = 0;
    let outOfRangeStreak = 0;
    const MAX_ROUNDS = 500;
    const MAX_STALE = 8;
    const MAX_OUT_OF_RANGE = 6;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      if (isStopped()) break;

      const expanded = expandTruncatedTweets();
      if (expanded > 0) await sleep(400);

      const before = seen.size;
      for (const tweet of collectVisibleTweets()) {
        if (seen.has(tweet.id)) continue;
        const d = new Date(tweet.datetime);
        if (d > monthEnd) continue; // 比目标月份新，还没滚动到目标区间，继续滚
        if (d < monthStart) {
          outOfRangeStreak += 1;
          continue;
        }
        outOfRangeStreak = 0;
        seen.set(tweet.id, tweet);
      }

      onProgress(seen.size, round);

      if (outOfRangeStreak >= MAX_OUT_OF_RANGE) break;

      const gained = seen.size - before;
      if (gained === 0) {
        staleRounds += 1;
      } else {
        staleRounds = 0;
      }
      if (staleRounds >= MAX_STALE) break;

      window.scrollBy(0, Math.round(window.innerHeight * 0.85));
      await sleep(850);
    }

    return Array.from(seen.values());
  }

  function formatStamp(datetime) {
    const dt = new Date(datetime);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
  }

  function formatTweetBlock(t) {
    const lines = [`<!-- id:${t.id} -->`, `## [${formatStamp(t.datetime)}]`];
    if (t.context && !/^已置顶|^Pinned/.test(t.context)) {
      lines.push(`🔁 ${t.context}`); // 纯转发(无自己评论)时，作者其实是被转发的原作者，不是本KOL
    }
    if (t.author) lines.push(`作者：${t.author}`);
    lines.push(t.text || '(无文字——见下方配图/引用)');
    lines.push(`互动：转发${t.retweet} · 点赞${t.like} · 回复${t.reply}`);
    if (t.quote) {
      lines.push(`引用 ${t.quote.author || '(未知作者)'}（${t.quote.datetime ? formatStamp(t.quote.datetime) : '时间未知'}）：${t.quote.text || '(未能读取引用文字，见其配图)'}`);
      if (t.quote.images && t.quote.images.length) lines.push(...t.quote.images.map(p => `![](${p})`));
    }
    if (t.images && t.images.length) {
      lines.push(...t.images.map(p => `![](${p})`));
    }
    return lines.join('\n');
  }

  function buildMarkdown(kolName, month, sourceUrl, tweets) {
    const sorted = tweets.slice().sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    const body = sorted.map(formatTweetBlock).join('\n\n');

    const frontmatter = [
      '---',
      `kol: "${kolName}"`,
      `month: "${month}"`,
      `source: "${sourceUrl}"`,
      `updated: ${today()}`,
      `tweet_count: ${sorted.length}`,
      '---',
    ].join('\n');

    return `${frontmatter}\n\n${body}\n`;
  }

  function extractExistingIds(content) {
    const ids = new Set();
    const re = /<!--\s*id:(\d+)\s*-->/g;
    let m;
    while ((m = re.exec(content))) ids.add(m[1]);
    return ids;
  }

  function parseExistingTweets(content) {
    // 从已有MD反解出tweet对象，供合并重排用（不重新计算互动，只保留原样本文块）
    const blocks = content.split(/(?=<!--\s*id:\d+\s*-->)/).filter(b => b.trim().startsWith('<!--'));
    return blocks.map(block => {
      const idMatch = block.match(/id:(\d+)/);
      const stampMatch = block.match(/## \[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\]/);
      return {
        id: idMatch ? idMatch[1] : null,
        datetime: stampMatch ? stampMatch[1].replace(' ', 'T') : null,
        rawBlock: block.trim(),
      };
    }).filter(t => t.id);
  }

  async function withRetry(fn, label, attempts = 3, delayMs = 250) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (err) {
        lastErr = err;
        if (i < attempts - 1) await sleep(delayMs);
      }
    }
    const wrapped = new Error(`[${label}] ${lastErr.name || 'Error'}: ${lastErr.message}`);
    wrapped.name = lastErr.name;
    throw wrapped;
  }

  async function writeMerged(dir, kolName, month, sourceUrl, newTweets) {
    const folder = await withRetry(() => dir.getDirectoryHandle(safeFileName(kolName), { create: true }), '打开KOL文件夹');
    const filename = `${month}.md`;
    let existingContent = '';
    try {
      const handle = await folder.getFileHandle(filename, { create: false });
      const file = await handle.getFile();
      existingContent = await file.text();
    } catch (_) {
      existingContent = '';
    }

    const existingIds = extractExistingIds(existingContent);
    // 配图直接嵌入X的原始URL（跟得到课程transcript同一种做法），不下载到本地
    const trulyNew = newTweets.filter(t => !existingIds.has(t.id));

    let finalMarkdown;
    if (existingContent) {
      const existingTweets = parseExistingTweets(existingContent);
      const merged = existingTweets
        .map(t => ({ id: t.id, datetime: t.datetime, rawBlock: t.rawBlock }))
        .concat(trulyNew.map(t => ({ id: t.id, datetime: t.datetime, rawBlock: formatTweetBlock(t) })))
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

      const body = merged.map(m => m.rawBlock).join('\n\n');
      const frontmatter = [
        '---',
        `kol: "${kolName}"`,
        `month: "${month}"`,
        `source: "${sourceUrl}"`,
        `updated: ${today()}`,
        `tweet_count: ${merged.length}`,
        '---',
      ].join('\n');
      finalMarkdown = `${frontmatter}\n\n${body}\n`;
    } else {
      finalMarkdown = buildMarkdown(kolName, month, sourceUrl, trulyNew);
    }

    await withRetry(async () => {
      const handle = await folder.getFileHandle(filename, { create: true });
      const writable = await handle.createWritable();
      await writable.write(finalMarkdown);
      await writable.close();
    }, `写主文件${filename}`);

    return { added: trulyNew.length, total: existingIds.size + trulyNew.length };
  }

  async function handleRun(isStopped) {
    const kolName = document.getElementById(`${APP}-kol`).value.trim() || guessHandleFromUrl();
    const month = document.getElementById(`${APP}-month`).value.trim() || monthString(new Date());
    const sourceUrl = location.origin + '/' + guessHandleFromUrl();

    if (!/^\d{4}-\d{2}$/.test(month)) {
      setStatus('月份格式不对，应为 YYYY-MM，例如 2026-07');
      return;
    }

    let dir;
    try {
      dir = await chooseKolLibraryDir();
    } catch (err) {
      setStatus(`未选择文件夹：${err.message}`);
      return;
    }

    const [y, m] = month.split('-').map(Number);
    const monthStart = new Date(y, m - 1, 1, 0, 0, 0);
    const monthEnd = new Date(y, m, 0, 23, 59, 59);

    setStatus(`开始抓取 @${kolName} ${month} 的推文…\n正在滚动加载…`);

    const tweets = await scrollAndCollect(monthStart, monthEnd, isStopped, (count, round) => {
      setStatus(`@${kolName} ${month}\n已抓取 ${count} 条推文（滚动第${round + 1}轮）…`);
    });

    if (tweets.length === 0) {
      setStatus(`@${kolName} ${month}\n没有抓到新推文——可能这个月份还没内容，或已经全部合并过了。`);
      return;
    }

    try {
      const result = await writeMerged(dir, kolName, month, sourceUrl, tweets);
      setStatus(`✅ 完成\n@${kolName} → ${dir.name}/${safeFileName(kolName)}/${month}.md\n本次新增 ${result.added} 条，文件累计 ${result.total} 条。`);
    } catch (err) {
      const isFolderStale = /打开KOL文件夹/.test(err.message);
      const hint = isFolderStale
        ? '文件夹引用失效了——先点一下上面「①选择/确认 KOL情报库 文件夹」重新选一次同一个文件夹（会自动验证可写），再点②重跑，本次已抓到的推文不会丢。'
        : '已自动重试3次仍失败——可以再点一次「开始抓取本月推文」，本次已抓到的推文不会丢，重跑会跳过已存的部分。';
      setStatus(`写入失败(${err.name || 'Error'})：${err.message}\n${hint}`);
    }
  }
})();
