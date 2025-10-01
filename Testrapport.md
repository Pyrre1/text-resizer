# Testrapport
## Översikt
Modulen är testad med Jest och enhetstester kontrollerar förväntad funktion, både i förväntade situationer och specialfall med olika grad av saknade eller felformulerad indata.
Testerna har körts via `npm run test` eller `npm test`

## Testresultat enhetstester

| Test | Vad testas/förväntas | Resultat |
|---|---|---|
| Text Resizer - increase() | Testar så ett element blir ett *steg* större efter att increase() har körts en gång | ✅ PASS - 14 + 2 = 16px |
| Text Resizer - increase at max | Testar så element inte blir större än maxvärde  | ✅ PASS - max 40, 40 + 2 -> 40px |
| Text Resizer - decrease() | Testar så ett element blir **-**ett *steg* mindre efter att decrease() har körts en gång | ✅ PASS - 14 + (-2) = 12px |
| Text Resizer - decrease at min | Testar så element inte blir mindre än minvärde | ✅ PASS - min = 8, 8 + (-2) -> 8px |
| Text Resizer - set text size to max | Sätter elementet till maxvärde direkt | ✅ PASS - element size 12px, max 40: setTextToMax() -> 40xp |
| Text Resizer - set text size to max after other manipulations | Sätter maxvärde även efter andra manipulationer | ✅ PASS - element size 12px,  max 40: decrease() + setTextToMax() -> 40xp |
| Text Resizer - set text size to min | Sätter till minsta storlek direkt | ✅ PASS - element 12px, min 8: setTextToMin() -> 8px |
| Text Resizer - restore() | Återställer originalvärde på storlek oavsett manipulation | ✅ PASS - element size 12px: increase() + increase() + decrease() + restore() -> 12px |
| Text Resizer - miltiple id:s | Testar så det fungerar med flera parrallella id's | ✅ PASS - h1 32px, p 12px, step 2: increase() -> h1 34px, p 14px |
| Text Resizer - target elements, class and id | Testar att selektor kan vara element, id eller klass | ✅ PASS - h1 class="test1" 32px, p 12px, div id="test2" 16px, selector: '.testH1', 'p', '#textArea'; increase() -> h1 34px, p 14px, div 18px |
| Text Resizer - font styling | Byter mellan serif eller sans-serif | ✅ PASS - changeFont() fontFamily: 'serif' changeFont() fontFamily: 'sans-serif' |
| Text Resizer - restore original font style | Tar bort inline-fonten  | (PASS) - men kommer behöva skrivas om så inlinestyle innan manipulation kan återställas |
| Utility test - convert multiple units to uniform unit (pixels) | Om det inte finns en universell enhet översätts alla enheter till px | ✅ PASS - Kör utan att avbrytas. (kräver en faktisk rendering/visuellt test för att översätta och kontrollera relativa enheter till ett pixelvärde.) |
| Utility test - increase() - relative units and relative step | Både enheter och steg är samma enhet - (kontroll) | ✅ PASS |
| Utility test - convert comma as decimal | Om step är angivet som sträng ersätt med decimal och ta bort text. | ✅ PASS - step = 0,2em -> 0.2 och räknar på det.|
| Utility test - handle step "out of bounds" for relative units | Testar scenario där step troligen är angiven i px men sominanta enheten är relativ (em) | ✅ PASS |
| Utility test - set default value for step to 2px if step < 1 | Testar scenario där step troligtvis är angiven som relativ men dominanta enheten är i px, default till step: 2px | ✅ PASS |
| Utility test - set default value for step to 2px if < 1, even if written as decimal | Samma men för komma istället för punkt | ✅ PASS |

- Framgång: 100% cleared
- Totalt antal tester 20
- Totalt antal testsuites 2