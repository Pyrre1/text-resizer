# Reflektion - kodkvalitet.
## Namngivning (kapitel 2)
### Överblickstabell:
| Namn för klasser/metoder | Regler |
|---|---|
| createTextResizerController() | **Use Intention-Revealing Names** - visar att en *controller* för 'Text Resizer' skapas. Även namnet Text Resizer förklarar vad modulen är tänkt att göra, även om tillbyggnation för att uppnå kodrader ledde till fler stödfunktioner så är huvudmålet tydligt|
| increase()/decrease() | **Method Names** - verb som beskriver exakt vad som händer. |
| normalizeStep() | **Use Searchable Names** - lätt att hitta och lätt att förstå syftet. Alternativt namn som övervägdes var sanitizeStep(), men då den bara ersätter komman med punkt och inte hanterar annan sanitisering valde jag ett något mer neutralt namn som mer följer graden av påverkan. |
| originalTextSizes | **Make Meaningful Distinctions** - skiljer sig från en generell textSizes och förklarar att det gäller de initiala storlekarna. |
| stepUnit/dominantUnit | **Avoid Mental Mapping** - direkt överblickbart och förklarande, inte onödiga förkortningar som su/du |
| convertStepToUnit() | **Use Pronounceable Names** - lätt att uttala |
| generellt i koden | **Don't Be Cute** & **Don't Pun** - jag har undvikit att lägga till roliga eller gulliga namn även om det ibland kanske skulle kännas bra i stunden för att lätta upp tråkiga passager. |

### Sammanfattande reflektion:
Då jag hade svårt att komma igång hann jag läsa boken innan jag skrev större delen av koden och det gjorde att glasögonen för "rätt flöde" redan var på. För det mesta följer jag naturligt reglerna från Clean Code till en viss grad. Det jag innan läst kapitel kanske tenderade att göra var att prioritera kortare namn över tydliga namn - jag faller mer naturligt åt readability på viss bekostnad av understandability.

Min "computeAdjustedSize" fick sig en resa från en första getNextStep, där jag tänke ha mer matematik i den filen och fylla på med getPreviousStep, getMaxStep, getMinStep osv. Men jag insåg att "next step" inte var så förklarande och bytte till calculateNextStep som blir lite tydligare i *vad* den gör men öppnade dörren för DRY och jag insåg att ett ökat steg är bara ett minus från ett minskat steg och om jag gör den generell kan den ta hand om båda fallen. 
Jag valde då att döpa om den till det lite mer generella computeAdjustedSize - där *Compute* berättar att den beräknar något, *Adjusted* berättar att något ändras och *Size* att det är storleken som påverkas.

Liknande småförändringar har skett löpande och till viss del kommenterats för att ge extra tydlighet även om jag känner att kommentarerna borde skrivas rent och mer uniformt för att inte sänka läsbarheten som de i vissa fall gör nu.

## Funktioner & metoder (kapitel 3)
### Överblickstabell:
| Metod/funktion | Kodrader | Regler |
|---|---|---|
| increase()/decrease() | ~15 | **Do One Thing** - påverkar bara storleken på vald text, men har en del relaterad felhantering gällande yttre min/max-gräns. Jag upplevde att läsbarhet och förståelse fick väga tyngre än att dela upp på för många små delar som måste samarbeta. **Have No Side Effects** - det som ändras är bara det som är önskat. **Function Arguments** - båda de yttre (increase och decrease) är utan argument, internt kallar de på beräkningen med två argument (nuvarande storlek och hur stort ett steg är) och då det är själva funktionen ser jag inget sätt att ha två variabler utan att skicka in dem **DRY** båda funktionerna lider av samma behov av sanitering men med viss variation (max/min som yttre värde) varför jag valt att ha viss repetition i koden då det finns mindre skillnader i delar av repetitionen. |
| restore() | ~6 | **Command Query Separation** - återställer genom att ta bort pålagd data, gör bara en sak men kan komma att behöva skrivas om för att hantera inline styling från utvecklare. |
| convertStepToUnit() | ~30 | **Function  Arguments** - bryter denna regel då den tar många argument, då den är intern och jag behövt lägga till många argument för att åstakomma önskat resultat har jag för nu överseende med den. På sikt borde den delas upp eller packeteras om för att inte kräva så många argument. **One Level of Abstraction** konverterar utan att parsa eller manipulera DOM |
| calculateAverageStepRelativeStep() | ~25 | **Use Descriptive Names** - delvis uppfyllt. Här fick jag avväga läsbarhet och förståelse. Den kalkulerar ett snittvärde i relativt värde för step om step är angivet i ett absolutvärde eller om step är "out of bound" |
| validateStep() | ~15 | **Don’t Use Flag Arguments** - validerar utan att skicka boolskt värde som svar. |

### Sammanfattande reflektion:

Jag har även här fått tänka extra på att skriva tydligt, inte bara kort och läsbart. Men mitt största bekymmer var att minimera argument och minska enskilda funktioners storlek.
En lärdom som gett mycket tydlighet var hur det går att tänka kring de argument som skickas med i en funktion och hur den används som needForConversion(stepUnit, dominantUnit, parsedStep) där stepUnit och dominantUnit jämförs för att se om parsedStep går att använda eller ej. 
hade jag skrivit mer som jag tidigare tänkt skulle exempelvis (step, unit, value) inte gett samma förståelse för vad som händer eller fortsatt arbeta med utveckling av koden senare.

Jag gick in med ett mindset av att kod ska vara liten och effektiv, men inser absolut tjusningen i att skriva tydlig kod som är lätt att följa nu, för att senare kunna sätta sig in i koden. Trots försök att göra koden tydlig förstår jag att det fortfarande kommer kännas som en röra för en oinsatt programmerare att försöka se mina tankebanor och uppgiften har gett mer respekt åt konsten att skriva lätt, tydlig och överblickbar kod.
Främsta exemplet på lärdom som dessutom går att slipa ännu mer är den flera gånger omskrivna computeAdjustedSize().

## Reflektion över egen kodkvalitet.
Sittandes med sista putsar såg jag brister i koden som jag får ta och åtgära vid ett annat tillfälle, vilket dessutom skulle göra koden mer läsbar och flyta på bättre. 

Att gå från att tänka på kod som något som bara matas ut och är OK så länge den uppfyller önskad uppgift till att se att koden själv har en underliggande funktion - att läsas av migsjälv i framtiden eller andra som arbetar på samma projekt.

Jag har nog främst sett på kod som en engångslösning och med en allt för hög tilltro till migsjälv tänkt att "Självklar kan jag lösa detta så bra att det inte kommer behöva kompletteras, jag får bara se till att skriva den så komlpex och komplett som det bara går så kommer den klara allt"
Oj så fel det går att ha... Bara under denna uppgiften och främst efter senaste workshopen insåg jag hur extremt blottad man är i skriven kod. Du kan inte försöka säga att "jag kom på den främsta lösningen, alla kommer förstå" eller anta att andra kommer komma fram till samma lösning.

Lite "Lagt kort ligger" - Skriven kod är skriven, men koden slutar ju inte där. Mågon annan ska förhoppningsvi använda det som skapas, och då kommer framtida nya bekymmer upptäckas, fler användare kanske testar funktioner som inte var tänkta att åstakomma med koden och den kommer behöva lappas och lagas.

Jag har nog historisk sett haft en för stor tilltro till "jag tar det sen" och "jag kommer komma ihåg X". Efter denna kurs känns det mer som att det kommer bli en utmaning i att veta när en bit kod kan anses klar och tydlig nog, inte att bli klar så snabbt som möjligt.
