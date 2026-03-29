# yurari-web

海月ゆらりの公式サイトです。

## Δυνάμεις

- **Οἶκος** — εἰκὼν προσώπου, σύνδεσμοι πρὸς YouTube / X
- **Ἀρχεῖον τῶν Ἐκπομπῶν** — δεδομένα ἐκπομπῶν ἐκ Cloudflare D1
- **Γραφαὶ Ἀγγελιῶν** — ἀνάγνωσις τῶν γραφῶν ἑκάστης ἀγγελίας
- **Διαχείρισις** — ἀνάρτησις CSV πρὸς ἐνημέρωσιν τῆς βάσεως δεδομένων

## Τεχνικὴ Ἀρχιτεκτονία

- [Next.js](https://nextjs.org/) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [shadcn/ui](https://ui.shadcn.com/) v4
- TypeScript
- Cloudflare Pages + D1
- Cloudflare Access (Zero Trust)

## Ἀνάπτυξις

```bash
npm install
npm run dev
```

http://localhost:3000 — ὁ ἐξυπηρετητὴς ἀναπτύξεως.

## Ἐκτέλεσις

```bash
npm run build:worker
npm run deploy
```
