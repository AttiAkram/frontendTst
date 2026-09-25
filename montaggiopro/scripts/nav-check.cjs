// Checks the navigation-map rules in a real browser.
// Usage: npm run build && npx vite preview --port 4173  (in another terminal)  then: node scripts/nav-check.cjs
// Needs Playwright (npm i -D playwright). Set PW to a custom playwright path if needed.
const { chromium } = require(process.env.PW || 'playwright');
const B = 'http://localhost:4173/#';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const hash = () => page.evaluate(() => decodeURIComponent(location.hash.slice(1)));
  const go = async (p) => { await page.goto(B + p); await page.waitForTimeout(1200); };
  const ok = (name, cond, extra = '') => console.log(`${cond ? 'PASS' : 'FAIL'}  ${name} ${extra}`);

  await go('/checkout/pagamento');
  ok('checkout senza carrello → carrello', (await hash()) === '/cart', await hash());

  await go('/account');
  ok('account senza login → login?next', (await hash()) === '/login?next=/account', await hash());
  await page.click('text=Continua con Google'); await page.waitForTimeout(1600);
  ok('dopo login torna a next', (await hash()) === '/account', await hash());

  await go('/login');
  ok('login da connesso → account', (await hash()) === '/account', await hash());

  await go('/shop?category=audio&sort=price-asc');
  await page.waitForTimeout(800);
  await page.click('.pcard__name >> nth=0'); await page.waitForTimeout(1200);
  const crumbs = await page.locator('.crumbs-line').innerText();
  ok('breadcrumb prodotto', /Home[\s\S]*Shop[\s\S]*Audio/.test(crumbs), JSON.stringify(crumbs.replace(/\n/g, ' › ')));
  await page.click('.pagenav__move--back'); await page.waitForTimeout(1000);
  ok('Indietro dal prodotto → stessi risultati', (await hash()) === '/shop?category=audio&sort=price-asc', await hash());

  await page.click('.pcard__name >> nth=0'); await page.waitForTimeout(1200);
  await page.click('.buybox__cta .btn--cart'); await page.waitForTimeout(1200);
  ok('Avanti dal prodotto = Carrello (n)', /Carrello \(1\)/.test(await page.locator('.pagenav__move--fwd').innerText()));

  await go('/checkout/riepilogo');
  ok('salto al riepilogo senza indirizzo → indirizzo', (await hash()) === '/checkout/indirizzo', await hash());
  ok('indietro dal passo 1 = Carrello', /Carrello/.test(await page.locator('.pagenav__move--back').innerText()));
  await page.fill('input[autocomplete="name"]', 'Mario Rossi');
  await page.fill('input[autocomplete="street-address"]', 'Via Roma 1');
  await page.fill('input[autocomplete="postal-code"]', '20121');
  await page.click('button[type=submit]'); await page.waitForTimeout(900);
  ok('passo 2 spedizione', (await hash()) === '/checkout/spedizione', await hash());
  await page.goBack(); await page.waitForTimeout(900);
  ok('browser Indietro → passo 1 con dati conservati', (await hash()) === '/checkout/indirizzo' && (await page.inputValue('input[autocomplete="street-address"]')) === 'Via Roma 1');
  await page.goForward(); await page.waitForTimeout(900);
  await page.click('text=Continua'); await page.waitForTimeout(900);
  ok('passo 3 pagamento', (await hash()) === '/checkout/pagamento', await hash());
  await page.click('text=PayPal >> nth=0'); await page.waitForTimeout(300);
  await page.click('text=Rivedi ordine'); await page.waitForTimeout(900);
  ok('passo 4 riepilogo', (await hash()) === '/checkout/riepilogo', await hash());
  await page.click('.btn--buy >> text=/Paga/'); await page.waitForTimeout(2800);
  const h = await hash();
  ok('ordine confermato', h.startsWith('/ordine/'), h);
  await page.goBack(); await page.waitForTimeout(1200);
  ok('Indietro dopo il pagamento non riapre il pagamento', !(await hash()).startsWith('/checkout'), await hash());

  await go('/mappa');
  ok('pagina mappa', (await page.locator('.smap__node').count()) >= 8, `${await page.locator('.smap__node').count()} nodi`);
  await page.screenshot({ path: (process.argv[2] || '.') + '/mappa.png', fullPage: true });
  await go('/non-esiste');
  ok('404 fuori mappa', /non è sulla mappa/.test(await page.content()));
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no page errors');
  await b.close();
})();
