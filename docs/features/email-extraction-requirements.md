# Email extraction requirements

## 1. Цель

Email extraction находит email-адреса в manual input text, нормализует их и передаёт в Contact matching.

Email extraction не должен быть самописной проверкой вида:

* есть `@`;
* есть точка после `@`;
* нет пробелов.

Это недостаточно и не является полноценным extractor’ом.

---

## 2. Источник правил

Email extraction должен использовать:

1. RFC-compatible email parser или проверенную библиотеку для email parsing.
2. RFC 5322 как базовый источник синтаксиса email/mailbox.
3. RFC 6531 / SMTPUTF8 как future-compatible источник для internationalized email, если продукт решит поддерживать non-ASCII адреса.
4. WHATWG / HTML email validation можно использовать только для простого UI-поля email, но не как единственный extractor из произвольного текста.

---

## 3. Вход

Email extractor получает:

* raw text из manual input;
* default business id;
* existing contacts текущего business.

---

## 4. Что нужно извлекать

Extractor должен находить:

1. Простые email-адреса:

   * `jonas@example.com`

2. Email внутри angle brackets:

   * `Jonas Petraitis <jonas@example.com>`

3. Email рядом с label:

   * `Email: jonas@example.com`
   * `E-mail: info@company.lt`
   * `Contact: sales@example.com`

4. Несколько email в одном тексте:

   * `to: a@example.com, b@example.com`

5. Email с display name:

   * `UAB Baltic Parts <info@balticparts.lt>`

---

## 5. Алгоритм

1. Candidate extraction

   * Найти email/mailbox candidates через RFC-compatible parser или библиотеку.
   * Не ограничиваться самописным regex.
   * Не считать любой текст с `@` валидным email.

2. Cleanup

   * Убрать окружающую пунктуацию, если она не является частью email:

     * `.`
     * `,`
     * `;`
     * `:`
     * `)`
     * `]`
     * `>`
   * Сохранить original fragment отдельно.

3. Parsing

   * Распарсить candidate как email/mailbox.
   * Если есть display name, отделить display name от actual email address.
   * Если email находится внутри `< >`, извлечь address внутри brackets.

4. Normalization

   * Domain part привести к lowercase.
   * Local part не менять агрессивно.
   * Для matching можно использовать lowercase normalized email, но original email нужно сохранять.
   * Internationalized domain должен быть обработан через IDN/punycode-compatible механизм, если такая поддержка включена.

5. Validation

   * Проверить, что candidate является structurally valid email address.
   * Не делать DNS/MX проверку в Milestone 1.
   * Не проверять deliverability.
   * Не отправлять test email.

6. Contact matching

   * Сравнить normalized email с emails контактов текущего business.
   * Exact email match имеет высокий приоритет.
   * Если один email найден у нескольких контактов, вернуть multiple possible matches.
   * Если email не найден, но structurally valid, предложить create contact.
   * Если candidate похож на email, но невалиден, показать как invalid/uncertain email clue, а не создавать контакт автоматически.

---

## 6. Статусы результата

Для каждого email candidate extractor возвращает один из статусов:

### `valid_email`

Email структурно валиден и может использоваться для contact matching.

### `valid_mailbox_with_display_name`

Найден mailbox с display name, например:
`Jonas Petraitis <jonas@example.com>`.

### `possible_email_invalid`

Фрагмент похож на email, но parser не смог подтвердить валидность.

### `internationalized_email`

Email содержит non-ASCII части и требует SMTPUTF8 / IDN-aware поддержки.

### `not_email`

Фрагмент содержит `@`, но не является email.

---

## 7. Output fields

Для каждого найденного email система возвращает:

* original fragment;
* extracted email address;
* display name, если есть;
* normalized email for matching;
* domain;
* local part;
* validation status;
* matched contacts;
* confidence;
* reason.

---

## 8. UI behavior

Если email найден и совпадает с одним контактом:

* UI предлагает связать input с этим контактом.

Если email найден у нескольких контактов:

* UI показывает список возможных контактов.

Если email валиден, но контакта нет:

* UI предлагает создать новый контакт с этим email.

Если email похож на email, но невалиден:

* UI показывает его как uncertain email clue.
* Пользователь может исправить email или проигнорировать этот clue через очистку поля / Contact not needed.

---

## 9. Что запрещено

Email extractor не должен:

* использовать только проверку `@`;
* требовать точку в домене как единственное правило;
* валидировать email только самописным regex;
* автоматически создавать контакт;
* автоматически связывать контакт без user decision;
* проверять email через отправку письма;
* делать DNS/MX проверку в Milestone 1;
* менять local part агрессивной нормализацией;
* искать email в контактах других businesses.

---

## 10. Примеры

### Пример 1 — простой email

Input:

`Please send the invoice to jonas@example.com`

Expected:

* extracted email: `jonas@example.com`;
* status: `valid_email`;
* matching: exact email lookup in current business contacts.

---

### Пример 2 — display name

Input:

`Jonas Petraitis <jonas@example.com>`

Expected:

* display name: `Jonas Petraitis`;
* extracted email: `jonas@example.com`;
* status: `valid_mailbox_with_display_name`;
* matching: email first, display name as supporting clue.

---

### Пример 3 — email с label

Input:

`Email: info@balticparts.lt`

Expected:

* extracted email: `info@balticparts.lt`;
* label `Email:` is not part of the address;
* status: `valid_email`.

---

### Пример 4 — несколько email

Input:

`Send copy to jonas@example.com and accounting@example.com`

Expected:

* two separate email clues;
* each matched independently;
* each can create separate contact suggestion.

---

### Пример 5 — фрагмент с @, но не email

Input:

`Please check @jonas in the note`

Expected:

* not a valid email;
* status: `not_email`;
* no contact match by email.

---

### Пример 6 — internationalized email

Input:

`Контакт: δοκιμή@παράδειγμα.δοκιμή`

Expected:

* detect as internationalized email candidate;
* status: `internationalized_email`;
* handle only if SMTPUTF8 / IDN support is enabled;
* otherwise show as unsupported/uncertain, not silently discard.
