const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
var fs = require('fs');

module.exports = (app, io) => {
    var route = app.route('/robo');
    var driver;
    //RECEBER DADOS DO ROBO
    route.post((req, res) => {
        //VALIDAÇÕES DO FRONT-END
        if (req.body.frontNavegador === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Navegador Vazio !!!', error, error, data: null });
        } else if (req.body.frontUrl === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Url do site Vazio !!!', error, error, data: null });
        } else if (req.body.login === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Login em branco !!!', error, error, data: null });
        } else if (req.body.senha === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Senha em branco!!!', error, error, data: null });
        } else {

            var opcoes = new chrome.Options();
            //options.addArguments("start-maximized");
            //options.addArguments("--window-size=1920,1080");
            opcoes.addArguments("--disable-popup-blocking");
            opcoes.addArguments("--disable-default-apps");
            opcoes.addArguments("--safebrowsing-disable-download-protection");
            opcoes.addArguments("prompt_for_download", 'False');
            opcoes.addArguments("directory_upgrade", 'True');
            opcoes.addArguments("download.default_directory", '/Volumes/Documentos/facu/projetos/aplicacao_analytics/backend/csv/..');
            opcoes.addArguments("download.prompt_for_download", 'True');
            opcoes.addArguments("safebrowsing.enabled", 'True');
            opcoes.addArguments("download.directory_upgrade", 'True');


            //INICIAR NAVEGADOR
            driver = new Builder(opcoes).forBrowser(req.body.frontNavegador).setChromeOptions(opcoes).build();

            driver.get(req.body.frontUrl).
                then(function () {
                    //LOCALIZAR BOTAO DE LOGIN E CLICAR
                    return driver.findElement(By.id("sign-in-button")).click();
                }).
                then(function () {
                    //LOCALIZAR INPUT DE LOGIN 
                    return driver.findElement(By.id('username-input-text'));
                }).
                then(function (driver) {
                    //INSERIR OS LOGIN DO FRONT-END
                    return driver.sendKeys(req.body.login);
                }).
                then(function () {
                    //LOCALIZAR INPUT DE SENHA
                    return driver.findElement(By.id('password-input-text'));
                }).
                then(function (driver) {
                    //INSERIR SENHA DO FRONT-END
                    return driver.sendKeys(req.body.senha);
                }).
                then(function () {
                    //LOCALIZAR BOTAO PARA FAZER LOGIN
                    return driver.findElement(By.id('submit-sign-in-button')).click();
                }).
                then(async function () {
                    //LOCALIZAR MENSAGEM LOGIN INVALIDO E ENVIAR PARA FRONT-END
                    try {
                        await driver.findElement(By.xpath("//span[contains(text(), 'Your account has been temporarily locked out due to unsuccessful login attempts. Please try again later.')]")).getText();
                        res.status(500).json({ status: "Error", message: 'Problemas na autenticação', data: null });
                    } catch (error) {
                        //LOCALIZAR BOTAO PARA BAIXAR E CLICAR
                        await driver.findElement(By.xpath("//a[@class='button__anchor-wrapper']")).click();
                        res.status(200).json({ status: "Download Concluido", message: 'Download Concluido com Sucesso !!!', data: null });
                    }
                    return
                })
        }
    });
}


