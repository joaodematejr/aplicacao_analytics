const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
var seleniumDrivers = require('selenium-drivers');

module.exports = (app, io) => {
    let route = app.route('/robo');
    var driver;
    //RECEBER DADOS DO ROBO
    route.post((req, res) => {
        seleniumDrivers.init({
            //browserName: ('chrome' | 'firefox' | 'internet explorer' | 'safari') specify browser name
            browserName: 'safari', download: true
        }).then(function () {
            driver = new Builder().forBrowser('safari').build();
            driver.get('http://www.google.com');
            driver.getTitle().then(title => { expect(title).toEqual('Google'); });
            var element = driver.findElement(By.css('input[title=Pesquisar]'));
            element.sendKeys("selenium", Key.RETURN);
            driver.wait(until.titleContains("selenium"), 4000);
            driver.getTitle().then(title => { expect(title).toEqual('selenium - Pesquisa Google'); });
            driver.get('http://www.google.com');
            element = driver.findElement(By.css('input[title=Pesquisar]'));
            element.sendKeys("selenium", Key.RETURN);
            driver.wait(until.titleContains("selenium"), 4000);
            imageSearch = driver.findElement(By.xpath("//a[contains(text(), 'Imagens')]"));
            imageSearch.click();
            image = driver.takeScreenshot();
            fs.writeFileSync('out.png', image, 'base64');
        });

        // driver.quit();
    });
}
