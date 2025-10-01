# Testrapport
## Översikt
Modulen är testad med Jest och enhetstester kontrollerar förväntad funktion, både i förväntade situationer och specialfall med olika grad av saknade eller felformulerad indata.
Testerna har körts via `npm run test` eller `npm test`

## Testresultat enhetstester

| Test | Vad testas/förväntas | Resultat |
|---|---|---|
| Text Resizer - increase() | Testar så ett element blir ett *steg* större efter att increase() har körts en gång | ✅ PASS - 14 + 2 = 16px |
| should not increase text size beyond maxSize | Testar så element inte blir större än maxvärde  | ✅ PASS - max 40, 40 + 2 -> 40px |
| Text Resizer - decrease() | Testar så ett element blir **-**ett *steg* mindre efter att decrease() har körts en gång | ✅ PASS - 14 + (-2) = 12px |
| should not decrease text size beyond minSize | Testar så element inte blir mindre än minvärde | ✅ PASS - min = 8, 8 -2 -> 8px |
|  |  | ✅ PASS - |
|  |  | ✅ PASS - |