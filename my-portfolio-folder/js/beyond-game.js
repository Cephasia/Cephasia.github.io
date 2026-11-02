/* =========================================================
   BEYOND ANALYTICS — little playable Àyò (Oware) game
   + the "peek at the idea" toggle on the coming-soon card.

   Board: 12 pits, indexes 0-11, sown counter-clockwise.
     0-5   = visitor (bottom row, left to right)
     6-11  = challenger (top row, right to left)
   Rules (simplified Oware): 4 seeds per pit; a pit of 12+
   skips its origin; if the last seed lands on the opponent's
   side making 2 or 3, capture it (and the unbroken run before
   it); a capture that would take every opposing seed is
   cancelled (grand slam); you must feed an empty opponent if
   you can; first to 25 wins.
   ========================================================= */

(function() {

    'use strict';

    var root = document.getElementById('by-game');

    if (!root)
        return;

    var boardEl = document.getElementById('by-play-board'),
        statusEl = document.getElementById('by-status'),
        youEl = document.getElementById('by-score-you'),
        cpuEl = document.getElementById('by-score-cpu'),
        restartEl = document.getElementById('by-restart'),
        seedSrc = root.getAttribute('data-seed'),
        reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var WIN = 25, STEP = reduce ? 0 : 170;

    var state, busy, over, timers = [], pitEls = [];

    /* ---------- Rules engine (pure) ---------- */

    function mine(side, i) { return side === 0 ? i < 6 : i >= 6; }

    function legalMoves(seeds, side) {

        var from = side === 0 ? 0 : 6, moves = [], i;

        for (i = from; i < from + 6; i++)
            if (seeds[i] > 0) moves.push(i);

        var opp = 1 - side, oppHas = false;

        for (i = opp === 0 ? 0 : 6; i < (opp === 0 ? 6 : 12); i++)
            if (seeds[i] > 0) oppHas = true;

        if (oppHas)
            return moves;

        // Opponent is empty: only moves that feed them are allowed.
        return moves.filter(function(m) {
            return sow(seeds, m).path.some(function(p) { return !mine(side, p); });
        });

    }

    function sow(seeds, pit) {

        var s = seeds.slice(), n = s[pit], path = [], i = pit;

        s[pit] = 0;

        while (n > 0) {
            i = (i + 1) % 12;
            if (i === pit) continue;
            s[i]++; path.push(i); n--;
        }

        return { seeds: s, path: path, last: i };

    }

    function play(st, pit, side) {

        var r = sow(st.seeds, pit), s = r.seeds, gain = 0, captured = [];

        if (!mine(side, r.last) && (s[r.last] === 2 || s[r.last] === 3)) {

            var t = s.slice(), g = 0, c = [], j = r.last;

            while (!mine(side, j) && (t[j] === 2 || t[j] === 3)) {
                g += t[j]; c.push(j); t[j] = 0; j = (j + 11) % 12;
            }

            var left = 0, k;
            for (k = side === 0 ? 6 : 0; k < (side === 0 ? 12 : 6); k++) left += t[k];

            if (left > 0) { s = t; gain = g; captured = c; }   // else grand slam: no capture
        }

        var score = st.score.slice();
        score[side] += gain;

        return { seeds: s, score: score, path: r.path, captured: captured, gain: gain };

    }

    function finished(st, sideToMove) {

        if (st.score[0] >= WIN || st.score[1] >= WIN) return true;

        return legalMoves(st.seeds, sideToMove).length === 0;

    }

    /* ---------- Computer opponent (small look-ahead) ---------- */

    function evaluate(st) { return st.score[1] - st.score[0]; }

    function search(st, side, depth) {

        var moves = legalMoves(st.seeds, side);

        if (depth === 0 || moves.length === 0 || st.score[0] >= WIN || st.score[1] >= WIN)
            return evaluate(st);

        var best = side === 1 ? -99 : 99;

        moves.forEach(function(m) {
            var r = play(st, m, side),
                v = search({ seeds: r.seeds, score: r.score }, 1 - side, depth - 1);
            best = side === 1 ? Math.max(best, v) : Math.min(best, v);
        });

        return best;

    }

    function pickCpuMove(st) {

        var moves = legalMoves(st.seeds, 1), best = null, bestV = -999;

        // Friendly mode: roughly 1 move in 3 is a casual one, so visitors can win.
        if (moves.length && Math.random() < 0.34)
            return moves[Math.floor(Math.random() * moves.length)];

        // A tiny random nudge keeps games from feeling identical.
        moves.forEach(function(m) {
            var r = play(st, m, 1),
                v = search({ seeds: r.seeds, score: r.score }, 0, 2) + Math.random() * 0.4;
            if (v > bestV) { bestV = v; best = m; }
        });

        return best;

    }

    /* ---------- View ---------- */

    function build() {

        boardEl.innerHTML = '';
        pitEls = [];

        // Top row shows pits 11..6 (left to right), bottom row 0..5.
        var order = [11, 10, 9, 8, 7, 6, 0, 1, 2, 3, 4, 5];

        order.forEach(function(idx) {

            var pit;

            if (idx <= 5) {
                pit = document.createElement('button');
                pit.type = 'button';
                pit.addEventListener('click', function() { humanMove(idx); });
            }
            else {
                pit = document.createElement('div');
            }

            pit.className = 'by-pit ' + (idx <= 5 ? 'is-you' : 'is-cpu');
            pit.setAttribute('data-i', idx);

            pit.innerHTML = '<span class="by-seeds"></span><span class="by-count"></span>';

            boardEl.appendChild(pit);
            pitEls[idx] = pit;

        });

    }

    function render(hint) {

        var i;

        for (i = 0; i < 12; i++) {

            var el = pitEls[i], n = state.seeds[i],
                seedsEl = el.firstChild, countEl = el.lastChild,
                shown = Math.min(n, 9), html = '', k;

            for (k = 0; k < shown; k++)
                html += '<img src="' + seedSrc + '" alt="" width="48" height="48" draggable="false">';

            seedsEl.innerHTML = html;
            seedsEl.setAttribute('data-n', shown > 4 ? 'many' : String(shown));
            countEl.textContent = n;

            if (i <= 5) {
                var playable = !busy && !over && state.turn === 0 && legalMoves(state.seeds, 0).indexOf(i) !== -1;
                el.disabled = !playable;
                el.setAttribute('aria-label', 'Your pit ' + (i + 1) + ', ' + n + (n === 1 ? ' seed' : ' seeds'));
            }

        }

        youEl.textContent = state.score[0];
        cpuEl.textContent = state.score[1];

        if (hint) statusEl.textContent = hint;

    }

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function flash(list) {

        list.forEach(function(i) {
            pitEls[i].classList.add('is-captured');
            later(function() { pitEls[i].classList.remove('is-captured'); }, 700);
        });

    }

    // Animate a move one seed at a time, then resolve captures.
    function animate(pit, side, done) {

        var res = play(state, pit, side), shown = state.seeds.slice();

        busy = true;
        shown[pit] = 0;
        state.seeds = shown;
        render();

        res.path.forEach(function(p, step) {

            later(function() {
                state.seeds[p]++;
                pitEls[p].classList.add('is-hop');
                later(function() { pitEls[p].classList.remove('is-hop'); }, 260);
                render();
            }, (step + 1) * STEP);

        });

        later(function() {

            state.seeds = res.seeds;
            state.score = res.score;
            if (res.gain) flash(res.captured);
            busy = false;
            done(res);

        }, (res.path.length + 1) * STEP + (reduce ? 0 : 120));

    }

    /* ---------- Turn flow ---------- */

    function humanMove(i) {

        if (busy || over || state.turn !== 0) return;
        if (legalMoves(state.seeds, 0).indexOf(i) === -1) return;

        animate(i, 0, function(res) {

            state.turn = 1;

            var msg = res.gain
                ? 'You captured ' + res.gain + '! 🎉'
                : 'Challenger is thinking…';

            if (checkEnd(1)) return;

            render(msg);
            later(cpuMove, reduce ? 0 : 650);

        });

        render('Sowing…');

    }

    function cpuMove() {

        if (over) return;

        var m = pickCpuMove(state);

        if (m === null) { checkEnd(1); return; }

        animate(m, 1, function(res) {

            state.turn = 0;

            if (checkEnd(0)) return;

            render(res.gain
                ? 'Challenger captured ' + res.gain + '. Hmm, they got you 👀'
                : 'Your move. Pick a pit.');

        });

    }

    function checkEnd(next) {

        if (!finished(state, next)) return false;

        // Side with no legal move: remaining seeds go to the side that holds them.
        var i;
        for (i = 0; i < 12; i++) state.score[i < 6 ? 0 : 1] += state.seeds[i];
        for (i = 0; i < 12; i++) state.seeds[i] = 0;

        over = true;
        render();

        var you = state.score[0], cpu = state.score[1];

        if (you > cpu) {
            render('You win, ' + you + ' to ' + cpu + '! 🏆 Seeds of my face everywhere.');
            confetti();
        }
        else if (cpu > you) {
            render('Challenger wins, ' + cpu + ' to ' + you + '. Rematch? 😄');
        }
        else {
            render('A draw, ' + you + ' each. Respect. 🤝');
        }

        return true;

    }

    function confetti() {

        if (reduce) return;

        var wrap = document.createElement('div'), i;

        wrap.className = 'by-confetti';
        wrap.setAttribute('aria-hidden', 'true');

        for (i = 0; i < 22; i++) {
            var im = document.createElement('img');
            im.src = seedSrc;
            im.alt = '';
            im.style.left = (Math.random() * 100) + '%';
            im.style.animationDelay = (Math.random() * 0.8) + 's';
            im.style.animationDuration = (1.8 + Math.random() * 1.4) + 's';
            wrap.appendChild(im);
        }

        root.appendChild(wrap);
        setTimeout(function() { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 4000);

    }

    function reset() {

        clearTimers();

        state = { seeds: [4,4,4,4,4,4,4,4,4,4,4,4], score: [0, 0], turn: 0 };
        busy = false;
        over = false;

        render('Your move. Pick a pit.');

    }

    build();
    reset();
    restartEl.addEventListener('click', reset);


    /* ---------- Coming-soon card: tap to peek ---------- */

    var peek = document.getElementById('by-peek'),
        panel = document.getElementById('by-peek-panel');

    if (peek && panel) {

        peek.addEventListener('click', function() {

            var open = peek.getAttribute('aria-expanded') === 'true';

            peek.setAttribute('aria-expanded', open ? 'false' : 'true');
            panel.hidden = open;

            peek.querySelector('.by-peek-label').textContent =
                open ? 'Tap to peek at the idea 👀' : 'Hide the idea';

        });

    }

})();
