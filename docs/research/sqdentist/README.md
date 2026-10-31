# SQ Dentist branding update

Local SQ Dentist landing page with original SQ logos, photography, fonts, clinic information and user-supplied doctor profiles and patient videos.

## Asset mapping

| Local section | SQ Dentist original |
| --- | --- |
| Header and footer | `logo-gold.png`, original transparent landscape logo |
| First banner | `clinic.webp`, clinician reviewing a digital scan |
| Other banners | `consultation.webp`, `hero.webp`, `team.webp` |
| Introduction arch | `team.webp`, clinician with an international patient |
| Implant service card | `hero.webp`, original transparent implant illustration |
| Technology section | `technology.webp` |
| Consultation section | `clinic.webp` |
| Dental tourism | `city.webp` background and `airplane.webp` foreground |
| Patient gallery | `result-kevin.webp`, `result-joan.webp`, `result-saaed.webp` |
| FAQ illustration | `sterilization.webp` |
| Favicon | `favicon.png`; the same original is also encoded into the app ICO |

`asset-map.json` records each live URL, dimensions, actual format, SHA256 and original-file verification. All photographs, the logo and the airplane remain unedited; their framing is handled in CSS. Generic interface icons are retained from the cloned layout. Fonts now use SQ's original Helvetica Neue files.

## Content and destinations

Brand, address, phone, email, WhatsApp, social profiles, doctors, services and policy links were checked against the current public SQ Dentist homepage. The observed official information is in `source-observations.json`.

- Phone and WhatsApp: `+84 90 2455 745`.
- Email used locally: `cskh@sqdentist.vn` (user-requested override; the public source originally displayed `contact@sqdentist.vn`).
- Address: `292 Pham Van Hai St., Tan Son Nhat Ward, Ho Chi Minh City, Vietnam`.
- Operating licence displayed by the source: `11053/HCM-GPHD`.
- Company displayed by the source: `SQ GROUP INTERNATIONAL DENTAL COMPANY LIMITED`.


The three source result images are individual portraits, not before/after composites. Their section now says Patient Stories, with the original first names and accurate alt text. Portraits remain unaltered.

## Behavior and scope

`https://www.sqdentist.com/` supplies brand/content/assets to local `/`; the local design follows the previously cloned layout. Local About, Services, Results and Contact anchors work. Secondary service, doctor and policy pages open on the official SQ site. Both forms POST validated data to `/api/contact`, sending automatically through Google Workspace to `cskh@sqdentist.vn`. No email-app action is needed on success. Failed requests preserve data and offer a current mailto/copy fallback. This update remains local.

Run `npm run dev` for local work, or `npm run check` for lint, TypeScript and production build. The current preview uses `http://127.0.0.1:3001/`.

## SQ colour palette

The user also requested the source website's colours. The palette was checked against the rendered public homepage and its current local source. `src/app/sq-theme.css` adapts it to the cloned structure: warm canvas `#fbf8f1` / `#f4efe6` / `#e8dfd2`, silver panels `#e3e8ec` / `#f0f3f5`, gold `#b88b2f`, readable gold `#80601f`, graphite text `#111317`, and black/white primary actions. The header uses a light glass surface; the footer uses the source's `#f4f7f9` to `#e7eef2` gradient. Original image pixels and logo colours are preserved. Banner gradients retain readable dark text while revealing the photography.

## Verification

Typography now uses the source's original HelveticaNeueCyr Thin (100), Roman (400) and Medium (500) TTF files, copied unchanged from `D:\source_sq_com\public\font` into `public/sites/sqdentist/fonts/`. Live computed styles on sqdentist.com confirmed Helvetica Neue for navigation, visible section copy and headings. The clone's previous BT Beau Sans, Beausite and system-font hero overrides have been replaced. Fonts are served locally with `font-display: swap`. Desktop/mobile browser checks confirm the new family and no horizontal overflow; `font-desktop.png` records the update.

- `npm run check`: lint, TypeScript and production build pass.
- Browser checks at 1440px, 768px, 390px and 320px: no horizontal document overflow.
- Original SQ images load successfully; rendered content uses SQ Dentist branding and contact information.
- Phone, WhatsApp, email and warranty-policy destinations match SQ. The consultation form validates data before submission and offers a current email draft only when automatic delivery fails.
- Patient portrait dialog opens and closes with Escape; FAQ and mobile Services menu work. Selecting a local navigation destination closes the mobile menu.
- Desktop and mobile evidence: `desktop-1440.png` and `mobile-390.png`. No browser console errors were observed during the final checks.

## Consultation forms and email setup

**Current mode: automatic Google Workspace SMTP.** The user supplied an App Password for the `cskh@sqdentist.vn` account. It is stored only in Git-ignored `.env.local` and was not copied into source, docs or logs. Both forms send to `/api/contact`, disable duplicate submissions while pending/after success, show success only after SMTP acceptance, and retain values on failure. Manual email and copy controls remain as fallbacks. The previous mailto-only mode is superseded.

Verified 2026-10-31: SMTP connection/authentication succeeded; a clearly marked synthetic `SQ-FORM-CHECK` request returned HTTP 200 with `ok: true`, after Google accepted the recipient. Exactly one test message was sent. Inbox placement has not been independently inspected. Same-origin requests using `127.0.0.1:3001` are accepted against the incoming Host, accounting for Next URL normalization; cross-origin requests return 403 and invalid fields return 422. The rendered homepage contains two automatic send buttons and no old mailto-only submit button.


Shared validation trims names/location, rejects blank or whitespace-only values, checks optional email and treatment selection, and normalizes valid national/international phone numbers with `libphonenumber-js/max`. The selector includes 245 countries/territories, with common destinations first. `phone-countries.json` stores consistent English labels to prevent browser/server ICU differences causing hydration errors. Regenerate labels when updating the phone metadata.

Forms show field errors, focus the first invalid field, disable editing/submission while sending, retain entered values on failures, and clear old status/fallback drafts on edits. Requests are validated again on the server. A fixed recipient prevents changing the destination through the request. A honeypot, input limits, same-origin check and process-local throttle help limit abuse; scaled deployments should use a shared throttle. No patient data or SMTP secrets are logged.

Copy `.env.example` to `.env.local` and set `SMTP_HOST`, `SMTP_PORT` (587 STARTTLS or 465 TLS), `SMTP_USER`, `SMTP_PASSWORD`, and an authorized `SMTP_FROM`. Restart the server. Keep credentials server-only; never add `NEXT_PUBLIC_` or commit `.env.local`. The SMTP provider accepts the message before the route returns success; inbox delivery still depends on the provider and domain configuration. Reference: https://nodemailer.com/smtp.

The private `.env.local` uses `smtp.gmail.com`, port 587 and `cskh@sqdentist.vn` as user/from. Credentials are server-only and excluded from Git. App Passwords require 2-Step Verification and may be unavailable under organization policies. Google reference: https://support.google.com/accounts/answer/185833. Production deployments must configure their own server environment variables; local configuration is not published automatically.

`node scripts/check-smtp.mjs` verifies connection/authentication without sending email or printing secrets. Gmail App Password spacing is normalized on the server. The current account passed this verification and the real API send path passed the synthetic test described above.


Validation regression checks: `node scripts/check-consultation.mjs` (Vietnam plus Australia, UK, US, Canada, Singapore, Germany, Japan and India; whitespace, invalid email/phone/country/treatment, long messages and normalization). Browser checks cover field errors, the unavailable-service fallback, stale-state removal, 245 options and mobile overflow. Updated form evidence: `form-fixed-desktop.png`.

The country picker now shows a local SVG flag beside all 245 country/territory labels and the current selection, with search by name, ISO code or calling code. Flags come from the MIT-licensed `flag-icons` package; its `sh-ac` and `sh-ta` assets are mapped to the phone metadata's `AC` and `TA`. The license is retained in `public/sites/sqdentist/flags/LICENSE`. Both forms share the picker, including Arrow keys/Enter/Escape, outside-click dismissal and an empty-results state. Desktop/mobile selection and flag loading were verified; evidence: `country-flags.png`.

## Doctor portraits and biographies

`DoctorsSection.tsx` adds `#dentists` before the patient videos. It presents Dr. Le Thi Hien, Dr. Hoang Phan Bich Nghi and Dr. Nguyen Viet Hung in the user's supplied order, with their exact specialty, focus, description, three treatment lines and approach statement. Biography details are user-provided, not independently verified credentials. No experience counts, qualifications, awards or outcome statistics were added.

Portraits were copied byte-for-byte from the three supplied files into `public/sites/sqdentist/doctors/`. Source mapping and SHA256 verification are in `doctors-assets.json`. Original pixels, transparency and faces remain unchanged; CSS frames the portraits, and Next Image serves optimized sizes. The section now follows the portrait-pill implementation in the source app DoctorsPage.tsx and DoctorPortraitPill.tsx (reference https://www.sqdentist.com/doctors): metallic rounded shells, protruding portraits, dark name/role overlays, implant discipline labels, large specialty text, ruled treatment rows and the original SQ flower divider. Layout is three columns at 1024px and above, one centered column below. Supplied doctor identities and original portraits remain in place, including Dr. Nguyen Viet Hung rather than the third doctor on the reference page. Existing Meet Our Dentists links now target the local section. Verified: the section and all names render at local `/`, appear before `#videos`, and all three image-optimization URLs return HTTP 200/image-webp. Lint, TypeScript and production build pass.

Doctor restyle checks: homepage and both decorative assets return HTTP 200. Rendered desktop/mobile comparison remains unverified because browser inspection was unavailable.

## Flight-ticket enquiry popup

`FlightOfferPopup.tsx` displays a native modal after scroll position reaches 50% of the scrollable document distance, with a complimentary flight-ticket offer for returning to Vietnam for dental treatment. Terms beside the offer ask the visitor to confirm eligibility, coverage and arrangements with the clinic; no ticket value, route, minimum treatment spend or expiry has been invented. The content follows the site's English language.

The popup styling was subsequently aligned with sqdentist.com's Contact and Tourism sections: the original local Helvetica Neue Roman/Thin fonts, `#e3e8ec` to `#f4f7f9` silver background, gold gradient heading, transparent underline fields (`#c8d4db` with gold focus), and a charcoal pill button. The original SQ logo, city panorama and airplane illustration replace the generic plane-icon tile. Overrides are scoped to `.flight-offer`; the other enquiry forms retain their existing appearance. The source contact section and live homepage were re-read for this adaptation; no exact rendered-match claim is made.

The popup is limited to one display per browser-tab session using `sessionStorage`, with an in-memory fallback if storage is blocked. It does not interrupt a focused form or another open dialog. A successful enquiry from any shared form suppresses a later popup in that session. Opening pauses gallery videos. Native dialog behavior supplies focus containment and Escape; a visible close control and outside-backdrop click dismiss it and restore prior focus. The responsive modal scrolls internally on short/mobile viewports.

The reused form has unique `flight-offer-enquiry` IDs and sends `campaign: flight-ticket` through the existing validated SMTP route to `cskh@sqdentist.vn`. The server only recognizes that fixed campaign value, adding a fixed flight-offer subject/body label so the clinic can identify the promotion. No further test email was sent for this addition. Threshold regression checks cover below, at and above 50%, plus non-scrollable documents; `npm run check` checks integrated types/lint/build.

## Local video section

Current gallery: Eric, Stuart and Patient Experience show initially. A charcoal SQ-style **View more** button reveals Peter Kelly and Sasiya (the two new user-supplied files); **View less** pauses/unmounts those additional players and collapses them. The button exposes expanded state and the grid relationship for assistive technology. New players/posters mount only after expansion and retain `preload="none"`. John Sweeney remains excluded as requested; its original media files are preserved. New source files: `PETER KELLY - THAILAND.mp4` and `VIDEO 22-6 MRS SASIYA.mp4`, both portrait 9:16. Their web copies and five-second poster frames follow the existing media pipeline; source-to-web details are appended to `video-inventory.json`.

The initial version of `src/components/sites/sqdentist/VideoGallery.tsx` rendered the first four user-supplied videos in a new `#videos` section between Modern Technology and the main enquiry form. Three portrait clips retain their 9:16 framing; John Sweeney retains landscape 16:9. Desktop uses a three-column portrait row plus a wider landscape card; mobile stacks the cards. Original filenames and metadata are recorded in `video-inventory.json`.

Original MP4 files in `public/sites/sqdentist/videos/` are preserved. The gallery serves separate H.264/AAC web copies under `videos/web/`, scaled to 720px portrait width / 720px landscape height using FFmpeg CRF 24, fast preset, AAC 128 kbps and `+faststart`. Combined size is 52,772,467 bytes versus 754,821,534 source bytes (about 93% smaller). JPEG posters under `videos/posters/` are actual frames at 5 seconds, without changing their content. Source footage includes burned-in text/subtitles; no separate caption tracks were supplied.

Players use native controls, `playsInline`, `preload="none"`, no autoplay, and pause other gallery players when one starts. A playback error provides a direct video link. All four optimized files passed a decode check; MP4 atom inspection confirms `moov` precedes `mdat`. Browser checks confirmed all four reach playable state, playback progresses, previous players pause, initial readiness remains zero before user interaction, and the mobile layout has no horizontal overflow. Lint, TypeScript and production build pass. Evidence: `videos-desktop.png` / `videos-mobile.png`.

To add or rename a video later, update the `videos` array in `VideoGallery.tsx`, supply a web copy and poster in the corresponding folders, and set `landscape` to match the footage. This update remains local.

## Current source paths

The landing page component is `src/components/sites/sqdentist/SQDentistHome.tsx`. Interface icons use descriptive names in `public/sites/sqdentist/icons/`. Original reference-site assets, capture files and acquisition scripts have been removed at the user's request. The source route, forms, doctor profiles, videos and popup remain in place.

## Font loading and weight alignment

The three local Helvetica Neue font files match SHA256 hashes of the original source app Thin, Roman and Medium assets. Root layout now loads them through next/font/local with preload, swap and a shared CSS variable. Display headings use Thin (100), body copy Roman (400), and navigation, controls and emphasis Medium (500). Legacy Arial overrides and unsupported 300/700 declarations were removed. Font synthesis permits italic styling but avoids synthetic bold. Doctor and popup section-specific weights remain explicit. This update was verified by build and local font HTTP requests; rendered browser comparison remains unverified.
