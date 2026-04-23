// ============================================================
// WC2026 BET - Main Application
// ============================================================
(function () {
    'use strict';

    // --- STATE ---
    let currentUser = JSON.parse(localStorage.getItem('wc2026_user')) || null;
    let userBets = [];
    let allMatches = [];
    let selectedBet = null;
    let customMatchOdds = {};
    let customChampOdds = {};
    let customSpecialOdds = {};

    // --- INIT ---
    async function init() {
        generateParticles();
        allMatches = [...generateGroupMatches(), ...generateKnockoutMatches(73)];
        // Fetch shared data from server
        try {
            const odds = await API.getOdds();
            customMatchOdds = odds.match || {};
            customChampOdds = odds.champ || {};
            customSpecialOdds = odds.special || {};
            if (currentUser) {
                const freshUser = await API.getUser(currentUser.name);
                if (freshUser) currentUser = freshUser;
                localStorage.setItem('wc2026_user', JSON.stringify(currentUser));
                userBets = await API.getUserBets(currentUser.name);
            }
        } catch (e) { console.warn('API unavailable, using offline mode'); }
        setupNavigation();
        setupCountdown();
        renderFeaturedMatches();
        renderStats();
        renderFavorites();
        renderGroups();
        renderAllMatches('all');
        renderBettingPanels();
        renderLeaderboard();
        setupModals();
        setupFilters();
        setupBettingTabs();
        renderBettingOverview();
        setupHistoryFilters();
        if (currentUser) updateUserUI();
        else showLogin();
        populateTeamSelect();
    }

    // --- PARTICLES ---
    function generateParticles() {
        const c = document.getElementById('particles');
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 2;
            p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 10}s;animation-duration:${10 + Math.random() * 15}s`;
            c.appendChild(p);
        }
    }

    // --- NAVIGATION ---
    function setupNavigation() {
        document.querySelectorAll('[data-page]').forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                navigateTo(el.dataset.page);
            });
        });
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.querySelector('.nav').classList.toggle('show');
        });
        document.getElementById('hero-bet-btn').addEventListener('click', () => navigateTo('betting'));
        document.getElementById('hero-schedule-btn').addEventListener('click', () => navigateTo('matches'));
    }

    function navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById('page-' + page)?.classList.add('active');
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        document.querySelector('.nav').classList.remove('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (page === 'betting') renderMyBets();
        if (page === 'history') renderBetHistory();
    }

    // --- COUNTDOWN ---
    function setupCountdown() {
        const target = new Date('2026-06-11T18:00:00-05:00');
        function update() {
            const now = new Date();
            const diff = target - now;
            if (diff <= 0) {
                document.getElementById('cd-days').textContent = '🎉';
                document.getElementById('cd-hours').textContent = 'LIVE';
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
            document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
            document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
            document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
        }
        update();
        setInterval(update, 1000);
    }

    // --- RENDER FEATURED MATCHES ---
    function renderFeaturedMatches() {
        const container = document.getElementById('featured-matches');
        const featured = allMatches.filter(m => m.stage === 'group').slice(0, 6);
        container.innerHTML = featured.map(m => createMatchCard(m)).join('');
    }

    function createMatchCard(m) {
        const f1 = WC2026.flags[m.team1] || '🏳️';
        const f2 = WC2026.flags[m.team2] || '🏳️';
        const odds = calculateOdds(m.team1, m.team2, m.id);
        const stage = m.stageLabel || `Bảng ${m.group}`;
        const dateStr = formatDate(m.date);
        return `
        <div class="match-card" data-match-id="${m.id}">
            <div class="match-card-header">
                <span class="match-stage">${stage}</span>
                <span>${dateStr} • ${m.time}</span>
            </div>
            <div class="match-teams">
                <div class="match-team">
                    <span class="match-team-flag">${f1}</span>
                    <span class="match-team-name">${m.team1}</span>
                </div>
                <span class="match-vs">VS</span>
                <div class="match-team">
                    <span class="match-team-flag">${f2}</span>
                    <span class="match-team-name">${m.team2}</span>
                </div>
            </div>
            <div class="match-info">
                <span>📍 ${m.venue}</span>
            </div>
            <div class="match-odds">
                <div class="odd-btn" onclick="app.selectOdd(${m.id},'1','${m.team1}',${odds.home})">
                    <span class="odd-label">${m.team1}</span>
                    <span class="odd-value">${odds.home.toFixed(2)}</span>
                </div>
                <div class="odd-btn" onclick="app.selectOdd(${m.id},'X','Hòa',${odds.draw})">
                    <span class="odd-label">Hòa</span>
                    <span class="odd-value">${odds.draw.toFixed(2)}</span>
                </div>
                <div class="odd-btn" onclick="app.selectOdd(${m.id},'2','${m.team2}',${odds.away})">
                    <span class="odd-label">${m.team2}</span>
                    <span class="odd-value">${odds.away.toFixed(2)}</span>
                </div>
            </div>
        </div>`;
    }

    function calculateOdds(t1, t2, matchId) {
        // Check custom odds first
        if (matchId && customMatchOdds[matchId]) {
            return customMatchOdds[matchId];
        }
        const r1 = WC2026.rankings[t1] || 30;
        const r2 = WC2026.rankings[t2] || 30;
        const diff = r2 - r1;
        const homeBase = Math.max(1.15, 3.5 - diff * 0.08);
        const awayBase = Math.max(1.15, 3.5 + diff * 0.08);
        const drawBase = 3.0 + Math.abs(diff) * 0.03;
        return {
            home: Math.round(homeBase * 100) / 100,
            draw: Math.round(drawBase * 100) / 100,
            away: Math.round(awayBase * 100) / 100
        };
    }

    function getChampOdds(team) {
        if (customChampOdds[team] !== undefined) return customChampOdds[team];
        const entry = championshipOdds.find(c => c.team === team);
        return entry ? entry.odds : 50.0;
    }

    function getSpecialOdds(betId, optIdx) {
        const key = betId + '_' + optIdx;
        if (customSpecialOdds[key] !== undefined) return customSpecialOdds[key];
        const sb = specialBets.find(s => s.id === betId);
        return sb ? sb.options[optIdx].odds : 2.0;
    }

    // --- STATS ---
    function renderStats() {
        // Already in HTML, just animate
        document.querySelectorAll('.stat-value').forEach(el => {
            const target = parseInt(el.textContent);
            let current = 0;
            const step = Math.ceil(target / 30);
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = current;
            }, 40);
        });
    }

    // --- FAVORITES ---
    function renderFavorites() {
        const container = document.getElementById('favorites-grid');
        const top = championshipOdds.slice(0, 10);
        container.innerHTML = top.map(t => {
            const odds = getChampOdds(t.team);
            return `
            <div class="favorite-card" onclick="app.betChampion('${t.team}',${odds})">
                <div class="favorite-flag">${WC2026.flags[t.team] || '🏳️'}</div>
                <div class="favorite-name">${t.team}</div>
                <div class="favorite-odds">${odds.toFixed(1)}x</div>
                <div class="favorite-rank">FIFA #${WC2026.rankings[t.team] || '-'}</div>
            </div>`;
        }).join('');
    }

    // --- GROUPS ---
    function renderGroups() {
        const container = document.getElementById('groups-grid');
        container.innerHTML = Object.entries(WC2026.groups).map(([key, g]) => {
            const teamsHtml = g.teams.map((t, i) => {
                const posClass = i < 2 ? 'qualify' : (i === 2 ? 'maybe' : 'out');
                return `
                <div class="group-team">
                    <span class="group-team-pos ${posClass}">${i + 1}</span>
                    <span class="group-team-flag">${WC2026.flags[t] || '🏳️'}</span>
                    <span class="group-team-name">${t}</span>
                    <span class="group-team-rank">#${WC2026.rankings[t] || '-'}</span>
                </div>`;
            }).join('');
            return `
            <div class="group-card">
                <div class="group-card-header">
                    <span class="group-name">Bảng ${key}</span>
                    <span class="group-venue">📍 ${g.venue}</span>
                </div>
                <div class="group-teams">${teamsHtml}</div>
            </div>`;
        }).join('');
    }

    // --- ALL MATCHES ---
    function renderAllMatches(filter) {
        const container = document.getElementById('matches-list');
        let filtered = allMatches;
        if (filter !== 'all') filtered = allMatches.filter(m => m.stage === filter);

        const byDate = {};
        filtered.forEach(m => {
            if (!byDate[m.date]) byDate[m.date] = [];
            byDate[m.date].push(m);
        });

        let html = '';
        Object.entries(byDate).forEach(([date, matches]) => {
            html += `<div class="match-date-header">📅 ${formatDate(date)}</div>`;
            html += matches.map(m => createMatchCard(m)).join('');
        });
        container.innerHTML = html || '<p style="text-align:center;color:var(--text3);padding:3rem">Chưa có trận đấu nào</p>';
    }

    function setupFilters() {
        document.querySelectorAll('#match-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#match-filters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAllMatches(btn.dataset.filter);
            });
        });
    }

    // --- BETTING PANELS ---
    function setupBettingTabs() {
        document.querySelectorAll('.betting-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.betting-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.betting-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('panel-' + tab.dataset.tab)?.classList.add('active');
            });
        });
    }

    function renderBettingPanels() {
        // Match betting
        const matchPanel = document.getElementById('panel-match');
        const upcoming = allMatches.filter(m => m.stage === 'group' && m.team1 !== 'TBD').slice(0, 12);
        matchPanel.innerHTML = '<div class="featured-matches">' + upcoming.map(m => createMatchCard(m)).join('') + '</div>';

        // Outright betting
        const outrightPanel = document.getElementById('panel-outright');
        outrightPanel.innerHTML = `
            <div class="bet-option-card">
                <div class="bet-option-title">🏆 Đội vô địch World Cup 2026</div>
                <div class="bet-option-desc">Chọn đội bạn tin sẽ giành chức vô địch</div>
                <div class="bet-options-grid">
                    ${championshipOdds.map(t => {
            const odds = getChampOdds(t.team);
            return `
                        <div class="bet-option" onclick="app.betChampion('${t.team}',${odds})">
                            <div>${WC2026.flags[t.team] || '🏳️'}</div>
                            <div class="bet-option-label">${t.team}</div>
                            <div class="bet-option-odds">${odds.toFixed(1)}x</div>
                        </div>`;
        }).join('')}
                </div>
            </div>`;

        // Special bets
        const specialPanel = document.getElementById('panel-special');
        specialPanel.innerHTML = specialBets.map(sb => `
            <div class="bet-option-card">
                <div class="bet-option-title">${sb.title}</div>
                <div class="bet-option-desc">${sb.description}</div>
                <div class="bet-options-grid">
                    ${sb.options.map((opt, oi) => {
            const odds = getSpecialOdds(sb.id, oi);
            return `
                        <div class="bet-option" onclick="app.selectSpecialBet('${sb.id}','${opt.label.replace(/'/g, "\\'")}',${odds})">
                            <div class="bet-option-label">${opt.label}</div>
                            <div class="bet-option-odds">${odds.toFixed(1)}x</div>
                        </div>`;
        }).join('')}

                </div>
            </div>
        `).join('');
    }

    // --- MY BETS ---
    function renderMyBets() {
        const container = document.getElementById('my-bets-list');
        if (!userBets.length) {
            container.innerHTML = '<p style="text-align:center;color:var(--text3);padding:2rem">Bạn chưa đặt cược nào</p>';
            return;
        }
        container.innerHTML = userBets.map(b => `
            <div class="bet-item">
                <div class="bet-item-info">
                    <div class="bet-item-match">${b.label}</div>
                    <div class="bet-item-pick">Chọn: ${b.pick} (${b.odds}x)</div>
                </div>
                <div class="bet-item-amount">
                    <div class="bet-item-stake">Cược: ${formatMoney(b.amount)}</div>
                    <div class="bet-item-potential">Thắng: ${formatMoney(b.amount * b.odds)}</div>
                </div>
                <span class="bet-item-status pending">Chờ KQ</span>
            </div>
        `).join('');
    }

    // --- LEADERBOARD ---
    async function renderLeaderboard() {
        let sorted;
        try {
            sorted = await API.getLeaderboard();
        } catch (e) {
            sorted = [...samplePlayers].sort((a, b) => b.profit - a.profit);
            if (currentUser && !sorted.find(p => p.name === currentUser.name)) {
                const wins = userBets.filter(b => b.status === 'won').length;
                sorted.push({
                    name: currentUser.name, team: currentUser.team,
                    totalBets: userBets.length, won: wins, lost: userBets.length - wins,
                    profit: currentUser.balance - 1000000
                });
                sorted.sort((a, b) => b.profit - a.profit);
            }
        }

        // Podium
        const podium = document.getElementById('leaderboard-podium');
        if (sorted.length >= 3) {
            const medals = ['🥇', '🥈', '🥉'];
            const classes = ['gold', 'silver', 'bronze'];
            const order = [1, 0, 2];
            podium.innerHTML = order.map(i => `
                <div class="podium-item ${classes[i]}">
                    <div class="podium-rank">${medals[i]}</div>
                    <div class="podium-name">${sorted[i].name}</div>
                    <div class="podium-profit">${formatMoney(sorted[i].profit)}</div>
                </div>
            `).join('');
        }

        // Table
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = sorted.map((p, i) => `
            <tr>
                <td><strong>${i + 1}</strong></td>
                <td>${p.name}</td>
                <td>${WC2026.flags[p.team] || ''} ${p.team}</td>
                <td>${p.totalBets}</td>
                <td style="color:var(--green)">${p.won || 0}</td>
                <td style="color:var(--red)">${p.lost || 0}</td>
                <td class="${p.profit >= 0 ? 'profit-pos' : 'profit-neg'}">${formatMoney(p.profit)}</td>
            </tr>
        `).join('');
    }

    // --- MODALS ---
    function setupModals() {
        document.getElementById('login-close').addEventListener('click', () => hideModal('login-modal'));
        document.getElementById('betslip-close').addEventListener('click', () => hideModal('betslip-modal'));
        document.getElementById('login-submit').addEventListener('click', handleLogin);
        document.getElementById('place-bet-btn').addEventListener('click', placeBet);
        document.getElementById('user-profile').addEventListener('click', showLogin);

        // Quick amounts
        document.querySelectorAll('.quick-amt').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('bet-amount').value = btn.dataset.amount;
                updateBetSummary();
            });
        });
        document.getElementById('bet-amount').addEventListener('input', updateBetSummary);

        // Close on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', e => {
                if (e.target === overlay) overlay.classList.remove('show');
            });
        });
    }

    function showModal(id) { document.getElementById(id).classList.add('show'); }
    function hideModal(id) { document.getElementById(id).classList.remove('show'); }

    function showLogin() {
        if (!currentUser) showModal('login-modal');
    }

    function populateTeamSelect() {
        const sel = document.getElementById('login-team');
        const teams = Object.keys(WC2026.flags).sort();
        teams.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t; opt.textContent = `${WC2026.flags[t]} ${t}`;
            sel.appendChild(opt);
        });
    }

    async function handleLogin() {
        const name = document.getElementById('login-name').value.trim();
        const team = document.getElementById('login-team').value;
        if (!name) { showToast('Vui lòng nhập tên!', 'error'); return; }
        try {
            currentUser = await API.login(name, team);
        } catch (e) {
            currentUser = { name, team, balance: 1000000 };
        }
        localStorage.setItem('wc2026_user', JSON.stringify(currentUser));
        userBets = await API.getUserBets(currentUser.name).catch(() => []);
        updateUserUI();
        hideModal('login-modal');
        showToast(`Chào mừng ${name}! Bạn có ${formatMoney(currentUser.balance)} VNĐ để cá cược 🎉`, 'success');
        renderLeaderboard();
        renderBettingOverview();
        renderBetHistory();
    }

    function updateUserUI() {
        document.getElementById('username').textContent = currentUser.name;
        document.getElementById('balance-amount').textContent = formatMoney(currentUser.balance);
        document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    }

    // --- BETTING LOGIC ---
    function selectOdd(matchId, type, pick, odds) {
        if (!currentUser) { showLogin(); return; }
        const match = allMatches.find(m => m.id === matchId);
        if (!match) return;
        selectedBet = {
            matchId, type, pick, odds,
            label: `${match.team1} vs ${match.team2}`,
            category: 'match'
        };
        showBetSlip();
    }

    function betChampion(team, odds) {
        if (!currentUser) { showLogin(); return; }
        selectedBet = {
            pick: team, odds,
            label: `Vô địch: ${WC2026.flags[team] || ''} ${team}`,
            category: 'outright'
        };
        showBetSlip();
    }

    function selectSpecialBet(id, label, odds) {
        if (!currentUser) { showLogin(); return; }
        selectedBet = {
            pick: label, odds,
            label: `Đặc biệt: ${label}`,
            category: 'special'
        };
        showBetSlip();
    }

    function showBetSlip() {
        if (!selectedBet) return;
        const content = document.getElementById('betslip-content');
        content.innerHTML = `
            <div style="background:var(--bg3);border-radius:8px;padding:1rem;margin-bottom:1rem">
                <div style="font-weight:700;margin-bottom:4px">${selectedBet.label}</div>
                <div style="color:var(--text2);font-size:.85rem">Chọn: <strong style="color:var(--accent2)">${selectedBet.pick}</strong></div>
                <div style="color:var(--accent2);font-weight:800;font-size:1.2rem;margin-top:6px">${selectedBet.odds.toFixed(2)}x</div>
            </div>`;
        updateBetSummary();
        showModal('betslip-modal');
    }

    function updateBetSummary() {
        if (!selectedBet) return;
        const amount = parseInt(document.getElementById('bet-amount').value) || 0;
        const potential = amount * selectedBet.odds;
        const summary = document.getElementById('bet-summary');
        summary.innerHTML = `
            <div class="row"><span>Tiền cược:</span><span>${formatMoney(amount)}</span></div>
            <div class="row"><span>Tỷ lệ:</span><span style="color:var(--accent2)">${selectedBet.odds.toFixed(2)}x</span></div>
            <div class="row total"><span>Tiền thắng dự kiến:</span><span style="color:var(--green)">${formatMoney(potential)}</span></div>`;
    }

    async function placeBet() {
        if (!selectedBet || !currentUser) return;
        const amount = parseInt(document.getElementById('bet-amount').value) || 0;
        if (amount < 10000) { showToast('Số tiền cược tối thiểu 10,000 VNĐ', 'error'); return; }
        if (amount > currentUser.balance) { showToast('Số dư không đủ!', 'error'); return; }

        try {
            const result = await API.placeBet({
                userName: currentUser.name,
                label: selectedBet.label,
                pick: selectedBet.pick,
                odds: selectedBet.odds,
                amount,
                matchId: selectedBet.matchId,
                type: selectedBet.type
            });
            if (result.error) { showToast(result.error, 'error'); return; }
            currentUser.balance = result.balance;
            localStorage.setItem('wc2026_user', JSON.stringify(currentUser));
            userBets.push(result.bet);
        } catch (e) {
            currentUser.balance -= amount;
            userBets.push({ ...selectedBet, amount, userName: currentUser.name, timestamp: Date.now(), status: 'pending' });
        }
        updateUserUI();

        hideModal('betslip-modal');
        showToast(`Đặt cược thành công! ${formatMoney(amount)} cho ${selectedBet.pick} 🎯`, 'success');
        selectedBet = null;
        renderMyBets();
        renderBettingOverview();
    }

    // --- TOAST ---
    function showToast(msg, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> ${msg}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- UTILS ---
    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    function formatMoney(n) {
        if (n === undefined || n === null) return '0';
        return new Intl.NumberFormat('vi-VN').format(n);
    }

    // --- BETTING OVERVIEW (Home Page) ---
    function renderBettingOverview() {
        const overviewEl = document.getElementById('user-betting-overview');
        if (!overviewEl) return;

        const total = userBets.length;
        const totalAmt = userBets.reduce((s, b) => s + (b.amount || 0), 0);
        const pending = userBets.filter(b => b.status === 'pending').length;
        const won = userBets.filter(b => b.status === 'won').length;
        const lost = userBets.filter(b => b.status === 'lost').length;
        const profit = userBets.filter(b => b.status === 'won').reduce((s, b) => s + b.amount * b.odds - b.amount, 0)
            - userBets.filter(b => b.status === 'lost').reduce((s, b) => s + b.amount, 0);

        overviewEl.innerHTML = `
            <div class="admin-summary-card"><div class="val">${total}</div><div class="lbl">Tổng cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent2)">${formatMoney(totalAmt)}</div><div class="lbl">Tiền đã cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent)">${pending}</div><div class="lbl">Chờ kết quả</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${won}</div><div class="lbl">Thắng</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--red)">${lost}</div><div class="lbl">Thua</div></div>
            <div class="admin-summary-card"><div class="val" style="color:${profit >= 0 ? 'var(--green)' : 'var(--red)'}">${profit >= 0 ? '+' : ''}${formatMoney(profit)}</div><div class="lbl">Lợi nhuận</div></div>
        `;
    }

    // --- BET HISTORY PAGE ---
    function renderBetHistory(filter) {
        if (!filter) filter = 'all';
        const statsEl = document.getElementById('history-stats');
        const listEl = document.getElementById('history-bets-list');
        if (!statsEl) return;

        const total = userBets.length;
        const totalAmt = userBets.reduce((s, b) => s + (b.amount || 0), 0);
        const pending = userBets.filter(b => b.status === 'pending').length;
        const won = userBets.filter(b => b.status === 'won').length;
        const lost = userBets.filter(b => b.status === 'lost').length;
        const profit = userBets.filter(b => b.status === 'won').reduce((s, b) => s + b.amount * b.odds - b.amount, 0)
            - userBets.filter(b => b.status === 'lost').reduce((s, b) => s + b.amount, 0);

        statsEl.innerHTML = `
            <div class="admin-summary-card"><div class="val">${total}</div><div class="lbl">Tổng cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent2)">${formatMoney(totalAmt)}</div><div class="lbl">Tiền đã cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent)">${pending}</div><div class="lbl">Chờ KQ</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${won}</div><div class="lbl">Thắng</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--red)">${lost}</div><div class="lbl">Thua</div></div>
            <div class="admin-summary-card"><div class="val" style="color:${profit >= 0 ? 'var(--green)' : 'var(--red)'}">${profit >= 0 ? '+' : ''}${formatMoney(profit)}</div><div class="lbl">Lợi nhuận</div></div>
        `;

        const filtered = filter === 'all' ? userBets : userBets.filter(b => b.status === filter);
        const sorted = [...filtered].reverse();

        if (!sorted.length) {
            const msg = filter === 'all' ? 'Bạn chưa đặt cược nào. Hãy bắt đầu! 🎯'
                : filter === 'pending' ? 'Không có cược nào đang chờ kết quả'
                    : filter === 'won' ? 'Chưa có cược nào thắng'
                        : 'Chưa có cược nào thua';
            listEl.innerHTML = '<p style="text-align:center;color:var(--text3);padding:2rem">' + msg + '</p>';
            return;
        }

        listEl.innerHTML = sorted.map(b => {
            const time = b.timestamp ? new Date(b.timestamp).toLocaleString('vi-VN') : '';
            const statusClass = b.status === 'won' ? 'profit-pos' : b.status === 'lost' ? 'profit-neg' : '';
            const statusIcon = b.status === 'pending' ? '⏳' : b.status === 'won' ? '✅' : '❌';
            const statusText = b.status === 'pending' ? 'Chờ KQ' : b.status === 'won' ? 'Thắng' : 'Thua';
            const extra = b.status === 'pending' ? '<div style="font-size:.75rem;color:var(--text3)">→ ' + formatMoney(b.amount * b.odds) + ' VNĐ</div>'
                : b.status === 'won' ? '<div style="font-size:.75rem;color:var(--green)">+' + formatMoney(b.amount * b.odds) + ' VNĐ</div>' : '';
            return '<div class="admin-bet-row">'
                + '<div style="font-size:1.5rem;min-width:36px;text-align:center">' + statusIcon + '</div>'
                + '<div class="admin-bet-detail" style="flex:1">'
                + '<div class="admin-bet-label">' + b.label + '</div>'
                + '<div class="admin-bet-pick">Chọn: <strong style="color:var(--accent2)">' + b.pick + '</strong> (' + b.odds + 'x)</div>'
                + '<div style="font-size:.75rem;color:var(--text3);margin-top:2px">🕐 ' + time + '</div>'
                + '</div>'
                + '<div style="text-align:right">'
                + '<div style="color:var(--accent2);font-weight:700">' + formatMoney(b.amount) + ' VNĐ</div>'
                + '<div class="' + statusClass + '" style="font-size:.8rem;font-weight:600">' + statusText + '</div>'
                + extra
                + '</div></div>';
        }).join('');
    }

    function setupHistoryFilters() {
        document.querySelectorAll('#history-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#history-filters .filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderBetHistory(btn.dataset.hfilter);
            });
        });
    }

    // --- EXPOSE API ---
    window.app = { selectOdd, betChampion, selectSpecialBet };

    // --- START ---
    document.addEventListener('DOMContentLoaded', init);
})();
