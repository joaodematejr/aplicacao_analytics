const fs = require('fs');
describe('test google.com', () => {
    const { Builder, By, Key, until } = require('selenium-webdriver');
    var driver;

    beforeEach(() => { driver = new Builder().forBrowser('chrome').build(); });

    afterEach(() => { driver.quit(); });

    it('deve abrir a pesquisa do google', async () => {
        await driver.get('http://www.google.com');
        driver.getTitle().then(title => { expect(title).toEqual('Google'); });
    });

    it('deve abrir a pesquisa do google e ver os resultados da pesquisa', async () => {
        await driver.get('http://www.google.com');
        var element = await driver.findElement(By.css('input[title=Pesquisar]'));
        await element.sendKeys("selenium", Key.RETURN);
        await driver.wait(until.titleContains("selenium"), 4000);
        driver.getTitle().then(title => {
            expect(title).toEqual('selenium - Pesquisa Google');
        });
    });

    it('abrir a pesquisa do google e fazer pesquisa de imagens', async () => {
        await driver.get('http://www.google.com');
        var element = await driver.findElement(By.css('input[title=Pesquisar]'));
        await element.sendKeys("selenium", Key.RETURN);
        await driver.wait(until.titleContains("selenium"), 4000);
        var imageSearch = driver.findElement(By.xpath("//a[contains(text(), 'Imagens')]"));
        await imageSearch.click();
        let image = await driver.takeScreenshot();
        fs.writeFileSync('out.png', image, 'base64');
    });

});