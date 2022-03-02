import { firefox } from 'playwright';
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";
import {parse} from 'csv-parse';

export async function amount(account_number, zip_code){
  const browser = await firefox.launch({
    headless: true
  });
  const context = await browser.newContext({ acceptDownloads: true });
  // Open new page
  const page = await context.newPage();

  // go to bill page
  await page.goto('https://v51.ez-pay.io/validate.aspx?BillerID=nX6hopWkua')

  await page.waitForLoadState('networkidle')

  /*** account number ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').fill(account_number);
    
  /*** zip code ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').fill(zip_code);

  // Click input:has-text("Look Up")
  await page.locator('input:has-text("Look Up")').click()

  await page.waitForLoadState('networkidle')

  // Click span balance
  const amount = await page.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText();
  
  await context.close();
  await browser.close();

  return amount
}

export async function account(account_number, zip_code){
  const browser = await firefox.launch({
    headless: true
  });
  const context = await browser.newContext({ acceptDownloads: true });
  // Open new page
  const page = await context.newPage();

  // go to bill page
  await page.goto('https://v51.ez-pay.io/validate.aspx?BillerID=nX6hopWkua')

  await page.waitForLoadState('networkidle')

  /*** account number ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').fill(account_number);
    
  /*** zip code ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').fill(zip_code);

  // Click input:has-text("Look Up")
  await page.locator('input:has-text("Look Up")').click()

  await page.waitForLoadState('networkidle')

  // Click span balance
  const amount = await page.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText();
  
  await context.close();
  await browser.close();

  return amount
}

export async function pay(){
  const browser = await firefox.launch({
    headless: true
  });
  const context = await browser.newContext({ acceptDownloads: true });
  // Open new page
  const page = await context.newPage();

  // Go to https://www.saws.org/
  await page.goto('https://www.saws.org/');

  // close popup
  await page.locator('text=CLOSE').click();

  // Click text=Sign In / My Account
  await page.locator('text=Sign In / My Account').click();
  // assert.equal(page.url(), 'https://www.saws.org/#');
  // Click #menu-item-7366 >> text=Pay Your Bill
  await page.locator('#menu-item-7366 >> text=Pay Your Bill').click();
  // assert.equal(page.url(), 'https://www.saws.org/service/pay-bill/');
  
  await page.waitForLoadState('networkidle')

  // Click text=Pay With Card
  await page.goto('https://secure8.i-doxs.net/ezpay/Welcome.aspx?BillerID=nX6hopWkua')

  await page.waitForLoadState('networkidle')

  /*** account number ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ACCNO"]').fill('001021658-0721990-0003');
    
  /*** zip code ***/
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').click();
  await page.locator('input[id="ctl00_BodyPlaceholder_ZIPCODE"]').fill('78023');

  // Click input:has-text("Look Up")
  await page.locator('input:has-text("Look Up")').click()

  await page.waitForLoadState('networkidle')

  await page.locator('label[for="rdOtheramount"]').click()
  await page.locator('input[id="txtOtherAmount"]').fill('100')

  await page.locator('input[id="btnAddToCart"]').click()

  await page.waitForLoadState('networkidle')

  await page.goto('https://v51.ez-pay.io/SignInOrGuest.aspx')

  await page.waitForLoadState('networkidle')

  await page.locator('input[id="ctl00_BodyPlaceholder_txtGuestEmail"]').fill('akashshekara1212@gmail.com')

  await page.goto('https://v51.ez-pay.io/Checkout.aspx')

  await page.waitForLoadState('networkidle')

  await page.locator('a[id="ctl00_BodyPlaceholder_btnCCDC"]').click();

  await page.waitForNavigation({url: 'https://v51.ez-pay.io/PayCard.aspx'})

  await page.waitForLoadState('networkidle')

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

  // await context.close();
  // await browser.close();
}