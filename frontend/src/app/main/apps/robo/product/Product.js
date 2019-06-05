import { FuseAnimate, FuseAnimateGroup, FusePageCarded } from '@fuse';
import _ from '@lodash';
import { Button, Icon, IconButton, InputAdornment, Paper, Tab, Tabs, TextField, Typography, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { orange } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import withReducer from 'app/store/withReducer';
import axios from 'axios';
import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';


const styles = theme => ({
    productImageFeaturedStar: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: orange[400],
        opacity: 0
    },
    productImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            boxShadow: theme.shadows[5],
            '& $productImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $productImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $productImageFeaturedStar': {
                opacity: 1
            }
        }
    }
});



class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            form: null,
            showPassword: 'password',
            setOpen: false,
            modalSucesso: false,
            modalUrlBranco: false,
            modalLogin: false,
            modalSenha: false,
            modalProblemasAutenticacao: false,
            navegadorNaoSuportado: false,
            selectColunas: [],
            modalLocalizandoColunas: false,
            listaColunasCSV: [],
            importCsvMongo: false,
            importCsvMongoSucesso: false
        };
    }

    componentDidMount() {
        this.updateProductState();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.location, prevProps.location)) {
            this.updateProductState();
        }

        if (
            (this.props.product.data && !this.state.form) ||
            (this.props.product.data && this.state.form && this.props.product.data.id !== this.state.form.id)
        ) {
            this.updateFormState();
        }
    }

    updateFormState = () => {
        this.setState({ form: this.props.product.data })
    };

    updateProductState = () => {
        const params = this.props.match.params;
        const { productId } = params;

        if (productId === 'new') {
            this.props.newProduct();
        }
        else {
            this.props.getProduct(this.props.match.params);
        }
    };

    handleChangeTab = (event, tabValue) => {
        this.setState({ tabValue });
    };

    handleChange = (event) => {
        this.setState({ form: _.set({ ...this.state.form }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value) });
    };


    async enviarDados() {
        if (this.state.form.navegador === 'chrome') {
            this.setState({ setOpen: true })
            let request = await axios.post('http://localhost:9000/robo', {
                frontUrl: this.state.form.url,
                frontNavegador: this.state.form.navegador,
                login: this.state.form.login,
                //MadFsACmuA5ENDF
                senha: this.state.form.senha,
            }).then(function (response) {
                return response
            }).catch(function (error) {
                console.log(error);
                return false
            });
            if (request) {
                if ('Download Concluido' === request.data.status) {
                    this.setState({ setOpen: false })
                    this.setState({ modalSucesso: true })
                    this.setState({ tabValue: 1 });
                } else if ('Url do site Vazio !!!' === request.data.message) {
                    this.setState({ setOpen: false })
                    this.setState({ modalUrlBranco: true })
                } else if ('Login em branco !!!' === request.data.message) {
                    this.setState({ setOpen: false })
                    this.setState({ modalLogin: true })
                } else if ('Senha em branco!!!' === request.data.message) {
                    this.setState({ setOpen: false })
                    this.setState({ modalSenha: true })
                } else if ('Problemas na autenticação' === request.data.message) {
                    this.setState({ setOpen: false })
                    this.setState({ modalProblemasAutenticacao: true })
                }
            } else if (false) {
            }
        } else {
            this.setState({ navegadorNaoSuportado: true })
        }
    }

    async escanerCSV() {
        this.setState({ modalLocalizandoColunas: true })
        let request = await axios.post('http://localhost:9000/localizarArquivo', {
        }).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error);
            return false
        });
        if (request) {
            this.setState({ selectColunas: request.data.data, modalLocalizandoColunas: false })
        } else {
            console.log('else', request)
        }
    }


    addLista = coluna => {
        const listaColunasCSV = this.state.listaColunasCSV;
        const selectColunas = this.state.selectColunas;
        listaColunasCSV.push(coluna);
        selectColunas.pop(coluna);
        this.setState({ listaColunasCSV })
        this.setState({ selectColunas })
    };

    remove = coluna => {
        const listaColunasCSV = this.state.listaColunasCSV;
        const selectColunas = this.state.selectColunas;
        selectColunas.push(coluna)
        listaColunasCSV.pop(coluna);
        this.setState({ listaColunasCSV })
        this.setState({ selectColunas })
    }

    canBeSubmitted() {
        const { url } = this.state.form;
        return (
            url.length > 0 &&
            !_.isEqual(this.props.product.data, this.state.form)
        );
    }

    //ATUALIZACAO
    async importarCsvMongo() {
        const listaColunasCSV = this.state.listaColunasCSV;
        this.setState({ importCsvMongo: true })
        let request = await axios.post('http://localhost:9000/importCsv', {
            listaColunasCSV: listaColunasCSV,
        }).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error);
            return false
        });
        if (request) {
            console.log('request', request)
        } else {
            console.log('request', request)
        }
        this.setState({ importCsvMongo: false })
        this.setState({ importCsvMongoSucesso: true })
    }


    render() {
        const { tabValue, form, setOpen, modalSucesso, modalUrlBranco, modalLogin, modalSenha, modalProblemasAutenticacao, navegadorNaoSuportado, modalLocalizandoColunas, selectColunas, listaColunasCSV, importCsvMongo, importCsvMongoSucesso } = this.state;

        let listaDeColunas = _.map(selectColunas, colunas => ({
            id: Math.random(),
            colunas: colunas,
        }));

        console.log("listaColunasCSV", listaColunasCSV)

        return (
            <FusePageCarded
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/dashboards/project">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Voltar
                                    </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">
                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography className="text-16 sm:text-20 truncate">
                                                {tabValue === 0 ? 'Configuração Robo' : 'Tratar CSV'}
                                            </Typography>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography variant="caption">  {tabValue === 0 ? 'Login / Senha' : 'Informações CSV'}</Typography>
                                        </FuseAnimate>
                                    </div>
                                </div>
                            </div>
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                {tabValue === 0 ?
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        disabled={!this.canBeSubmitted()}
                                        onClick={() => this.enviarDados()} >
                                        Enviar
                                </Button> :
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        disabled={this.canBeSubmitted()}
                                        onClick={() => this.importarCsvMongo()} >
                                        Importar CSV para MongoDB
                                </Button>}

                            </FuseAnimate>
                        </div>
                    )
                }
                contentToolbar={
                    <Tabs
                        value={tabValue}
                        onChange={this.handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: "w-full h-64" }}  >
                        <Tab className="h-64 normal-case" label="Configurações" />
                        <Tab className="h-64 normal-case" label="Tratar CSV" />
                    </Tabs>
                }
                content={
                    form && (
                        <div className="p-16 sm:p-24 max-w-6xl">
                            {tabValue === 0 &&
                                (
                                    <div>
                                        <Dialog
                                            open={navegadorNaoSuportado}
                                            onClose={navegadorNaoSuportado}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Navegador Não Suportado
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '10%', marginRight: '10%' }} class="material-icons large"> highlight_off</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ navegadorNaoSuportado: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Dialog
                                            open={modalUrlBranco}
                                            onClose={modalUrlBranco}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    URl em Branco
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> highlight_off</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ modalUrlBranco: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Dialog
                                            open={modalLogin}
                                            onClose={modalLogin}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Você precisa preencher o seu login.
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> highlight_off</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ modalLogin: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Dialog
                                            open={modalSenha}
                                            onClose={modalSenha}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Você precisa preencher a sua senha.
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> highlight_off</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ modalSenha: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Dialog
                                            open={modalProblemasAutenticacao}
                                            onClose={modalProblemasAutenticacao}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Problemas na Autenticação
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> highlight_off</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ modalProblemasAutenticacao: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>


                                        <Dialog
                                            open={setOpen}
                                            onClose={setOpen}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Aguarde até o finalizamento do download...
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <CircularProgress style={{ marginLeft: '45%', marginRight: '45%' }} disableShrink />
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button />
                                                <Button />
                                            </DialogActions>
                                        </Dialog>


                                        <FormControl className="mt-8 mb-16" required id="navegador" error={form.url === ''} fullWidth variant="outlined" >
                                            <InputLabel htmlFor="outlined-age-simple">
                                                Navegador
                                            </InputLabel>
                                            <Select
                                                value={form.navegador}
                                                onChange={this.handleChange}
                                                input={<OutlinedInput name="navegador" id="navegador" />}
                                            >
                                                <MenuItem value="">
                                                    <em>Navegador</em>
                                                </MenuItem>
                                                <MenuItem value={'Opera'}>Opera (Em Breve)</MenuItem>
                                                <MenuItem value={'chrome'}>Google Chrome </MenuItem>
                                                <MenuItem value={'Firefox'}>Firefox (Em Breve)</MenuItem>
                                                <MenuItem value={'Safari'}>Safari (Em Breve)</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <TextField
                                            className="mt-8 mb-16"
                                            error={form.url === ''}
                                            required
                                            label="URL"
                                            autoFocus
                                            id="url"
                                            name="url"
                                            value={form.url}
                                            onChange={this.handleChange}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            className="mt-8 mb-16"
                                            required
                                            error={form.login === ''}
                                            id="login"
                                            name="login"
                                            onChange={this.handleChange}
                                            label="Login"
                                            type="text"
                                            value={form.login}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            className="mt-8 mb-16"
                                            required
                                            error={form.senha === ''}
                                            id="senha"
                                            name="senha"
                                            onChange={this.handleChange}
                                            label="Senha"
                                            type={'password'}
                                            value={form.senha}
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Toggle password visibility"
                                                            onClick={this.handleClickShowPassword}
                                                        >
                                                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </div>
                                )}
                            {tabValue === 1 &&
                                (
                                    <FuseAnimateGroup className="flex flex-wrap" enter={{ animation: "transition.slideUpBigIn" }} >
                                        {/*   CSV */}
                                        <Dialog
                                            open={importCsvMongo}
                                            onClose={importCsvMongo}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Aguarde até o finalizamento estamos tratando CSV para importação....
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <CircularProgress style={{ marginLeft: '45%', marginRight: '45%' }} disableShrink />
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button />
                                                <Button />
                                            </DialogActions>
                                        </Dialog>
                                        {/*  importCsvMongoSucesso */}
                                        <Dialog
                                            open={importCsvMongoSucesso}
                                            onClose={importCsvMongoSucesso}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Importação Concluida com Sucesso
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> check_circle_outline</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ importCsvMongoSucesso: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        <Dialog
                                            open={modalLocalizandoColunas}
                                            onClose={modalLocalizandoColunas}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Por favor aguarde. Estamos localizando as informações...
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <CircularProgress style={{ marginLeft: '45%', marginRight: '45%' }} disableShrink />
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button />
                                                <Button />
                                            </DialogActions>
                                        </Dialog>
                                        <Dialog
                                            open={modalSucesso}
                                            onClose={modalSucesso}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description" >
                                            <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                            <DialogContent >
                                                <DialogContentText id="alert-dialog-description">
                                                    Download Concluido com Sucesso
                                                </DialogContentText>
                                                <br />
                                                <br />
                                                <DialogContentText id="alert-dialog-description">
                                                    <i style={{ fontSize: '150px', marginLeft: '20%', marginRight: '20%' }} class="material-icons large"> check_circle_outline</i>
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => this.setState({ modalSucesso: false })} color="primary">
                                                    Fechar
                                                </Button>
                                            </DialogActions>
                                        </Dialog>

                                        <div className="sm:w-1/2 md:w-1/5 p-12">
                                            <Fab onClick={() => this.escanerCSV()} color="primary" aria-label="Add" >
                                                <Icon>search</Icon>
                                            </Fab>
                                        </div>

                                        <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                            <Paper className="w-full rounded-8 shadow-none border-1">
                                                <Card>
                                                    <CardHeader
                                                        avatar={
                                                            <Checkbox
                                                            //onClick={handleToggleAll(items)}
                                                            //checked={numberOfChecked(items) === items.length && items.length !== 0}
                                                            // indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                                                            //disabled={items.length === 0}
                                                            //inputProps={{ 'aria-label': 'all items selected' }}
                                                            />
                                                        }
                                                        title={'Colunas CSV'}
                                                        subheader={listaDeColunas.length}
                                                    />
                                                    <Divider />
                                                    <List dense component="div" role="list">
                                                        {listaDeColunas && listaDeColunas.map(value => {
                                                            const labelId = `transfer-list-all-item-${value.colunas}-label`;
                                                            return (
                                                                <ListItem key={value} role="listitem" button >
                                                                    <ListItemIcon>
                                                                        <Checkbox
                                                                            onClick={() => this.addLista(value)}
                                                                            //checked={checked.indexOf(value) !== -1}
                                                                            tabIndex={+1}
                                                                            disableRipple
                                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                                        />
                                                                    </ListItemIcon>
                                                                    <ListItemText id={labelId} primary={value.colunas} />
                                                                </ListItem>
                                                            );
                                                        })}
                                                        <ListItem />
                                                    </List>
                                                </Card>
                                            </Paper>
                                        </div>

                                        <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                            <Paper className="w-full rounded-8 shadow-none border-1">
                                                <Card>
                                                    <CardHeader
                                                        avatar={
                                                            <Checkbox
                                                            //onClick={handleToggleAll(items)}
                                                            //checked={numberOfChecked(items) === items.length && items.length !== 0}
                                                            // indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                                                            //disabled={items.length === 0}
                                                            //inputProps={{ 'aria-label': 'all items selected' }}
                                                            />
                                                        }
                                                        title={'Total de Colunas a ser importadas'}
                                                        subheader={listaColunasCSV.length}
                                                    />
                                                    <Divider />
                                                    <List dense component="div" role="list">
                                                        {listaColunasCSV && listaColunasCSV.map(value => {
                                                            const labelId = `transfer-list-all-item-${value.colunas}-label`;
                                                            return (
                                                                <ListItem key={value.colunas} role="listitem" button onClick={() => this.remove(value.colunas)} >
                                                                    <ListItemIcon>
                                                                        <Icon className="mr-4 text-40">clear</Icon>
                                                                    </ListItemIcon>
                                                                    <ListItemText id={labelId} primary={value.colunas} />
                                                                </ListItem>
                                                            );
                                                        })}
                                                        <ListItem />
                                                    </List>
                                                </Card>
                                            </Paper>
                                        </div>

                                    </FuseAnimateGroup>
                                )}
                        </div>
                    )
                }
                innerScroll
            />
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProduct: Actions.getProduct,
        newProduct: Actions.newProduct,
    }, dispatch);
}

function mapStateToProps({ eCommerceApp }) {
    return {
        product: eCommerceApp.product
    }
}

export default withReducer('eCommerceApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Product))));
