// ============================================================
// WC2026 ADMIN - Admin Panel Application
// ============================================================
(function() {
    'use strict';

    // --- STATE ---
    let allMatches = [];
    let userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
    let customMatchOdds = JSON.parse(localStorage.getItem('wc2026_custom_match_odds')) || {};
    let customChampOdds = JSON.parse(localStorage.getItem('wc2026_custom_champ_odds')) || {};
    let customSpecialOdds = JSON.parse(localStorage.getItem('wc2026_custom_special_odds')) || {};

    // --- INIT ---
    function init() {
        // Check login first
        if (!checkAdminAuth()) {
            setupLogin();
            return;
        }
        startAdmin();
    }

    function checkAdminAuth() {
        return sessionStorage.getItem('wc2026_admin_auth') === 'true';
    }

    function setupLogin() {
        const overlay = document.getElementById('admin-login-overlay');
        overlay.classList.remove('hidden');
        const loginBtn = document.getElementById('admin-login-btn');
        const usernameInput = document.getElementById('admin-username');
        const passwordInput = document.getElementById('admin-password');
        const errorEl = document.getElementById('admin-login-error');

        loginBtn.addEventListener('click', attemptLogin);
        passwordInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });
        usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') passwordInput.focus(); });
        usernameInput.focus();

        function attemptLogin() {
            const user = usernameInput.value.trim();
            const pass = passwordInput.value;
            if (user === 'admin' && pass === '123456') {
                sessionStorage.setItem('wc2026_admin_auth', 'true');
                overlay.classList.add('hidden');
                startAdmin();
            } else {
                errorEl.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
                setTimeout(() => { errorEl.style.display = 'none'; }, 3000);
            }
        }
    }

    function startAdmin() {
        document.getElementById('admin-login-overlay').classList.add('hidden');
        generateParticles();
        allMatches = [...generateGroupMatches(), ...generateKnockoutMatches(73)];
        setupNavigation();
        setupAdminButtons();
        renderDashboard();
        renderAdminMatchOdds();
        renderAdminChampOdds();
        renderAdminSpecialOdds();
        renderAdminUserBets();
    }

    // --- PARTICLES ---
    function generateParticles() {
        const c = document.getElementById('particles');
        for (let i = 0; i < 15; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 6 + 2;
            p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*10}s;animation-duration:${10+Math.random()*15}s`;
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
    }

    function navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById('page-' + page)?.classList.add('active');
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        document.querySelector('.nav').classList.remove('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Refresh data when navigating
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        if (page === 'dashboard') renderDashboard();
        if (page === 'user-bets') renderAdminUserBets();
    }

    // --- ADMIN BUTTONS ---
    function setupAdminButtons() {
        document.getElementById('admin-save-match').addEventListener('click', saveMatchOdds);
        document.getElementById('admin-reset-match').addEventListener('click', resetMatchOdds);
        document.getElementById('admin-save-champ').addEventListener('click', saveChampOdds);
        document.getElementById('admin-reset-champ').addEventListener('click', resetChampOdds);
        document.getElementById('admin-save-special').addEventListener('click', saveSpecialOdds);
        document.getElementById('admin-reset-special').addEventListener('click', resetSpecialOdds);
        document.getElementById('admin-clear-bets').addEventListener('click', clearAllBets);

        document.getElementById('admin-search-match').addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('#admin-match-list .admin-odds-row').forEach(row => {
                row.style.display = row.dataset.teams.toLowerCase().includes(q) ? '' : 'none';
            });
        });
        document.getElementById('admin-search-bets').addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('#admin-bets-list .admin-bet-row').forEach(row => {
                row.style.display = row.dataset.searchText.toLowerCase().includes(q) ? '' : 'none';
            });
        });
    }

    // --- DASHBOARD ---
    function renderDashboard() {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        const statsEl = document.getElementById('dashboard-stats');
        const recentEl = document.getElementById('dashboard-recent-bets');

        const total = userBets.length;
        const totalAmt = userBets.reduce((s, b) => s + (b.amount || 0), 0);
        const pending = userBets.filter(b => b.status === 'pending').length;
        const won = userBets.filter(b => b.status === 'won').length;
        const lost = userBets.filter(b => b.status === 'lost').length;
        const potential = userBets.reduce((s, b) => s + (b.amount || 0) * (b.odds || 0), 0);
        const customCount = Object.keys(customMatchOdds).length;
        const totalUsers = new Set(userBets.map(b => b.userName || 'Khách')).size || (total > 0 ? 1 : 0);

        statsEl.innerHTML = `
            <div class="admin-summary-card"><div class="val">${totalUsers}</div><div class="lbl">Người chơi</div></div>
            <div class="admin-summary-card"><div class="val">${total}</div><div class="lbl">Tổng cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent2)">${formatMoney(totalAmt)}</div><div class="lbl">Tổng tiền cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent)">${pending}</div><div class="lbl">Chờ kết quả</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${won}</div><div class="lbl">Thắng</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--red)">${lost}</div><div class="lbl">Thua</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${formatMoney(potential)}</div><div class="lbl">Tiền thắng dự kiến</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--cyan)">${customCount}</div><div class="lbl">Odds đã chỉnh</div></div>
        `;

        // Recent bets
        const recent = [...userBets].reverse().slice(0, 5);
        if (!recent.length) {
            recentEl.innerHTML = '<p style="text-align:center;color:var(--text3);padding:2rem">Chưa có cược nào</p>';
            return;
        }
        recentEl.innerHTML = recent.map(b => {
            const time = b.timestamp ? new Date(b.timestamp).toLocaleString('vi-VN') : '';
            const statusClass = b.status === 'won' ? 'profit-pos' : b.status === 'lost' ? 'profit-neg' : '';
            const statusText = b.status === 'pending' ? '⏳ Chờ KQ' : b.status === 'won' ? '✅ Thắng' : '❌ Thua';
            return `
            <div class="admin-bet-row">
                <div class="admin-bet-user">
                    <div class="admin-bet-user-name">👤 ${b.userName || 'Khách'}</div>
                    <div class="admin-bet-user-time">${time}</div>
                </div>
                <div class="admin-bet-detail">
                    <div class="admin-bet-label">${b.label}</div>
                    <div class="admin-bet-pick">Chọn: <strong style="color:var(--accent2)">${b.pick}</strong> (${b.odds}x)</div>
                </div>
                <div style="text-align:right">
                    <div style="color:var(--accent2);font-weight:700">${formatMoney(b.amount)} VNĐ</div>
                    <div class="${statusClass}" style="font-size:.8rem">${statusText}</div>
                </div>
            </div>`;
        }).join('');
    }

    // --- ODDS CALCULATION ---
    function calculateOdds(t1, t2, matchId) {
        if (matchId && customMatchOdds[matchId]) return customMatchOdds[matchId];
        const r1 = WC2026.rankings[t1] || 30;
        const r2 = WC2026.rankings[t2] || 30;
        const diff = r2 - r1;
        return {
            home: Math.round(Math.max(1.15, 3.5 - diff * 0.08) * 100) / 100,
            draw: Math.round((3.0 + Math.abs(diff) * 0.03) * 100) / 100,
            away: Math.round(Math.max(1.15, 3.5 + diff * 0.08) * 100) / 100
        };
    }

    // --- MATCH ODDS ---
    function renderAdminMatchOdds() {
        const container = document.getElementById('admin-match-list');
        const groupMatches = allMatches.filter(m => m.stage === 'group' && m.team1 !== 'TBD');
        container.innerHTML = groupMatches.map(m => {
            const f1 = WC2026.flags[m.team1] || '🏳️';
            const odds = calculateOdds(m.team1, m.team2, m.id);
            const hasCustom = !!customMatchOdds[m.id];
            return `
            <div class="admin-odds-row ${hasCustom ? 'modified' : ''}" data-match-id="${m.id}" data-teams="${m.team1} ${m.team2}">
                <div class="admin-match-info">
                    <span>${f1}</span>
                    <div>
                        <div class="admin-match-teams">${m.team1} vs ${m.team2}</div>
                        <div class="admin-match-meta">Bảng ${m.group} • ${formatDate(m.date)} • ${m.time}</div>
                    </div>
                </div>
                <div class="admin-odds-inputs">
                    <label>${m.team1}<input type="number" step="0.01" min="1" value="${odds.home.toFixed(2)}" data-field="home" data-mid="${m.id}"></label>
                    <label>Hòa<input type="number" step="0.01" min="1" value="${odds.draw.toFixed(2)}" data-field="draw" data-mid="${m.id}"></label>
                    <label>${m.team2}<input type="number" step="0.01" min="1" value="${odds.away.toFixed(2)}" data-field="away" data-mid="${m.id}"></label>
                </div>
            </div>`;
        }).join('');
        container.querySelectorAll('input').forEach(inp => {
            inp.addEventListener('input', () => {
                inp.classList.add('changed');
                inp.closest('.admin-odds-row').classList.add('modified');
            });
        });
    }

    function saveMatchOdds() {
        document.querySelectorAll('#admin-match-list .admin-odds-row').forEach(row => {
            const mid = row.dataset.matchId;
            const inputs = row.querySelectorAll('input');
            customMatchOdds[mid] = {
                home: parseFloat(inputs[0].value) || 1.5,
                draw: parseFloat(inputs[1].value) || 3.0,
                away: parseFloat(inputs[2].value) || 3.0
            };
        });
        localStorage.setItem('wc2026_custom_match_odds', JSON.stringify(customMatchOdds));
        showToast('Đã lưu tỷ lệ cược trận đấu! ✅', 'success');
    }

    function resetMatchOdds() {
        customMatchOdds = {};
        localStorage.removeItem('wc2026_custom_match_odds');
        renderAdminMatchOdds();
        showToast('Đã reset tỷ lệ trận đấu về mặc định 🔄', 'success');
    }

    // --- CHAMP ODDS ---
    function getChampOdds(team) {
        if (customChampOdds[team] !== undefined) return customChampOdds[team];
        const entry = championshipOdds.find(c => c.team === team);
        return entry ? entry.odds : 50.0;
    }

    function renderAdminChampOdds() {
        const container = document.getElementById('admin-champ-list');
        container.innerHTML = championshipOdds.map(t => {
            const odds = getChampOdds(t.team);
            const hasCustom = customChampOdds[t.team] !== undefined;
            return `
            <div class="admin-champ-card ${hasCustom ? 'modified' : ''}">
                <span class="admin-champ-flag">${WC2026.flags[t.team]||'🏳️'}</span>
                <div class="admin-champ-info"><div class="admin-champ-name">${t.team}</div></div>
                <input class="admin-champ-input" type="number" step="0.1" min="1" value="${odds.toFixed(1)}" data-team="${t.team}">
            </div>`;
        }).join('');
    }

    function saveChampOdds() {
        document.querySelectorAll('#admin-champ-list .admin-champ-input').forEach(inp => {
            customChampOdds[inp.dataset.team] = parseFloat(inp.value) || 10.0;
        });
        localStorage.setItem('wc2026_custom_champ_odds', JSON.stringify(customChampOdds));
        showToast('Đã lưu tỷ lệ cược vô địch! ✅', 'success');
    }

    function resetChampOdds() {
        customChampOdds = {};
        localStorage.removeItem('wc2026_custom_champ_odds');
        renderAdminChampOdds();
        showToast('Đã reset tỷ lệ vô địch về mặc định 🔄', 'success');
    }

    // --- SPECIAL ODDS ---
    function getSpecialOdds(betId, optIdx) {
        const key = betId + '_' + optIdx;
        if (customSpecialOdds[key] !== undefined) return customSpecialOdds[key];
        const sb = specialBets.find(s => s.id === betId);
        return sb ? sb.options[optIdx].odds : 2.0;
    }

    function renderAdminSpecialOdds() {
        const container = document.getElementById('admin-special-list');
        container.innerHTML = specialBets.map(sb => {
            const optHtml = sb.options.map((opt, oi) => {
                const odds = getSpecialOdds(sb.id, oi);
                return `
                <label style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--bg4)">
                    <span style="font-size:.85rem">${opt.label}</span>
                    <input type="number" step="0.1" min="1" value="${odds.toFixed(1)}" data-bet-id="${sb.id}" data-opt-idx="${oi}"
                        style="width:70px;padding:5px 8px;background:var(--bg3);border:1px solid var(--bg4);border-radius:6px;color:var(--accent2);font-weight:700;text-align:center">
                </label>`;
            }).join('');
            return `
            <div class="admin-odds-row" style="flex-direction:column;align-items:stretch">
                <div style="font-weight:700;font-size:1rem;margin-bottom:.5rem">${sb.title}</div>
                <div style="font-size:.8rem;color:var(--text3);margin-bottom:.8rem">${sb.description}</div>
                ${optHtml}
            </div>`;
        }).join('');
    }

    function saveSpecialOdds() {
        document.querySelectorAll('#admin-special-list input[data-bet-id]').forEach(inp => {
            const key = inp.dataset.betId + '_' + inp.dataset.optIdx;
            customSpecialOdds[key] = parseFloat(inp.value) || 2.0;
        });
        localStorage.setItem('wc2026_custom_special_odds', JSON.stringify(customSpecialOdds));
        showToast('Đã lưu tỷ lệ cược đặc biệt! ✅', 'success');
    }

    function resetSpecialOdds() {
        customSpecialOdds = {};
        localStorage.removeItem('wc2026_custom_special_odds');
        renderAdminSpecialOdds();
        showToast('Đã reset tỷ lệ cược đặc biệt về mặc định 🔄', 'success');
    }

    // --- USER BETS MANAGEMENT ---
    function renderAdminUserBets() {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        const summaryEl = document.getElementById('admin-bets-summary');
        const listEl = document.getElementById('admin-bets-list');

        const totalBets = userBets.length;
        const totalAmount = userBets.reduce((s, b) => s + (b.amount || 0), 0);
        const pendingCount = userBets.filter(b => b.status === 'pending').length;
        const wonCount = userBets.filter(b => b.status === 'won').length;
        const lostCount = userBets.filter(b => b.status === 'lost').length;
        const totalPotential = userBets.reduce((s, b) => s + (b.amount || 0) * (b.odds || 0), 0);

        summaryEl.innerHTML = `
            <div class="admin-summary-card"><div class="val">${totalBets}</div><div class="lbl">Tổng số cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent2)">${formatMoney(totalAmount)}</div><div class="lbl">Tổng tiền cược</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--accent)">${pendingCount}</div><div class="lbl">Chờ kết quả</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${wonCount}</div><div class="lbl">Thắng</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--red)">${lostCount}</div><div class="lbl">Thua</div></div>
            <div class="admin-summary-card"><div class="val" style="color:var(--green)">${formatMoney(totalPotential)}</div><div class="lbl">Tiền thắng dự kiến</div></div>
        `;

        if (!userBets.length) {
            listEl.innerHTML = '<p style="text-align:center;color:var(--text3);padding:2rem">Chưa có cược nào</p>';
            return;
        }

        listEl.innerHTML = userBets.map((b, i) => {
            const time = b.timestamp ? new Date(b.timestamp).toLocaleString('vi-VN') : '';
            const userName = b.userName || 'Khách';
            const statusOpts = ['pending', 'won', 'lost'].map(s =>
                `<option value="${s}" ${b.status === s ? 'selected' : ''}>${s === 'pending' ? 'Chờ KQ' : s === 'won' ? 'Thắng' : 'Thua'}</option>`
            ).join('');
            return `
            <div class="admin-bet-row" data-idx="${i}" data-search-text="${userName} ${b.label} ${b.pick}">
                <div class="admin-bet-user">
                    <div class="admin-bet-user-name">👤 ${userName}</div>
                    <div class="admin-bet-user-time">${time}</div>
                </div>
                <div class="admin-bet-detail">
                    <div class="admin-bet-label">${b.label}</div>
                    <div class="admin-bet-pick">Chọn: <strong style="color:var(--accent2)">${b.pick}</strong> (${b.odds}x)</div>
                </div>
                <div class="admin-bet-controls">
                    <input type="number" min="10000" step="10000" value="${b.amount}" onchange="adminApp.updateBetAmount(${i}, this.value)" title="Số tiền cược">
                    <select onchange="adminApp.updateBetStatus(${i}, this.value)" title="Trạng thái">
                        ${statusOpts}
                    </select>
                    <button class="admin-bet-del" onclick="adminApp.deleteBet(${i})" title="Xóa cược">🗑️</button>
                </div>
            </div>`;
        }).join('');
    }

    function updateBetAmount(idx, value) {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        const amt = parseInt(value) || 0;
        if (idx >= 0 && idx < userBets.length) {
            const diff = userBets[idx].amount - amt;
            userBets[idx].amount = amt;
            // Update user balance
            const user = JSON.parse(localStorage.getItem('wc2026_user'));
            if (user) {
                user.balance += diff;
                localStorage.setItem('wc2026_user', JSON.stringify(user));
            }
            localStorage.setItem('wc2026_bets', JSON.stringify(userBets));
            renderAdminUserBets();
            showToast(`Đã cập nhật số tiền cược #${idx + 1}`, 'success');
        }
    }

    function updateBetStatus(idx, status) {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        if (idx >= 0 && idx < userBets.length) {
            const oldStatus = userBets[idx].status;
            userBets[idx].status = status;
            const user = JSON.parse(localStorage.getItem('wc2026_user'));
            if (user) {
                if (oldStatus === 'pending' && status === 'won') {
                    user.balance += userBets[idx].amount * userBets[idx].odds;
                    showToast(`🎉 Cược #${idx + 1} THẮNG! +${formatMoney(userBets[idx].amount * userBets[idx].odds)} VNĐ`, 'success');
                } else if (oldStatus === 'pending' && status === 'lost') {
                    showToast(`😞 Cược #${idx + 1} thua`, 'error');
                } else if (oldStatus === 'won' && status !== 'won') {
                    user.balance -= userBets[idx].amount * userBets[idx].odds;
                } else if (oldStatus !== 'won' && status === 'won') {
                    user.balance += userBets[idx].amount * userBets[idx].odds;
                }
                localStorage.setItem('wc2026_user', JSON.stringify(user));
            }
            localStorage.setItem('wc2026_bets', JSON.stringify(userBets));
            renderAdminUserBets();
        }
    }

    function deleteBet(idx) {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        if (idx >= 0 && idx < userBets.length) {
            const user = JSON.parse(localStorage.getItem('wc2026_user'));
            if (user && userBets[idx].status === 'pending') {
                user.balance += userBets[idx].amount;
                localStorage.setItem('wc2026_user', JSON.stringify(user));
            }
            userBets.splice(idx, 1);
            localStorage.setItem('wc2026_bets', JSON.stringify(userBets));
            renderAdminUserBets();
            showToast('Đã xóa cược ✅', 'success');
        }
    }

    function clearAllBets() {
        userBets = JSON.parse(localStorage.getItem('wc2026_bets')) || [];
        if (!userBets.length) return;
        const user = JSON.parse(localStorage.getItem('wc2026_user'));
        if (user) {
            const refund = userBets.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0);
            user.balance += refund;
            localStorage.setItem('wc2026_user', JSON.stringify(user));
        }
        userBets = [];
        localStorage.setItem('wc2026_bets', JSON.stringify(userBets));
        renderAdminUserBets();
        showToast('Đã xóa tất cả cược 🗑️', 'success');
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
        const days = ['CN','T2','T3','T4','T5','T6','T7'];
        return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
    }

    function formatMoney(n) {
        if (n === undefined || n === null) return '0';
        return new Intl.NumberFormat('vi-VN').format(n);
    }

    function adminLogout() {
        sessionStorage.removeItem('wc2026_admin_auth');
        location.reload();
    }

    // --- EXPOSE API ---
    window.adminApp = { deleteBet, updateBetStatus, updateBetAmount, logout: adminLogout };

    // --- START ---
    document.addEventListener('DOMContentLoaded', init);
})();
