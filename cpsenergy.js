import { chromium } from 'playwright';
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";
import {parse} from 'csv-parse';

export async function amount(username, password){
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext({ acceptDownloads: true });
  // Open new page
  const page = await context.newPage();
  // Go to https://www.cpsenergy.com/en.html
  await page.goto('https://www.cpsenergy.com/en.html', {waitUntil: 'networkidle'});
  // Click [placeholder="Username"]
  await page.locator('input[placeholder="Username"]').click();
  // Fill [placeholder="Username"]
  await page.locator('input[placeholder="Username"]').fill(username);
  // Click [placeholder="Password"]
  await page.locator('input[placeholder="Password"]').click();
  // Fill [placeholder="Password"]
  await page.locator('input[placeholder="Password"]').fill(password);

  // Click text=Log In
  await page.locator('button[id="applgbtn"]').click()

  await page.waitForLoadState('networkidle')

  /*** pay bill ***/

  // Click text=PAY MY BILL
  try{
    await page.locator('button[id="paybillbtn"]').click();
  }catch{
    return "button not found"
  }

  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.waitForNavigation(/*{ url: 'https://v51.ez-pay.io/AccountOverview.aspx' }*/),
    page.locator('button[id="paybillbtn"]').click()
  ]);

  /*** Amount to be paid ***/
  const amount = null


  // Click text=PAY MY BILL
  await page1.locator('text=PAY MY BILL').click();
  // Click ul[role="menu"] >> text=Pay By Credit Card
  const [page2] = await Promise.all([
    page1.waitForEvent('popup'),
    page1.waitForNavigation(/*{ url: 'https://v51.ez-pay.io/AccountOverview.aspx' }*/),
    page1.locator('ul[role="menu"] >> text=Pay By Credit Card').click()
  ]);

  amount = await page2.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText()
  
  await context.close();
  await browser.close();
  return amount
}

export function pay(){
  (async()=>{
    const browser = await chromium.launch({
      headless: true
    });
    const context = await browser.newContext({ acceptDownloads: true });
    // Open new page
    const page = await context.newPage();
    // Go to https://www.cpsenergy.com/en.html
    await page.goto('https://www.cpsenergy.com/en.html');
    // Click [placeholder="Username"]
    await page.locator('input[placeholder="Username"]').click();
    // Fill [placeholder="Username"]
    await page.locator('input[placeholder="Username"]').fill('rajashekara');
    // Click [placeholder="Password"]
    await page.locator('input[placeholder="Password"]').click();
    // Fill [placeholder="Password"]
    await page.locator('input[placeholder="Password"]').fill('Divinespot60$');

    // Click text=Log In
    await page.locator('button[id="applgbtn"]').click()

    await page.waitForLoadState('networkidle')

    /*** pay bill ***/

    // Click text=PAY MY BILL
    await page.locator('button[id="paybillbtn"]').click();

    await page.goto('https://secure.cpsenergy.com/mma/SetupEZPayServlet', {waitUntil: 'networkidle'})

    /*** Amount to be paid ***/

    const amount = await page.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText();

    /*** amount to pay ***/

    await page.locator('input[id="txtOtherAmount"]').fill("100")

    await page.locator('text=Next').click()

    await page.waitForNavigation({url: 'https://v51.ez-pay.io/Checkout.aspx'})

    /*** Click on pay with card ***/

    // Click a:has-text("Debit / Credit Card")
    await page.locator('a:has-text("Debit / Credit Card")').click()
    await page.waitForNavigation({url: 'https://v51.ez-pay.io/PayCard.aspx'})

    /*** card number ***/

    await page.locator('input[id="ctl00_BodyPlaceholder_txtDebitCreditNumber"]').fill("4000000000")

    /*** name on card ***/

    await page.locator('input[id="ctl00_BodyPlaceholder_txtCardHolderName"]').fill("rajashekara")

    /*** Expiration Code ***/

    // Select 01
    await page.locator('select[name="ctl00\\$BodyPlaceholder\\$ddlMonth"]').selectOption('01');
    // Select 2024
    await page.locator('select[name="ctl00\\$BodyPlaceholder\\$ddlYear"]').selectOption('2024');

    /*** zip code ***/

    // Click [placeholder="ZIP\ Code"]
    await page.locator('[placeholder="ZIP\\ Code"]').click();
    // Fill [placeholder="ZIP\ Code"]
    await page.locator('[placeholder="ZIP\\ Code"]').fill('78238');
    
    /*** CVC ***/

    await page.locator('[placeholder="Enter\\ the\\ code"]').click();
    // Fill [placeholder="Enter\ the\ code"]
    await page.locator('[placeholder="Enter\\ the\\ code"]').fill('3232');
    // Click text=Next
    await page.locator('text=Next').click();

    await context.close();
    await browser.close();
  })()
}
