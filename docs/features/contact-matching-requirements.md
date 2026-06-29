# Contact matching requirements

## 1. Цель

Contact matching связывает найденные в тексте контактные признаки с контактами в базе текущего business.

Система не должна автоматически создавать финальную связь с контактом.
Она должна предложить пользователю возможный контакт, несколько вариантов, создание нового контакта или пустое поле.

---

## 2. Источник данных

Contact matching использует:

1. **Contact clues**, найденные Text Parser:

   * email;
   * телефон;
   * имя;
   * название компании;
   * company code / VAT code;
   * реквизиты;
   * подпись;
   * другие фрагменты, похожие на контакт.

2. **Контакты текущего default business**:

   * contact id;
   * name;
   * company name;
   * emails;
   * phones;
   * company code / VAT code;
   * aliases;
   * previous user corrections.

3. **Нормализованные значения**:

   * email в lowercase;
   * телефон в E.164, если удалось валидировать;
   * имя / компания без лишних пробелов, пунктуации, регистра и юридических суффиксов;
   * company code / VAT code без пробелов и разделителей.

---

## 3. Вход

Contact Matcher получает:

* default business id;
* список contact clues;
* базу контактов этого business;
* previous user corrections для этого business.

Contact Matcher не ищет по контактам других businesses в Milestone 1.

---

## 4. Алгоритм matching

Для каждого contact clue система выполняет matching в таком порядке:

### 4.1. Exact email match

Если contact clue содержит email:

1. нормализовать email;
2. найти контакты с таким же email;
3. если найден один контакт — вернуть сильное совпадение;
4. если найдено несколько контактов с тем же email — вернуть несколько возможных контактов.

Exact email match имеет самый высокий приоритет.

---

### 4.2. Exact phone match

Если contact clue содержит телефон:

1. распарсить номер через metadata-based phone parser;
2. нормализовать номер в E.164, если возможно;
3. найти контакты с таким же нормализованным номером;
4. если E.164 невозможен, искать только в рамках известного region hint;
5. если region hint отсутствует и номер без country code, вернуть uncertain phone clue.

Exact phone match имеет высокий приоритет, но не должен конфликтовать с exact email match.

---

### 4.3. Exact company code / VAT code match

Если contact clue содержит company code или VAT code:

1. нормализовать код;
2. найти контакты с таким же кодом;
3. если найден один контакт — вернуть сильное совпадение;
4. если найдено несколько — вернуть несколько возможных контактов.

---

### 4.4. Exact normalized name / company match

Если contact clue содержит имя или название компании:

1. нормализовать строку;
2. удалить лишнюю пунктуацию и пробелы;
3. привести к одному регистру;
4. сравнить с нормализованными именами, company names и aliases;
5. если найден один точный match — вернуть вероятное совпадение;
6. если найдено несколько — вернуть несколько возможных контактов.

---

### 4.5. Fuzzy name / company match

Если exact match не найден:

1. выполнить fuzzy matching по имени, компании и aliases;
2. учитывать похожесть строк;
3. учитывать частичные совпадения;
4. учитывать previous user corrections;
5. вернуть кандидатов только если score выше минимального порога.

Fuzzy match не должен автоматически становиться финальной связью.

---

### 4.6. Previous correction match

Если пользователь раньше исправлял похожий contact clue:

1. найти похожие previous corrections в рамках текущего business;
2. повысить score контакта, который пользователь выбирал раньше;
3. показать причину: “Based on previous correction”.

Previous correction не должна переопределять exact email / phone / company-code conflict.

---

## 5. Конфликты

Если разные признаки указывают на разных контактов, система не выбирает сама.

Пример:

* email указывает на Contact A;
* имя похоже на Contact B.

Результат:

* показать оба варианта;
* отметить conflict;
* пользователь должен выбрать контакт или очистить поле.

---

## 6. Результаты matching

Для каждого contact clue Contact Matcher возвращает один из статусов.

### 6.1. `one_strong_match`

Условия:

* найден один уверенный контакт;
* match основан на email, phone, company code, VAT code или очень сильном name/company match;
* нет конфликта с другими признаками.

UI:

* contact field предварительно заполнен найденным контактом;
* пользователь может оставить, заменить, очистить или отметить `Contact not needed`.

---

### 6.2. `multiple_possible_matches`

Условия:

* найдено несколько возможных контактов;
* или есть конфликт между разными признаками.

UI:

* показать список возможных контактов;
* пользователь выбирает один, выбирает другой через поиск, очищает поле или отмечает `Contact not needed`.

---

### 6.3. `no_match_enough_data`

Условия:

* контакт в базе не найден;
* данных достаточно для создания нового контакта.

Достаточно данных:

* email; или
* phone; или
* company name; или
* person name + хотя бы один дополнительный признак.

UI:

* предложить создать новый контакт;
* пользователь может создать, поправить данные, выбрать существующий контакт вручную, очистить поле или отметить `Contact not needed`.

---

### 6.4. `no_match_not_enough_data`

Условия:

* найден слабый контактный след;
* данных недостаточно для уверенного matching или создания контакта.

UI:

* показать пустое contact field с найденным текстовым следом;
* пользователь может выбрать контакт вручную, создать контакт вручную, оставить пустым или отметить `Contact not needed`.

---

### 6.5. `no_contact_clues`

Условия:

* Text Parser не нашёл контактных признаков.

UI:

* contact fields не показываются;
* flow продолжается.

---

## 7. Scoring rules

Contact Matcher должен возвращать score и reason.

Минимальные уровни:

### `exact`

Используется для:

* exact email;
* exact E.164 phone;
* exact company code;
* exact VAT code.

### `high`

Используется для:

* сильный normalized name/company match;
* несколько признаков указывают на один контакт.

### `medium`

Используется для:

* fuzzy name/company match;
* previous correction match;
* partial company/person match.

### `low`

Используется для:

* слабые фрагменты;
* неполные имена;
* номер без region hint;
* грязная подпись.

Low match не должен предлагаться как один уверенный контакт.
Он может быть показан только как возможный вариант или unresolved field.

---

## 8. Output fields

Для каждого contact clue система возвращает:

* original text fragment;
* clue type: email / phone / name / company / code / signature / mixed;
* normalized value, если есть;
* matched contacts;
* match status;
* confidence level;
* score;
* reason;
* conflict flag;
* suggested UI state.

---

## 9. UI behavior

UI показывает не “результат алгоритма”, а contact field.

Для каждого contact clue:

1. если найден один уверенный контакт — поле заполнено этим контактом;
2. если найдено несколько — поле показывает список вариантов;
3. если контакта нет, но данных достаточно — поле предлагает создать новый контакт;
4. если данных мало — поле остаётся пустым, но показывает найденный текстовый след;
5. если контактов нет — поле не показывается.

Пользователь может:

* оставить предложенный контакт;
* выбрать другой контакт;
* создать новый контакт;
* очистить поле;
* отметить `Contact not needed`.

Кнопки `Ignore` быть не должно.

---

## 10. Что сохраняется

До создания input item система хранит matching results только во временной input session.

После создания input item сохраняются:

* original contact clues;
* selected contact links;
* newly created contacts;
* empty contact fields;
* `Contact not needed` decisions;
* matching reasons;
* user corrections.

Не нужно сохранять отдельный `ignored contact clue`.

---

## 11. Что запрещено

Contact Matcher не должен:

* искать контакты в других businesses в Milestone 1;
* создавать контакт автоматически;
* создавать финальную связь без действия пользователя;
* выбирать между несколькими контактами без пользователя;
* считать fuzzy match точным;
* валидировать телефон regex-only;
* переопределять exact email / phone / company-code match через AI;
* использовать AI как основной matching mechanism.

---

## 12. AI Assist

AI Assist допускается только как вспомогательный слой.

AI Assist может:

* предложить дополнительные contact clues из грязного текста;
* помочь разобрать подпись;
* отделить имя от компании;
* объяснить, почему фрагмент похож на контакт.

AI Assist не может:

* валидировать phone/email/company code;
* заменить deterministic matching;
* выбрать финальный контакт;
* создать контакт;
* создать contact link.

---

## 13. Примеры

### Пример 1 — exact email match

Input text:

`Please contact jonas@example.com about the invoice.`

Contact database:

`Jonas Petraitis — jonas@example.com`

Expected result:

* clue: `jonas@example.com`;
* match status: `one_strong_match`;
* confidence: `exact`;
* UI: contact field prefilled with Jonas Petraitis.

---

### Пример 2 — multiple matches

Input text:

`Please call Jonas about the act.`

Contact database:

* Jonas Petraitis;
* Jonas Kazlauskas.

Expected result:

* clue: `Jonas`;
* match status: `multiple_possible_matches`;
* confidence: `medium`;
* UI: show both contacts for user selection.

---

### Пример 3 — no match, enough data

Input text:

`Send offer to UAB Baltic Parts, info@balticparts.lt.`

Contact database:

No matching contact.

Expected result:

* clues: `UAB Baltic Parts`, `info@balticparts.lt`;
* match status: `no_match_enough_data`;
* UI: suggest creating new contact with company name and email.

---

### Пример 4 — one existing, one new

Input text:

`Jonas confirmed. Also send copy to info@newclient.com.`

Contact database:

`Jonas Petraitis` exists.
`info@newclient.com` does not exist.

Expected result:

* Jonas → existing contact suggestion;
* [info@newclient.com](mailto:info@newclient.com) → create new contact suggestion;
* each contact field is resolved separately.

---

### Пример 5 — phone without region

Input text:

`Call 555 123 456.`

No default business region.

Expected result:

* phone clue detected;
* validation status: uncertain;
* match status: `no_match_not_enough_data`;
* UI: show empty contact field with phone clue and allow user to choose/create manually.
