Phone extraction

Role:
Text Parser + Phone Parser.

Trigger:
Manual input text changed.

Input:
- raw text;
- default business country/region, если есть;
- user locale, если есть;
- existing contacts database.

Source of rules:
- libphonenumber / compatible metadata-based parser.
- E.164 as normalized output format.
- Region hint from default business or user locale, if available.

Algorithm:

1. Candidate detection
Система ищет в тексте фрагменты, которые могут быть телефонами:
- через libphonenumber findNumbers / equivalent;
- плюс лёгкий pre-scan по фрагментам с цифрами, чтобы не пропустить номера в грязном тексте.

2. Region hint selection
Если номер начинается с +:
- parse as international number.

Если номер без +:
- parse with region hint:
  - default business country, если задан;
  - иначе user locale country, если известен;
  - иначе mark as region_required / uncertain.

3. Parsing and normalization
Для каждого кандидата:
- parse through libphonenumber;
- remove formatting noise;
- detect country calling code;
- produce E.164 if valid;
- produce national format for display if region known.

4. Validation levels
Система различает:
- valid phone number;
- possible phone number;
- invalid phone-like fragment;
- uncertain because region is missing.

5. Matching with contacts
Система сравнивает номер с базой контактов:
- exact E.164 match;
- exact normalized national number match within same region;
- possible match if same last digits + same country/region hint;
- no match.

6. Result per phone candidate
Система возвращает:
- original text fragment;
- normalized E.164, if available;
- display format;
- region/country calling code, if detected;
- validation status;
- matched contacts;
- confidence;
- reason.

Rules:
- Не писать свои country masks руками.
- Не считать любой набор цифр телефоном.
- Не валидировать номер только regex’ом.
- Не требовать +, если есть region hint.
- Не сохранять номер как контакт без действия пользователя.
- Если region missing and no +, показывать uncertainty.
Пример того, как должно выглядеть в requirements
Examples:

Input:
+372 5555 1234

Expected:
- parse as international;
- validate through metadata;
- normalize to E.164 if valid;
- search contacts by E.164.

Input:
(555) 123-4567

Expected:
- cannot safely validate globally without region hint;
- if default business/user region = US, parse as US number;
- otherwise mark as uncertain / region required.

Input:
Tel: +44 20 7946 0958

Expected:
- strip label “Tel”;
- parse +44 as international;
- normalize;
- search contacts.

Input:
WhatsApp +48 600 700 800

Expected:
- strip label “WhatsApp” as channel clue;
- parse +48 number;
- channel hint = WhatsApp;
- phone number itself still validated by phone parser.