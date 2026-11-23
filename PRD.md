# Currency Wars: Arti-Coin 시뮬레이션 게임 PRD

Nov 23, 2026 · @ESTHER

## 1. 개요

**Currency Wars: Arti-Coin**은 학생이 한 나라의 대통령 겸 중앙은행장이 되어 10년(10턴) 동안 나라의 돈을 운영하는 웹 시뮬레이션 게임이다. 선택 하나하나가 빵값, 국민 신뢰, 일자리, Arti-Coin 환율을 바꾸고, 그 결과로 나라가 흥하거나 망한다.

- **배경:** 화폐 변천사 프로젝트(로마 데나리온 → 송·원 지폐 → 스페인 금·은화 → 명·청 은본위 → 고려 은병·조선 상평통보 → 미국 달러·비트코인)에서 배운 내용을 직접 체험으로 연결한다.
- **핵심 메시지:** 돈은 신용(trust)으로 움직인다. 사람들이 믿으면 돈이고, 믿지 않으면 종이·쇳조각이다.
- **핵심 목표:** 인플레이션·디플레이션·스태그플레이션이 *왜* 생기는지를 학생이 자기 선택의 결과로 경험하고, 그 순간 쉬운 영어 정의 카드로 개념을 배운다.
- **산출물 형태:** 브라우저에서 돌아가는 단일 웹앱(설치·로그인 없음), 교실 프로젝터와 태블릿 모두 지원.

## 2. 대상 사용자와 영어 수준

게임 안의 모든 영어는 미국 초등 2학년 읽기 수준(AR 2.0\~2.9)에 맞춘다. 경제 용어는 어렵더라도 그 용어를 설명하는 문장은 반드시 쉬워야 한다.

| 항목 | 기준 |
| --- | --- |
| 주 사용자 | 화폐 변천사 프로젝트 참여 학생 (모둠 2\~3명 또는 개인) |
| 보조 사용자 | 교사 (게임 설정, 수업 진행, 결과 비교) |
| 문장 길이 | 한 문장 10단어 이하, 한 화면에 최대 3문장 |
| 어휘 | Dolch/Fry 기초 어휘 중심; 경제 핵심어 10개만 새로 가르침 (8장 단어 카드) |
| 문법 | 현재형·단순 과거형, 능동태, 관계사절 금지 |
| 숫자 | 빵 한 개 값처럼 눈에 보이는 물건으로 표현; 퍼센트(%)는 화살표·색으로 대체 |
| 듣기 지원 | 모든 문장에 읽어주기(🔊) 버튼 — 브라우저 Web Speech API |
| 아이콘 | 모든 수치에 그림 아이콘 (빵, 하트, 망치, 동전) |

**문장 예시 (기준선):**

- ✅ "You made more coins. Now bread costs more."
- ✅ "People do not trust your money. They stop using it."
- ❌ "Excessive monetary expansion led to a rapid rise in the general price level."

교사 설정에서 한국어 힌트(용어 뜻 한 줄)를 켜고 끌 수 있게 하되, 기본값은 끔(영어 몰입 수업 원칙).

## 3. 학습 목표

게임을 마친 학생은 아래 다섯 가지를 자기 말(영어)로 한두 문장 설명할 수 있어야 한다. 100% 이해보다 "내가 돈을 더 찍었더니 빵값이 올랐다" 같은 **원인→결과의 흐름**을 스스로 찾아내는 것이 목표다.

1. **신용(Trust):** 돈의 가치는 사람들의 믿음에서 나온다. 약속을 어기면 돈의 값이 떨어진다.
2. **인플레이션(Inflation):** 물건은 그대로인데 돈만 늘면 값이 오른다.
3. **디플레이션(Deflation):** 돈이 모자라면 값이 내려가고, 사람들이 안 사서 가게와 일자리가 힘들어진다.
4. **스태그플레이션(Stagflation):** 물건이 줄어들면(전쟁·가뭄·수입 끊김) 값은 오르고 일자리는 줄어드는 두 가지 나쁨이 동시에 온다.
5. **기축통화와 환율:** 내 나라 돈의 가치는 다른 나라가 얼마나 믿어 주느냐에 달려 있고, 그걸 Arti-Coin 환율로 볼 수 있다.

**부가 목표:** 대통령(나라 돈을 쓰는 사람)과 중앙은행(돈의 양을 정하는 사람)의 역할이 다르다는 것, 그리고 나중에 세금을 배울 때 쓸 기초 감각.

## 4. 세계관: Time World의 6개 나라와 Arti-Coin

서로 다른 시대의 나라들이 한 지도(**Time World**)에 동시에 존재하고, 모두 \*\*Arti-Coin(AC)\*\*이라는 가상 기축통화로 무역한다는 설정이다. 나라는 지리적으로 세 지역(유럽·동아시아·아메리카)으로 묶고, 각 나라는 역사 속 화폐 한 가지와 그 화폐가 실제로 겪은 위기 하나를 갖는다.

| 지역 | 나라 (게임 이름) | 화폐 | 돈의 종류 | 시작 특징 | 역사 속 위기 (배울 현상) |
| --- | --- | --- | --- | --- | --- |
| 유럽 | Rome | Denarius (은화) | 금속 동전 | 신뢰 높음, 군대 유지비 큼 | 은 함량을 줄인 동전 → 인플레이션 (3세기 위기) |
| 유럽 | Spain | Gold Escudo / Silver Real | 금·은화 | 금·은 보유량 매우 많음, 생산 약함 | 신대륙 은이 쿠아져 들어옴 → 가격혁명(인플레이션) → 국가 파산 |
| 동아시아 | Great Khan (송·원) | Chao (지폐) | 종이돈 | 무역 활발, 종이돈 인쇄 쉬움 | 지폐 남발 → 큰 인플레이션 → 신뢰 붕괴 |
| 동아시아 | Silver Dragon (명·청) | Silver Tael (은괴) | 은본위 | 생산력 매우 큼, 은을 외국에 의존 | 은이 들어오면 호황, 은이 빠져나가면 디플레이션 |
| 동아시아 | Morning Calm (고려·조선) | 은병 → 상평통보 | 은 → 동전 | 농업 중심, 동전 적음 | 동전 부족(전황) → 디플레이션 / 당백전 → 인플레이션 |
| 아메리카 | United States | Dollar + Bitcoin | 금본위 → 신용화폐 | 신뢰·생산 모두 높음, 중앙은행(Fed) 보유 | 석유 파동 → 스태그플레이션 / 비트코인 가격 등락 |

**역사 사실 확인 메모:** 진나라는 지폐가 아니라 동전(반량전)을 통일한 나라이고, 정부 지폐는 송나라 교자(후에 원나라 교초)에서 시작된다. 그래서 게임에서는 지폐 나라를 '송·원'으로 묶고, 진나라의 동전 통일은 이 나라의 역사 이벤트 카드로 넣는다. ‘어음’ 대신 ‘지폐(paper money)’로 표기한다.

**지역 연결(무역로):** Spain → Silver Dragon 은 무역로(마닐라 갤런선)가 있어, Spain의 은 정책이 Silver Dragon의 물가에 직접 영향을 준다. Morning Calm은 Silver Dragon·Great Khan과 이웃이라 이들 화폐 환율의 영향을 받는다.

**Arti-Coin 규칙:**

- 게임이 운영하는 'World Bank of Arti'가 발행하며 한 해 약 2%씩만 천천히 늘어난다 (안정적인 기준점).
- 모든 나라 화폐는 "1 AC = 몇 Denarius"처럼 AC 환율을 갖는다. 게임 시작 시 각 나라의 화폐 가치 지수는 100.
- 수입품(향신료·석유·비단 등)은 AC로 결제하므로, 내 돈 가치가 떨어지면 수입품이 비싸진다.
- 신뢰가 0이 되면 국민이 자국 돈 대신 AC를 쓰기 시작한다 ("People use Arti-Coin now.") — 화폐 주권을 잃는 망함 상태. 게임 오버 대신 다시 일어서는 Rebuild 모드로 이어간다.

## 5. 게임 루프와 턴 구조

1턴 = 1년이고, 한 판은 10년이다. 매 해 같은 6단계를 반복하며, 하나의 턴은 약 2분 안에 끝난다.

&#91;embedded content: 게임 루프 · 1년 6단계, 10년 반복\]

학생이 결과를 보기 전에 항상 먼저 예측(4 Guess)하게 해서, 선택→결과의 연결을 스스로 떠올리게 만드는 것이 루프의 핵심이다.

| 단계 | 학생이 하는 일 | 예상 시간 |
| --- | --- | --- |
| 1 News | 이벤트 카드 읽기·듣기 | 15초 |
| 2 President | 대통령 카드 3장 중 1장 | 20초 |
| 3 Central Bank | 중앙은행 카드 3장 중 1장 | 20초 |
| 4 Guess | 빵값 ⬆️⬇️➡️ 예측 | 10초 |
| 5 Result | 수치 변화 애니메이션 + (해당 시) 단어 카드 | 30초 |
| 6 Year Report | 그래프·화폐 순위 확인, 다음 해 누르기 | 15초 |

## 6. 플레이어 역할과 정책 카드

플레이어는 매 해 **대통령 카드 1장 + 중앙은행 카드 1장**을 고른다. 모둠 플레이에서는 한 명이 대통령, 한 명이 중앙은행장을 맡아 서로 설득하게 한다 (실제 정부–중앙은행 긴장 관계 체험).

| 역할 | 게임 속 설명 (영어) | 관리하는 것 |
| --- | --- | --- |
| President 👑 | "You lead the country. You spend and collect money." | 나라 금고(Treasury), 세금, 지출, 무역 |
| Central Bank 🏦 | "You make the money. You decide how much." | 통화량(Money), 금리(Interest), 동전 금속 함량, 금·은 보유고 |

### President 카드 (공통)

| 카드 | 영어 문구 | 효과 (엔진 입력) |
| --- | --- | --- |
| Build Farms & Roads | "Build roads. Make more food." | 금고 −15, 다음 2년 생산 +4%/년 |
| Raise Taxes | "Take more taxes." | 금고 +15, 행복 −8, 생산 −1% |
| Cut Taxes | "Take less taxes." | 금고 −10, 행복 +6, 소비 +2% |
| Open Trade | "Trade with other lands." | 생산 +3%, 수입 가능, 환율 영향 커짐 |
| Close Borders | "Close the gates." | 수입 차단, 생산 −2%, 물가 +2% |
| Go to War | "Send the army." | 금고 −25, 생산 −5%, 승리 시 금·은 + (확률) |
| Borrow Money | "Borrow money. Pay it back later." | 금고 +20, 빚 +20 (매년 이자), 갚지 못하면 신뢰 −20 |

### Central Bank 카드 (공통)

| 카드 | 영어 문구 | 효과 (엔진 입력) |
| --- | --- | --- |
| Make a Little Money | "Make a little more money." | 통화량 +5% |
| Make Lots of Money | "Make lots and lots of money!" | 통화량 +30%, 금고 +20 |
| Take Money Back | "Take some money back." | 통화량 −5% |
| Raise Interest | "Make borrowing cost more." | 통화량 증가 −3%p, 생산 −1%, 일자리 −2 |
| Lower Interest | "Make borrowing cost less." | 통화량 증가 +3%p, 생산 +1%, 일자리 +2 |
| Keep It Steady | "Do not change anything." | 변화 없음, 신뢰 +2 (예측 가능성) |
| Back It with Gold/Silver | "Keep gold to back the money." | 보유고 필요, 신뢰 +8, 통화량 증가 제한 |

### 나라별 특수 카드 (게임당 최대 2회)

| 나라 | 특수 카드 | 효과와 숨은 위험 |
| --- | --- | --- |
| Rome | Less Silver in Coins | 동전 수 +25%, 금고 +20. 2턴 뒤 발각되면 신뢰 −20 |
| Spain | Treasure Ships | 금·은 +40, 통화량 +25%. 생산은 그대로라 물가 급등 |
| Great Khan | Paper Only! | 금속 동전 금지, 지폐 인쇄 비용 0. 통화량 상한 사라짐 |
| Silver Dragon | Pay Taxes in Silver | 금고 안정 +10. 은 수입 끊기면 디플레 위험 2배 |
| Morning Calm | Big 100-Coin (당백전) | 통화량 +40%, 금고 +25. 신뢰 −15, 물가 급등 |
| Morning Calm | Make More Sangpyeong Coins | 통화량 +10% — 전황(디플레) 해결용 |
| United States | Leave the Gold Standard | 보유고 제한 해제, 이후 통화량 자유. 신뢰는 정책 일관성에 달림 |
| United States | Buy Bitcoin | 금고로 비트코인 보유. 총량 고정(21M)이지만 매 턴 가치가 ±40% 안에서 크게 흔들림 |

카드 수치는 모두 `data/cards.json`에 두고, 플레이테스트로 조정한다 (12장 밸런스 기준 참고).

## 7. 경제 시뮬레이션 엔진

엔진은 "돈의 양 ÷ 물건의 양 = 가격"이라는 화폐수량설을 아주 단순하게 줄인 모델에, **신뢰(Trust)가 돈이 도는 속도를 바꾼다**는 규칙 하나를 더한 것이다. 화면에는 수식이 절대 나오지 않고, 결과는 빵값·아이콘·도시 풍경으로만 보여준다.

### 상태 변수 (나라별)

| 변수 | 코드 이름 | 범위 / 시작값 | 화면 표현 |
| --- | --- | --- | --- |
| 통화량 | `money` | 양수, 100 | 동전 더미 크기 |
| 생산(물건의 양) | `goods` | 양수, 나라별 80\~120 | 시장 가판대의 물건 수 |
| 신뢰 | `trust` | 0\~100, 나라별 50\~80 | 하트 게이지 |
| 물가 (빵값) | `breadPrice` | 계산값, 시작 10 | 🍞 빵 한 개 값 |
| 일자리 | `jobs` | 0\~100, 80 | 망치 개수 |
| 행복 | `happiness` | 0\~100, 70 | 국민 얼굴 이모지 |
| 금고 | `treasury` | 정수, 50 | 금고 상자 |
| 빚 | `debt` | 0 이상, 0 | 빨간 쪽지 |
| 금·은 보유고 | `reserve` | 0 이상, 나라별 | 금괴 더미 |
| 금리 | `interest` | 0\~10, 3 | 다이얼 |
| AC 환율 지수 | `acValue` | 시작 100 | 화폐 순위표 |

### 한 해(턴) 계산 순서

1. 이벤트 카드 효과 적용 → 대통령 카드 → 중앙은행 카드 순서로 입력값 합산.
2. 통화량과 생산을 업데이트한다.

```latex
M_{t+1} = M_t \times (1 + m_{card} + m_{event})
```

```latex
G_{t+1} = G_t \times (1 + g_{base} + g_{card} + g_{event} - 0.005 \times (r_t - 3))
```

3. 신뢰로 돈의 회전 속도를 구한다. 신뢰가 낮으면 사람들이 돈을 빨리 써버리려 해서 값이 더 오른다.

```latex
V_t = 1 + \frac{50 - T_t}{100}
```

4. 빵값과 인플레이션율을 계산한다 (k는 시작 빵값이 10이 되도록 맞춘 상수).

```latex
P_t = k \times \frac{M_t \times V_t}{G_t}, \qquad \pi_t = \frac{P_t - P_{t-1}}{P_{t-1}}
```

5. 일자리: 생산이 늘면 오르고, 금리가 높거나 디플레이션이면 줄어든다.

```latex
J_{t+1} = J_t + 100 \times g_t - 1.5 \times (r_t - 3) - 40 \times \max(0, -\pi_t)
```

6. 신뢰 업데이트 (표), 행복 업데이트, AC 환율 업데이트 후 0\~100으로 자른다.

| 조건 | 신뢰 변화 |
| --- | --- |
| 물가 변화 ±3% 이내 (안정) | +5 |
| Keep It Steady 또는 Back It with Gold 카드 | +2 / +8 |
| 인플레이션 10% 초과 | −10 |
| 인플레이션 50% 초과 | −25 |
| 동전 금속 함량 줄인 것이 발각됨 | −20 |
| 빚을 갚지 못함 | −20 |

```latex
H_{t+1} = H_t + 0.3 \times (J_{t+1} - J_t) - 50 \times |\pi_t| + h_{card}
```

```latex
AC_{t+1} = AC_t \times \frac{1 + \pi_{world}}{1 + \pi_t} \times (0.9 + 0.2 \times \frac{T_{t+1}}{100})
```

- `π_world`는 Arti-Coin 자체의 연 2% 상승률. 내 나라 물가가 세계보다 빨리 오르거나 신뢰가 낮으면 내 돈 가치가 떨어진다.
- 다른 5개 나라는 AI가 운영한다: 나라별 성향(Rome은 동전 깎기 선호, Great Khan은 인쇄 선호 등)에 따라 역사 흐름을 대체로 따라가는 스크립트 + 약간의 무작위.
- 모든 계수는 `src/engine/config.ts` 한 곳에 모아 튜닝한다. 무작위는 시드(seed) 기반으로 해서 같은 시드면 같은 게임이 재현되게 한다 (모둠 간 비교용).

## 8. 경제 현상 감지와 단어 카드

매 턴 결과 계산 뒤 엔진이 현상을 판정하고, 처음 발생한 현상이면 \*\*단어 카드(Word Card)\*\*가 화면 가운데 뜬다. 카드는 ① 단어 ② 쉬운 정의 ③ "방금 네 나라에서 일어난 일" 한 줄 ④ 역사 속 실제 사례 한 줄로 구성되고, 수집한 카드는 **My Money Words** 단어장에 쌓인다.

### 현상 판정 규칙 (우선순위 순)

| 우선 | 현상 | 판정 조건 | 화면 연출 |
| --- | --- | --- | --- |
| 1 | Hyperinflation | π > 50% | 빵값 숫자가 폭주, 수레에 돈을 실고 빵 사러 가는 그림 |
| 2 | Stagflation | π > 5% **그리고** 일자리 −3 이상 감소 (또는 생산 감소) | 빵값↑ 화살표 + 망치↓ 화살표 동시에 |
| 3 | Inflation | π > 5% | 빵값 빨간 화살표↑ |
| 4 | Deflation | π < −2% | 빵값 파란 화살표↓ + 텐 빈 가게 |
| 5 | Stable Prices | −2% ≤ π ≤ 3% | 초록 별, 붐빔는 시장 |
| 별도 | Lost Trust | 신뢰 ≤ 10 | 사람들이 동전을 버리고 AC를 쓰는 그림 |

### 단어 카드 10종 (AR 2 수준 영어)

| 단어 | Easy Definition | 방금 일어난 일 (예시) | 역사 사례 |
| --- | --- | --- | --- |
| Money | Money is a thing people agree to trade with. | You used coins to buy bread. | People used shells, salt, and coins. |
| Trust | Money works when people believe in it. | People trust your coins. Your coins are strong. | Roman coins were trusted for a long time. |
| Inflation | Prices go up. Your money buys less. | You made lots of money. Bread costs more now. | Rome put less silver in its coins. Prices went up. |
| Hyperinflation | Prices go up very, very fast. | Bread cost 10. Now it costs 100! | Too much paper money in the Yuan time. |
| Deflation | Prices go down. People wait to buy. Shops sell less. | There are not enough coins. Shops are empty. | Joseon did not have enough coins. |
| Stagflation | Prices go up, but jobs go down. Two bad things at once. | Oil stopped coming. Bread costs more. Jobs are gone. | America had this in the 1970s. |
| Interest Rate | The price you pay to borrow money. | You raised interest. People borrow less. | Central banks change it every year. |
| Exchange Rate | How much of one money you need to get another money. | Now 1 Arti-Coin = 15 Denarius. | Countries trade money every day. |
| Reserve Currency | The money all lands use to trade. | Everyone trades with Arti-Coin. | Silver and the dollar were used by many lands. |
| Central Bank | The bank that makes a country’s money. | You are the bank. You decide. | The US has the Fed. |

단어 카드는 다음 세 단계로 노출한다.

1. **예측:** 결과를 보여주기 전에 "Will bread cost more or less?" ⬆️ / ⬇️ / ➡️ 를 고르게 한다.
2. **결과 + 이름 붙이기:** "This is called INFLATION!" 단어 카드 등장, 읽어주기 자동 재생.
3. **한 문제 확인:** 다음 턴 시작 전 간단한 퀄즈 1문항 (그림 2개 중 하나 고르기). 틀려도 벌점 없음.

역사 사례 문구는 수업 자료로 쓰기 전에 공신력 있는 출처(박물관·교과서·중앙은행 교육 자료)로 한 번 더 검수한다.

## 9. 역사 이벤트 카드

매 해 시작에 **News 카드** 1장이 나온다. 나라별 역사 이벤트 3장은 정해진 해에 반드시 등장하고(학생이 실제 역사와 같은 상황을 맞닥뜨리게), 나머지 해는 공통 이벤트 카드에서 무작위로 뽑는다.

### 나라별 역사 이벤트 (각 3장)

| 나라 | 등장 해 | 영어 뉴스 문구 | 효과 | 실제 역사 |
| --- | --- | --- | --- | --- |
| Rome | 2 | "The army wants more pay." | 금고 −20 | 로마 군대 급여 부담 |
| Rome | 5 | "Bad harvest. Less food." | 생산 −6% | 3세기 위기 |
| Rome | 8 | "The emperor sets a price list." | 물가 상한 고정, 생산 −4% | 디오클레티아누스 가격 칙령 (301년) |
| Spain | 2 | "We found a silver mountain!" | 보유고 +30 | 포토시 은광 (1545년) |
| Spain | 5 | "Ships bring silver to Asia." | Silver Dragon으로 은 이동 가능 | 마닐라 갤런 무역 (1571년\~) |
| Spain | 8 | "The king cannot pay his debts." | 빚 있으면 신뢰 −20 | 펠리페 2세 국가 파산 (1557년 등) |
| Great Khan | 1 | "All coins are now one kind." | 신뢰 +10 | 진시황 반량전 통일 (기원전 221년) |
| Great Khan | 3 | "Paper money! It is light and easy." | 무역 +, 인쇄 카드 해금 | 송 교자(1024년)·원 중통초(1260년) |
| Great Khan | 7 | "We need money for war." | 금고 −30 | 원나라 말기 전쟁·지폐 남발 |
| Silver Dragon | 2 | "Pay all taxes in silver now." | 특수 카드 해금 | 일조편법 (1580년대) |
| Silver Dragon | 5 | "Silver comes from across the sea." | 통화량 +10% | 아메리카 은 유입 |
| Silver Dragon | 8 | "Silver leaves to buy opium." | 통화량 −15% | 19세기 초 청나라 은 유출 |
| Morning Calm | 1 | "A silver vase is our big money." | 신뢰 +5, 일상 거래 불편 | 고려 은병 (1101년) |
| Morning Calm | 4 | "New coins for everyone!" | 특수 카드 해금 | 상평통보 전국 유통 (1678년) |
| Morning Calm | 7 | "People hide coins. Coins are hard to find." | 통화량 −12% | 18세기 전황 |
| United States | 2 | "We print paper money for the war." | 통화량 +20% | 독립전쟁 컨티넨탈 화폐 |
| United States | 5 | "Banks close. People are scared." | 신뢰 −15, 통화량 −10% | 1930년대 대공황 (디플레이션) |
| United States | 8 | "Oil stops coming!" | 생산 −8% | 1973년 석유파동 (스태그플레이션) |

### 공통 이벤트 카드 (무작위)

| 카드 | 영어 문구 | 효과 |
| --- | --- | --- |
| Good Harvest | "Lots of food this year!" | 생산 +5% |
| Storm | "A big storm hit the farms." | 생산 −5% |
| New Invention | "Someone made a new tool!" | 생산 +4% (2년) |
| Trade Fair | "Traders come from far away." | 무역 중이면 AC 환율 +5 |
| Rumor | "People say your coins are fake." | 신뢰 −8 |
| War! | "An enemy attacks! We must fight." | 2년 동안 금고 −15/년, 생산 −6%/년, 일자리 −4, 행복 −10. 이 해에는 중앙은행 카드에 Make Lots of Money가 반드시 나옴 (전쟁 비용을 돈 찍어 메우는 유혹) |
| War Nearby | "Two lands near you are at war." | 수입 끊김: 생산 −3%, 물가 +3%. Open Trade 중이면 AC 환율 −5 |
| Peace at Last | "The war is over. People are happy." | War! 카드 2년 뒤에만 등장. 행복 +10, 신뢰 +5, 다음 해 생산 +3% |
| Quiet Year | "Nothing big happened." | 변화 없음 |

War! 카드는 게임당 최대 1회, 3년차 이후에만 나오게 한다. 생산은 줄고 돈은 늘기 쉬운 상황이라, 학생이 스태그플레이션과 인플레이션을 직접 겪기 좋은 카드다 (컨티넨탈 달러·원나라 지폐와 같은 흐름). 대통령이 스스로 고르는 Go to War 카드와는 별개로, 이 카드는 내 뜻과 상관없이 닥치는 전쟁이다.

역사 이벤트의 연도와 사실은 개발 전 출처를 붙여 `data/events.json`에 저장하고, 학생 화면에는 연도 대신 "Long ago in Rome" 같은 표현을 쓴다.

## 10. 화면 구성과 UX

한 화면에는 한 가지 일만 하게 한다. 모든 버튼은 최소 64px, 글자는 본문 20px 이상, 모든 숫자 옆에 아이콘을 붙인다.

| # | 화면 | 핵심 요소 | 비고 |
| --- | --- | --- | --- |
| 1 | Title | 게임 이름, Play / How to Play / Teacher 버튼 | How to Play는 그림 4캷 + 읽어주기 |
| 2 | Pick Your Land | Time World 지도, 6개 나라 카드 (화폐 그림, 강점 1개, 약점 1개) | 선택 후 나라 이름 보여주고 모둠 이름 입력 |
| 3 | Pick Your Job | 모둠이면 President/Bank 역할 나누기, 개인이면 건너뜀 | 역할 배지 이미지 |
| 4 | Dashboard (메인) | 왼쪽: 나라 상태 6개 (빵값, 신뢰, 일자리, 행복, 금고, AC 환율) / 가운데: 도시 풍경 / 오른쪽: 연도 표시 | 도시 풍경은 상태에 따라 5단계 (번영\~망함) |
| 5 | News | 이벤트 카드 크게 1장, 읽어주기 자동 | "OK" 버튼 하나 |
| 6 | President Choice | 카드 3장 제시 (전체 7장 중 무작위 3장 + 특수 카드) | 카드를 누르면 뒤집혀 효과 힌트 표시 |
| 7 | Bank Choice | 동일 구조, 중앙은행 카드 3장 | 선택 전 "Are you sure?" 없음 (속도 유지) |
| 8 | Guess! | "Will bread cost more or less?" ⬆️⬇️➡️ | 예측 정답률을 기록 |
| 9 | Result | 숫자가 올라가는 애니메이션 (약 3초), 변화가 큰 지표 강조 + 단어 카드 | "Why?" 버튼: 원인 한 줄 (예: "You made lots of money, but goods stayed the same.") |
| 10 | Year Report | 빵값 꺾은선 그래프 (1년\~현재), AC 화폐 순위표 (6개국) | 다른 나라 뉴스 한 줄 |
| 11 | The End | 흥망 결과 4단계 (Golden Age / Strong / Struggling / Fallen), 10년 요약 그래프, 모은 단어 카드 | 인쇄용 결과지 (PDF/인쇄) |
| 12 | My Money Words | 수집한 단어 카드 모아보기 | 언제든 메인에서 볼 수 있음 |

### 최종 결과 점수 (흥망 판정)

```latex
Score = 0.3 \times T + 0.25 \times H + 0.2 \times J + 0.25 \times \min(100, AC)
```

| 점수 | 결과 | 영어 문구 |
| --- | --- | --- |
| 80 이상 | Golden Age 🌟 | "Your land is rich and happy. People trust your money!" |
| 60\~79 | Strong 💪 | "Your land is doing well." |
| 40\~59 | Struggling 😟 | "Times are hard. Your money is weak." |
| 40 미만 | Fallen 🏚️ | "People stopped trusting your money." |

망한 결과도 실패가 아니라 배움으로 보여준다: 끝 화면에 "What would you do differently?" 질문과 함께 가장 큰 영향을 준 선택 1개를 짚어준다.

**접근성:** 색만으로 의미를 전달하지 않고 항상 화살표·아이콘을 함께 쓴다. 태블릿 가로 화면(1024×768)과 프로젝터(1920×1080) 기준으로 디자인한다.

## 11. 수업 운영과 교사 모드

한 게임(10턴)은 20\~25분 안에 끝나도록 설계하고, 수업은 3차시로 운영한다. 모둠 구성은 기존 화폐 타임라인 프로젝트의 모둠(로마 / 중국 / 미국 등)을 그대로 가져와, 자기가 조사한 나라를 직접 운영하게 하면 연결이 가장 강하다.

| 차시 | 활동 | 게임 사용 |
| --- | --- | --- |
| 1차시 | 교사 시연 (프로젝터, "Make Lots of Money"를 계속 눌러 하이퍼인플레이션 보여주기) → 모둠별 첫 판 | 1판 풀플레이 |
| 2차시 | 같은 시드로 다시 플레이, 전략 바꾸기 → 모둠별 결과 비교 (화폐 순위표) | 1판 + 비교 |
| 3차시 | 프로젝트 라이팅: "A Letter to My People" — 대통령으로서 국민에게 내 선택과 결과를 설명하는 편지 (단어 카드 2개 이상 사용) | 결과지 인쇄본을 보고 쓰기 |

### 교사 모드 (Teacher 버튼, 4자리 PIN)

- **게임 설정:** 턴 수(6 / 8 / 10), 난이도(Easy는 무작위 이벤트 끄기), 특정 나라만 열기, 한국어 힌트 켜기.
- **같은 세계 코드:** 시드를 4자리 코드로 보여주고, 모든 모둠이 같은 코드로 시작하면 같은 이벤트가 나와 결과를 공정하게 비교할 수 있다.
- **일시정지 버튼:** 단어 카드가 뜨면 교사가 반 전체에 물어볼 수 있도록 "Teacher Talk" 질문 한 줄을 함께 보여준다 (예: "Why did bread cost more?").
- **결과 내보내기:** 끝 화면을 인쇄 / PNG 저장. 매 턴 기록(선택한 카드, 예측, 결과)을 표로 보여준다.
- **저장:** 브라우저 localStorage에 진행 중 게임 1개 자동 저장 (수업이 끊겨도 다음 시간에 이어하기).

### 교사용 부록 자료 (게임 밖)

- 단어 카드 10장 인쇄본 (교실 벽 타임라인 옆에 붙일 수 있게).
- "My President Plan" 워크시트: 플레이 전 전략 적기 → 플레이 후 결과 적기.

## 12. 기술 스택과 Claude Code 개발 단계

서버 없는 정적 웹앱으로 만들고 Vercel에 배포한다. 경제 엔진은 화면과 완전히 분리한 순수 함수로 짜서, 화면 없이도 테스트로 밸런스를 확인할 수 있게 한다.

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | React 18 + Vite + TypeScript |
| 상태 관리 | Zustand (게임 상태 1개 스토어) |
| 스타일 | Tailwind CSS |
| 애니메이션 | Framer Motion (숫자 카운트, 카드 뒤집기) |
| 그래프 | Recharts (빵값 꺾은선, 화폐 순위) |
| 음성 | Web Speech API (`speechSynthesis`, en-US, 속도 0.9) |
| 테스트 | Vitest (엔진 단위 테스트 + 밸런스 시나리오) |
| 저장 | localStorage |
| 배포 | Vercel |

### 폴더 구조

```
currency-wars/
  CLAUDE.md                ← 이 PRD 요약 + 영어 수준 규칙
  src/
    engine/                ← 화면과 무관한 순수 로직
      config.ts            ← 모든 계수
      simulate.ts          ← simulateYear(state, choices, event, rng)
      detect.ts            ← 현상 판정
      ai.ts                ← AI 나라 선택 로직
      rng.ts               ← 시드 기반 난수
    data/
      nations.json  cards.json  events.json  words.json
    screens/               ← Title, PickLand, Dashboard, News, Choice, Guess, Result, Report, End, Words, Teacher
    components/            ← StatBar, Card, WordCard, SpeakButton, CityScene
    store/game.ts
  tests/
    engine.test.ts  balance.test.ts
```

### 개발 단계 (Claude Code에 한 단계씩 요청)

1. **Phase 0 — 세팅:** Vite 프로젝트 생성, Tailwind·Zustand·Vitest 설치, `CLAUDE.md` 작성 (영어 문장 규칙 포함).
2. **Phase 1 — 엔진:** 7장의 수식을 `simulate.ts`로 구현, 8장 판정 규칙을 `detect.ts`로. 화면 없이 콘솔에서 10년 돌려보는 스크립트 포함.
3. **Phase 2 — 데이터:** 4·6·8·9장의 표를 JSON으로 옮기기.
4. **Phase 3 — 밸런스 테스트:** 아래 시나리오가 모두 통과할 때까지 `config.ts` 조정.
5. **Phase 4 — 화면:** 10장의 화면 순서대로, 먼저 동작하는 회색 박스 버전 → 그 다음 일러스트·애니메이션.
6. **Phase 5 — 학습 기능:** 예측(Guess), 단어 카드, 읽어주기, My Money Words.
7. **Phase 6 — 교사 모드·인쇄·저장.**
8. **Phase 7 — 플레이테스트 후 배포:** 아이 1\~2명과 시범 플레이, 막히는 문장·버튼 수정, Vercel 배포.

### 밸런스 수용 기준 (`balance.test.ts`)

| 시나리오 | 기대 결과 |
| --- | --- |
| 매년 Keep It Steady + 무작위 이벤트 끄기 | 10년 내내 물가 변화 ±3% 안, 결과 Strong 이상 |
| 매년 Make Lots of Money | 4년 안에 Hyperinflation 발생, 결과 Fallen |
| 매년 Take Money Back | 3년 안에 Deflation 발생, 일자리 감소 |
| 석유 충격 + Make Lots of Money | 그 해 Stagflation 발생 |
| Rome: Less Silver 2회 | 발각 후 신뢰 30 이하 |
| 적절한 혼합 전략 (Build + Make a Little + Back with Gold) | Golden Age 도달 가능 |
| 같은 시드·같은 선택 | 결과가 완전히 동일 |

## 13. 범위, 성공 지표, Claude Code 시작 프롬프트

### MVP에서 빼는 것

- 실시간 멀티플레이 (각 모둠은 자기 기기에서 AI 나라들과 경쟁; 모둠 간 비교는 같은 세계 코드로) → v2.
- 나라 간 직접 거래·전쟁 대상 지정 → v2.
- 계정·로그인·서버 저장.
- 실제 비트코인 시세·실제 환율 연동 (모두 가상 수치).
- 역사적으로 정확한 경제 모델: 흐름을 감각으로 익히는 단순화가 목적이다.

### 성공 지표

| 지표 | 목표 |
| --- | --- |
| 한 판 플레이 시간 | 25분 이내 |
| 예측(Guess) 정답률 | 게임 후반 5턴이 전반 5턴보다 높아짐 |
| 단어 이해 | 게임 후 Inflation·Deflation·Stagflation·Trust 중 3개 이상을 자기 말로 설명 |
| 라이팅 | "A Letter to My People"에 원인→결과 문장 2개 이상 |
| 도움 요청 | 화면 조작 때문에 교사를 부르는 횟수 판당 2회 이하 |

### 열린 질문

- 한 차시 수업 시간이 몇 분인지에 따라 기본 턴 수(6/8/10)를 정한다.
- 교실 기기: 모둠당 태블릿 1대가 가능한지, 아니면 프로젝터 1대로 돌아가며 하는지 (아니면 v1에 핫시트 모드 추가).
- 나라 일러스트: 직접 그릴지, 이모지·무료 아이콘으로 시작할지.

### Claude Code 시작 프롬프트 (복사해서 사용)

```
Read PRD.md in this folder. It describes "Currency Wars: Arti-Coin", a money-history
simulation game for kids who read English at a US Grade 2 level.

Start with Phase 0 and Phase 1 only:
1. Create a Vite + React + TypeScript project with Tailwind, Zustand and Vitest.
2. Write CLAUDE.md that summarizes the PRD and these rules:
   - All player-facing English: max 10 words per sentence, max 3 sentences per screen,
     present or simple past tense, no economic jargon except the 10 Word Card words.
   - The engine in src/engine must be pure functions with no React imports.
   - All tuning numbers live in src/engine/config.ts.
3. Implement simulateYear() and detectPhenomenon() exactly as in sections 7 and 8,
   with a seeded RNG.
4. Write tests/balance.test.ts with every scenario in the balance table (section 12).
   Tune config.ts until all tests pass. Show me the 10-year bread price for each scenario.

Do not build any screens yet. Stop after the tests pass and summarize what you tuned.
```

화면 단계에서는 "Now do Phase 4. Build the screens in section 10 as plain gray boxes first."처럼 단계별로 이어서 요청한다. 이 문서를 Markdown으로 내보내 프로젝트 폴더에 `PRD.md`로 넣어 두면 된다.
