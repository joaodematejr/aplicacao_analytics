const { Builder, By, Key, until } = require('selenium-webdriver');

module.exports = (app, io) => {
    var route = app.route('/robo');
    var driver;
    //RECEBER DADOS DO ROBO
    route.post((req, res) => {

        const frontUrl = 'https://www.kaggle.com/jboysen/global-food-prices';
        const frontNavegador = 'chrome';

        driver = new Builder().forBrowser(frontNavegador).build();

        chamadaNavegador();

        async function chamadaNavegador() {
            try {
                await driver.get(frontUrl);
                const urlSite = await driver.getCurrentUrl();
                if (urlSite === frontUrl) {
                    localizarBotaoLogin();
                } else {
                    res.status(500).json({ status: "Error na URL", message: 'URL incorreta por favor tente novamente', data: null });
                }
            } catch (error) {
                res.status(500).json({ status: "Error no sistema", message: 'Erro no sistema por favor entre em contato com desenvolver do sistema', error, data: null });
            }
        }

        async function localizarBotaoLogin() {
            try {
                const element = await driver.findElement(By.id('sign-in-button'));
                console.log('element', element)
            } catch (error) {
                console.error(error);
            }
        }



        /*         async function segundoChamada() {
                    await driver.get('http://www.google.com');
                    var element = await driver.findElement(By.css('input[title=Pesquisar]'));
                    await element.sendKeys("selenium", Key.RETURN);
                    await driver.wait(until.titleContains("selenium"), 4000);
                    driver.getTitle().then(title => {
                        expect(title).toEqual('selenium - Pesquisa Google');
                    });
                } */
    });
}




///
///
///niumDrivers.init({ browserName: 'chrome', download: true })
///n(function () {
///driver = new Builder().forBrowser('chrome').build();
///driver.get('https://www.kaggle.com/jboysen/global-food-prices');
///
///console.log('driver', driver)
///
/////sign-in-button
///
////* driver.getTitle().then(title => { expect(title).toEqual('Google'); });
///var element = driver.findElement(By.css('input[title=Pesquisar]'));
///element.sendKeys("selenium", Key.RETURN);
///driver.wait(until.titleContains("selenium"), 4000);
///driver.getTitle().then(title => { expect(title).toEqual('selenium - Pesquisa Google'); });
///driver.get('http://www.google.com');
///element = driver.findElement(By.css('input[title=Pesquisar]'));
///element.sendKeys("selenium", Key.RETURN);
///driver.wait(until.titleContains("selenium"), 4000);
///imageSearch = driver.findElement(By.xpath("//a[contains(text(), 'Imagens')]"));
///imageSearch.click();
///image = driver.takeScreenshot();
///fs.writeFileSync('out.png', image, 'base64'); */
///