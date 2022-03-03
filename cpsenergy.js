import { chromium } from 'playwright';
import fs from "fs";
import AdmZip from "adm-zip";
import path from "path";
import {parse} from 'csv-parse';

async function extractArchive(filepath) {
  try {
    console.log(filepath)
    const zip = new AdmZip(filepath);

    const outputDir = `${path.parse(filepath).name}_extracted`;
    zip.extractAllTo(outputDir);

    fs.readdir(outputDir, function(err,files) {
      if(err){
        return console.log('Unable to scan directory: ' + err);
      }else{
        files.forEach(function (file){
          console.log(file)
          var csvData=[];
          fs.createReadStream(outputDir + "/" +file)
          .pipe(parse({delimiter: ',', relax: true, trim: true, relax_column_count: true}))
          .on('data', function(csvrow) {
            // console.log(csvrow);
            //do something with csvrow
            csvData.push(csvrow);        
          })
          .on('end',function() {
            //do something with csvData
            console.log("name " + csvData[0][1]);
            console.log("address " + csvData[1][1]);

            console.log("service " + csvData[3][1]);            
          });
        });
      }
    });

    
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

export async function amount(username, password){
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
  await page.locator('button[id="paybillbtn"]').click();

  await page.goto('https://secure.cpsenergy.com/mma/SetupEZPayServlet', {waitUntil: 'networkidle'})

  /*** Amount to be paid ***/

  const amount = await page.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText();
  await context.close();
  await browser.close();

  return amount
}

export async function create_account(first_name, last_name, ca1, ca2, ca3, street_num, street_name, city, zip_code, ssn1, ssn2, ssn3, username, email){
  const browser = await chromium.launch({
    headless: true
  });
  const context = await browser.newContext();
  // Open new page
  const page = await context.newPage();

  await page.goto('https://secure.cpsenergy.com/mma/existingCust.jsp');

  /*** create account ***/
  await page.locator('input[id="firstName"]').fill(first_name);
  await page.locator('input[id="lastName"]').fill(last_name);

  await page.locator('input[id="ca1"]').fill(ca1)
  await page.locator('input[id="ca2"]').fill(ca2)
  await page.locator('input[id="ca3"]').fill(ca3)

  await page.locator('input[id="streetNum"]').fill(street_num)
  await page.locator('input[id="streetName"]').fill(street_name)
  await page.locator('input[id="city"]').fill(city)
  await page.locator('input[id="zip"]').fill(zip_code)

  await page.locator('button[id="existingCustBtn"]').click();

  await page.waitForLoadState('networkidle')

  await page.locator('input[id="ssn1"]').fill(ssn1)
  await page.locator('input[id="ssn2"]').fill(ssn2)
  await page.locator('input[id="ssn3"]').fill(ssn3)

  await page.locator('button[id="validateIdListBtn"]').click()
  await page.waitForLoadState('networkidle')

  await page.locator('input[id="userName"]').fill(username)
  await page.locator('input[id="email"]').fill(email)
  await page.locator('input[id="confirmEmail"]').fill(email)

  await page.locator('select[id="secQ"]').selectOption("What is your pets name?")
  await page.locator('input[id="secA"]').fill('hershey')
  await page.locator('button[id="validateUserSetUpBtn"]').click()

  await page.waitForLoadState('networkidle')
  // await context.close();
  // await browser.close();

  // return amount
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

function browserStuff(){
  (async () => {
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
    await page.locator('input[placeholder="Username"]').fill(program.opts().username);
    // Click [placeholder="Password"]
    await page.locator('input[placeholder="Password"]').click();
    // Fill [placeholder="Password"]
    await page.locator('input[placeholder="Password"]').fill(program.opts().password);

    // Click text=Log In
    await page.locator('button[id="applgbtn"]').click()

    await page.waitForLoadState('networkidle')

    /*********** VIEW DATA ***********/ 

    // Click text=Recent Online Activity
    await page.locator('a[id="myEnergyHref"]').click()
    // Click text=My Energy PortalInsights into the energy you use

    await page.waitForSelector('g[id="green-button"]')

    await page.click('g[id="green-button"]')

    await page.waitForLoadState('networkidle')

    await page.click('label[for="period-bill"]')

    await page.waitForSelector('#dashboard button:has-text("Export")')

    const [ download ] = await Promise.all([
      page.waitForEvent('download'), // wait for download to start
      page.locator('#dashboard button:has-text("Export")').click()
    ]);

    await download.saveAs('something.zip');
    await download.delete()

    extractArchive("something.zip");


   //  // Click text=PAY MY BILL
   //  await page.locator('button[id="paybillbtn"]').click();
  	
  	// await page.goto('https://secure.cpsenergy.com/mma/SetupEZPayServlet', {waitUntil: 'networkidle'})

   //  // console.log(page)
   //  // await page.waitForLoadState();
   //  const amount = await page.locator('span[id="ctl00_BodyPlaceholder_ltBalanceDueTotal"]').innerText();
   //  console.log(amount)

   //  // input amount
   //  await page.locator('input[id="txtOtherAmount"]').fill("100")

   //  await page.locator('text=Next').click()

   //  await page.waitForNavigation({url: 'https://v51.ez-pay.io/Checkout.aspx'})

   //  // Click a:has-text("Debit / Credit Card")
   //  await page.locator('a:has-text("Debit / Credit Card")').click()

   //  await page.waitForNavigation({url: 'https://v51.ez-pay.io/PayCard.aspx'})

   //  await page.locator('input[id="ctl00_BodyPlaceholder_txtDebitCreditNumber"]').fill("4000000000")

   //  await page.locator('input[id="ctl00_BodyPlaceholder_txtCardHolderName"]').fill("rajashekara")


    // // Fill [placeholder="Enter\ your\ card\ number"]
    // await page.locator('[placeholder="Enter\\ your\\ card\\ number"]').fill('1248 1233');
    // // Click [placeholder="Enter\ card\ holder\'s\ name"]
    // await page.locator('[placeholder="Enter\\ card\\ holder\\\'s\\ name"]').click();
    // // Click [placeholder="Enter\ card\ holder\'s\ name"]
    // await page.locator('[placeholder="Enter\\ card\\ holder\\\'s\\ name"]').click();
    // // Fill [placeholder="Enter\ card\ holder\'s\ name"]
    // await page.locator('[placeholder="Enter\\ card\\ holder\\\'s\\ name"]').fill('rajashekara');
    // // Select 01
    // await page.locator('select[name="ctl00\\$BodyPlaceholder\\$ddlMonth"]').selectOption('01');
    // // Select 2024
    // await page.locator('select[name="ctl00\\$BodyPlaceholder\\$ddlYear"]').selectOption('2024');
    // // Click [placeholder="ZIP\ Code"]
    // await page.locator('[placeholder="ZIP\\ Code"]').click();
    // // Fill [placeholder="ZIP\ Code"]
    // await page.locator('[placeholder="ZIP\\ Code"]').fill('78238');
    // // Click [placeholder="Enter\ the\ code"]
    // await page.locator('[placeholder="Enter\\ the\\ code"]').click();
    // // Fill [placeholder="Enter\ the\ code"]
    // await page.locator('[placeholder="Enter\\ the\\ code"]').fill('3232');
    // // Click text=Next
    // await page.locator('text=Next').click();
    // // ---------------------
    await context.close();
    await browser.close();
  })();
}
