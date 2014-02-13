/**
 * @type {Performance}
 */
performance;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
    switch (request) {
        case 'css-perf':
            calculate();
            break;
    }
    sendResponse(true);
});

function calculate(){
    var raw_result, result, i0, l0, i1, l1, i2, l2, ru, t, s, ss, els, el, _F, href;

    raw_result = {};
    result = {};

    for (i0 = 0, l0 = document.styleSheets.length; i0 < l0; i0++) {
        ss = document.styleSheets[i0].cssRules;

        href = document.styleSheets[i0].href;

        if (!ss) {
            //todo - i.e. github doesn't allow to read the document.styleSheets[XX].cssRules; Same origin ?
            continue;
        }

        if (href) {
            href = href.match(/[^\/]+$/)[0];
        }

        for (i1 = 0, l1 = ss.length; i1 < l1; i1++) {
            ru = ss[i1];

            t = 0;

            s = performance.now();

            if (!ru.selectorText || ru.selectorText[0] === '@') {
                //todo - skip selectors started from @ char: ie @font-face { font-family: Helvetica; }
                continue;
            }

            els = document.querySelectorAll(ru.selectorText);

            s = performance.now() - s;

            for (i2 = 0, l2 = els.length; i2 < l2; i2++) {
                el = els[i2];

                el.style.visibility = "hidden";
                el.style.visibility = "";
                t -= performance.now();
                _F = el.offsetWidth;
                t += performance.now();
            }

            if (typeof raw_result[ru.selectorText] === 'undefined') {
                raw_result[ru.selectorText] = [];
            }

            raw_result[ru.selectorText].push({
                total  : t,
                select : s,
                length : l2,
                href   : href
            });
        }
    }

    for (i0 in raw_result) {
        if (raw_result.hasOwnProperty(i0)) {
            els = raw_result[i0];
            l0 = els.length;

            els.forEach(function(el, i1){
                var ru = i0;

                if (l0 > 1) {
                    ru += ' (' + i1 + ')';
                }

                result[ru] = {
                    'querySelectorAll (ms)' : parseFloat(el.select.toFixed(3)),
                    'Source'                : el.href,
                    'R-n average (ms)'      : el.length > 0 ? parseFloat((el.total / el.length).toFixed(3)) : 0,
                    'R-n (ms)'              : parseFloat(el.total.toFixed(3)),
                    'Matches'               : el.length
                };
            });
        }
    }

    console.table(result);
}
