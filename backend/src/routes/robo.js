const { Builder, By, Key, until, Assert, selenium } = require('selenium-webdriver');

module.exports = (app, io) => {
    var route = app.route('/robo');
    var driver;
    //RECEBER DADOS DO ROBO
    route.post((req, res) => {
        //VALIDAÇÕES DO FRONT-END
        if (req.body.frontNavegador === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Navegador Vazio !!!', error, error, data: null });
        } else if (req.body.frontUrl === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Url do site Vazia !!!', error, error, data: null });
        } else if (req.body.login === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Login Vazio !!!', error, error, data: null });
        } else if (req.body.senha === '') {
            res.status(500).json({ status: "Error no sistema", message: 'Senha Vazia !!!', error, error, data: null });
        } else {
            //INICIAR NAVEGADOR
            driver = new Builder().forBrowser(req.body.frontNavegador).build();
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
                    let erroLogin = await driver.findElement(By.xpath("//span[contains(text(), 'Your account has been temporarily locked out due to unsuccessful login attempts. Please try again later.')]")).getText();
                    if (erroLogin === 'Your account has been temporarily locked out due to unsuccessful login attempts. Please try again later.') {
                        res.status(500).json({ status: "Error", message: 'Problemas na autenticação', data: null });
                    } else {
                        console.log('passou')
                    }
                    return
                })
        }
    });
}