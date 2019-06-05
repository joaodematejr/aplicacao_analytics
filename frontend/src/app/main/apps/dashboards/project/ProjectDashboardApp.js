import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { Button, Card, Hidden, Icon, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import lightBlue from '@material-ui/core/colors/lightBlue';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withReducer from 'app/store/withReducer';
import axios from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import { Scatter } from 'react-chartjs-2';
import ReactMapboxGl, { Feature, Layer, RotationControl, ScaleControl, ZoomControl } from "react-mapbox-gl";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { END_POINT } from '../../../../../endPoint';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget11 from './widgets/Widget11';
const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9hb2RlbWF0ZWpyIiwiYSI6ImNqd2JnbzY4MDA0ZW40NHBwa244cXF2MzcifQ.W3GVhR_EUO_ZxaQO2W5mug"
});


const styles = theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },
    selectedProject: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '8px 0 0 0'
    },
    projectMenuButton: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '0 8px 0 0',
        marginLeft: 1
    },
}
);

class ProjectDashboardApp extends Component {
    state = {
        tabValue: 0,
        selectedProjectId: 1,
        projectMenuEl: null,
        responseJson: [],
        linhasAnalisadas: 0,
        routeAnalyticsKM: [],
        analyticsTotalCidades: 0,
        setOpen: false,
        resultadoFinal: [],
        datasets: []
    };

    handleChangeTab = (event, tabValue) => {
        this.setState({ tabValue });
    };

    handleChangeProject = selectedProjectId => {
        this.setState({
            selectedProjectId,
            projectMenuEl: null
        });
    };

    handleOpenProjectMenu = event => {
        this.setState({ projectMenuEl: event.currentTarget });
    };

    handleCloseProjectMenu = () => {
        this.setState({ projectMenuEl: null });
    };

    componentDidMount() {
        axios.get(`${END_POINT}/analytics`).then(response => this.setState({ responseJson: response.data })).catch(error => console.log('error', error));
        axios.get(`${END_POINT}/routeAnalyticsTotal`).then(response => this.setState({ linhasAnalisadas: response.data })).catch(error => console.log('error', error));
        axios.get(`${END_POINT}/routeAnalyticsKM`).then(response => this.setState({ routeAnalyticsKM: response.data })).catch(error => console.log('error', error));
        axios.get(`${END_POINT}/routeAnalyticsTotalCidades`).then(response => this.setState({ analyticsTotalCidades: response.data })).catch(error => console.log('error', error));
        this.props.getWidgets();
        this.props.getProjects();

    }

    async solicitarDadosBackEnd(pais) {
        this.setState({ setOpen: true })
        this.setState({ projectMenuEl: null });
        await axios.post('http://localhost:9000/routeAnalyticsPais', {
            pais: pais,
        }).then(response => this.setState({ resultadoFinal: response.data.data, setOpen: false }))
            .catch(error => console.log('error', error));

    }



    render() {
        const { widgets, projects, classes } = this.props;
        const { tabValue, projectMenuEl, responseJson, linhasAnalisadas, routeAnalyticsKM, analyticsTotalCidades, setOpen, resultadoFinal } = this.state;


        if (!widgets || !projects) {
            return null;
        }

        let listaPaises = _.map(responseJson, paises => ({
            id: Math.random(),
            name: paises,
        }));


        const data = []
        resultadoFinal.forEach(element => {
            data.push({ x: element.mp_year, y: element.mp_price })
        });



        return (
            <FusePageSimple
                classes={{
                    header: "min-h-160 h-160",
                    toolbar: "min-h-48 h-48",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}
                header={
                    <div className="flex flex-col justify-between flex-1 px-24 pt-24">
                        <div className="flex justify-between items-start">
                            <Typography className="py-0 sm:py-24" variant="h4">Bem vindo de volta, Grupo 9 !</Typography>
                            <Hidden lgUp>
                                <IconButton
                                    onClick={(ev) => this.pageLayout.toggleRightSidebar()}
                                    aria-label="open left sidebar" >
                                    <Icon>menu</Icon>
                                </IconButton>
                            </Hidden>
                        </div>
                        <div className="flex items-end">
                            <div className="flex items-center">
                                <div className={classNames(classes.selectedProject, "flex items-center h-40 px-16 text-16")}>
                                    Lista de Países
                                </div>
                                <IconButton
                                    className={classNames(classes.projectMenuButton, "h-40 w-40 p-0")}
                                    aria-owns={projectMenuEl ? 'project-menu' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleOpenProjectMenu}
                                >
                                    <Icon>more_horiz</Icon>
                                </IconButton>
                                <Menu
                                    id="project-menu"
                                    anchorEl={projectMenuEl}
                                    open={Boolean(projectMenuEl)}
                                    onClose={this.handleCloseProjectMenu} >
                                    {listaPaises && listaPaises.map(paises => (
                                        <MenuItem key={paises.id} onClick={ev => { this.solicitarDadosBackEnd(paises.name) }}>{paises.name}</MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                }
                contentToolbar={
                    <Tabs
                        value={tabValue}
                        onChange={this.handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="off"
                        className="w-full border-b-1 px-24"  >
                        <Tab className="text-14 font-600 normal-case" label="Início" />
                        <Tab className="text-14 font-600 normal-case" label="Relatório" />
                        <Tab className="text-14 font-600 normal-case" label="Lista de Países" />
                    </Tabs>
                }
                content={
                    <div className="p-12">
                        {tabValue === 0 &&
                            (
                                <FuseAnimateGroup className="flex flex-wrap" enter={{ animation: "transition.slideUpBigIn" }} >
                                    {/*    QUANTIDADES DE PAISES  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Paper className="w-full rounded-8 shadow-none border-1">
                                            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                                                <Typography className="text-16">Países</Typography>
                                                <IconButton aria-label="more">
                                                    <Icon>more_vert</Icon>
                                                </IconButton>
                                            </div>
                                            <div className="text-center pt-12 pb-28">
                                                <Typography
                                                    className="text-72 leading-none text-blue">{responseJson.length}</Typography>
                                                <Typography className="text-16" color="textSecondary">Países</Typography>
                                            </div>
                                            <div className="flex items-center px-16 h-52 border-t-1">
                                                <Typography className="text-15 flex w-full" color="textSecondary">
                                                    <span className="truncate">Total de</span>
                                                    :
                                                    <b className="pl-8"> {responseJson.length} </b>
                                                    &#160;
                                                    <span className="truncate"> Países </span>
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>
                                    {/*    QUANTIDADES PROVINCIA  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Paper className="w-full rounded-8 shadow-none border-1">
                                            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                                                <Typography className="text-16">Província</Typography>
                                                <IconButton aria-label="more">
                                                    <Icon>more_vert</Icon>
                                                </IconButton>
                                            </div>
                                            <div className="text-center pt-12 pb-28">
                                                <Typography
                                                    className="text-72 leading-none text-green">{routeAnalyticsKM.length}</Typography>
                                                <Typography className="text-16" color="textSecondary">Província</Typography>
                                            </div>
                                            <div className="flex items-center px-16 h-52 border-t-1">
                                                <Typography className="text-15 flex w-full" color="textSecondary">
                                                    <span className="truncate">Total de</span>
                                                    :
                                                    <b className="pl-8"> {routeAnalyticsKM.length} </b>
                                                    &#160;
                                                    <span className="truncate"> Províncias </span>
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>
                                    {/*    QUANTIDADES CIDADES  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Paper className="w-full rounded-8 shadow-none border-1">
                                            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                                                <Typography className="text-16">Cidades</Typography>
                                                <IconButton aria-label="more">
                                                    <Icon>more_vert</Icon>
                                                </IconButton>
                                            </div>
                                            <div className="text-center pt-12 pb-28">
                                                <Typography
                                                    className="text-72 leading-none text-orange">{analyticsTotalCidades.length}</Typography>
                                                <Typography className="text-16" color="textSecondary">Cidades</Typography>
                                            </div>
                                            <div className="flex items-center px-16 h-52 border-t-1">
                                                <Typography className="text-15 flex w-full" color="textSecondary">
                                                    <span className="truncate">Total de</span>
                                                    :
                                                    <b className="pl-8"> {analyticsTotalCidades.length} </b>
                                                    &#160;
                                                    <span className="truncate"> Cidades </span>
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>
                                    {/*    QUANTIDADES DE LINHAS ANALISADAS  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Paper className="w-full rounded-8 shadow-none border-1">
                                            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                                                <Typography className="text-16">Linhas</Typography>
                                                <IconButton aria-label="more">
                                                    <Icon>more_vert</Icon>
                                                </IconButton>
                                            </div>
                                            <div className="text-center pt-12 pb-28">
                                                <Typography
                                                    className="text-72 leading-none text-red">{linhasAnalisadas}</Typography>
                                                <Typography className="text-16" color="textSecondary">Linhas</Typography>
                                            </div>
                                            <div className="flex items-center px-16 h-52 border-t-1">
                                                <Typography className="text-15 flex w-full" color="textSecondary">
                                                    <span className="truncate">Total de</span>
                                                    :
                                                    <b className="pl-8"> {linhasAnalisadas} </b>
                                                    &#160;
                                                    <span className="truncate"> Linhas Analisadas </span>
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>

                                    <div className="widget flex w-full p-12">
                                        <Card className="w-full h-1 rounded-1 shadow-none border-1">
                                            <Map
                                                zoom={[3]}
                                                center={[-27.507979, -48.481939]}
                                                renderWorldCopies={false}
                                                preserveDrawingBuffer={true}// eslint-disable-next-line
                                                style="mapbox://styles/mapbox/streets-v9"
                                                containerStyle={{
                                                    height: "100vh",
                                                    width: "100vw"
                                                }}>
                                                <ScaleControl />
                                                <ZoomControl />
                                                <RotationControl style={{ top: 80 }} />

                                                <Layer type="circle" id="marker"
                                                    paint={{ 'circle-color': "#f1f1f1", 'circle-stroke-width': 5, 'circle-stroke-color': '#e3342f', 'circle-stroke-opacity': 1 }}>
                                                    {/* Afghanistan */}
                                                    <Feature coordinates={[69.160652, 34.543896]} />
                                                    {/* Algeria */}
                                                    <Feature coordinates={[2.617994, 28.080708,]} />
                                                    {/* Armenia */}
                                                    <Feature coordinates={[44.645285, 40.244200,]} />
                                                    {/* Azerbaijan */}
                                                    <Feature coordinates={[48.052563, 40.377846,]} />
                                                    {/* Bangladesh */}
                                                    <Feature coordinates={[90.181624, 24.075533,]} />
                                                    {/* Benin */}
                                                    <Feature coordinates={[2.225507, 9.219552,]} />
                                                    {/* Bhutan */}
                                                    <Feature coordinates={[90.415746, 27.448847]} />
                                                    {/* Bolivia */}
                                                    <Feature coordinates={[-64.324792, -17.281563,]} />
                                                    {/* Burkina Faso */}
                                                    <Feature coordinates={[-1.271486, 12.480927,]} />
                                                    {/* Burundi */}
                                                    <Feature coordinates={[29.874460, -3.193272,]} />
                                                    {/* Cambodia */}
                                                    <Feature coordinates={[104.945404, 12.864355,]} />
                                                    {/* Cameroon */}
                                                    <Feature coordinates={[12.201323, 5.257579,]} />
                                                    {/* Cape Verde */}
                                                    <Feature coordinates={[-24.301501, 16.613297,]} />
                                                    {/* Central African Republic */}
                                                    <Feature coordinates={[20.325225, 7.038587,]} />
                                                    {/* Chad */}
                                                    <Feature coordinates={[19.130502, 13.206713,]} />
                                                    {/* Colombia */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Congo */}
                                                    <Feature coordinates={[15.301639, -1.053218,]} />
                                                    {/* Costa Rica */}
                                                    <Feature coordinates={[-84.051793, 10.018020,]} />
                                                    {/* Cote d'Ivoire */}
                                                    <Feature coordinates={[-5.525905, 7.668960,]} />
                                                    {/* Democratic Republic of the Congo */}
                                                    <Feature coordinates={[23.448915, -2.092327,]} />
                                                    {/* Djibouti */}
                                                    <Feature coordinates={[42.551811, 11.801396,]} />
                                                    {/* El Salvador */}
                                                    <Feature coordinates={[-89.178405, 13.704638,]} />
                                                    {/* Ethiopia */}
                                                    <Feature coordinates={[39.355694, 8.597514,]} />
                                                    {/* Gambia */}
                                                    <Feature coordinates={[-15.382182, 13.488336,]} />
                                                    {/* Georgia */}
                                                    <Feature coordinates={[43.514107, 42.215320,]} />
                                                    {/* Ghana */}
                                                    <Feature coordinates={[-1.202725, 7.934625,]} />
                                                    {/* Guatemala */}
                                                    <Feature coordinates={[-90.506569, 14.634245,]} />
                                                    {/* Guinea-Bissau */}
                                                    <Feature coordinates={[-15.224155, 12.054565,]} />
                                                    {/* Guinea */}
                                                    <Feature coordinates={[-10.806335, 10.440882,]} />
                                                    {/* Haiti */}
                                                    <Feature coordinates={[-72.734947, 19.047684,]} />
                                                    {/* Honduras */}
                                                    <Feature coordinates={[-86.861214, 14.559970,]} />
                                                    {/* India */}
                                                    <Feature coordinates={[78.825513, 21.788389,]} />
                                                    {/* Indonesia */}
                                                    <Feature coordinates={[121.621509, -3.585630,]} />
                                                    {/* Iran (Islamic Republic of) */}
                                                    <Feature coordinates={[54.266900, 31.893685,]} />
                                                    {/* Iraq */}
                                                    <Feature coordinates={[42.891477, 32.858487,]} />
                                                    {/* Jordan */}
                                                    <Feature coordinates={[36.072653, 31.314758,]} />
                                                    {/* Kenya */}
                                                    <Feature coordinates={[37.585408, 0.349233,]} />
                                                    {/* Kyrgyzstan */}
                                                    <Feature coordinates={[74.448300, 41.392023,]} />
                                                    {/* Lao People's Democratic Republic */}
                                                    <Feature coordinates={[102.519099, 19.469703,]} />
                                                    {/* Lebanon */}
                                                    <Feature coordinates={[35.520069, 33.879432,]} />
                                                    {/* Lesotho */}
                                                    <Feature coordinates={[28.234398, -29.533461,]} />
                                                    {/* Liberia */}
                                                    <Feature coordinates={[-9.513716, 6.501936,]} />
                                                    {/* Madagascar */}
                                                    <Feature coordinates={[47.292331, -18.696698,]} />
                                                    {/* Malawi */}
                                                    <Feature coordinates={[34.024185, -13.725110,]} />
                                                    {/* Mali */}
                                                    <Feature coordinates={[-1.643651, 17.046732,]} />
                                                    {/* Mauritania */}
                                                    <Feature coordinates={[-10.544718, 19.784432,]} />
                                                    {/* Mozambique */}
                                                    <Feature coordinates={[35.339927, -17.827098,]} />
                                                    {/* Myanmar */}
                                                    <Feature coordinates={[96.476129, 20.781468,]} />
                                                    {/* Nepal */}
                                                    <Feature coordinates={[96.476129, 20.781468,]} />
                                                    {/* Niger */}
                                                    <Feature coordinates={[7.930589, 16.784873,]} />
                                                    {/* Nigeria */}
                                                    <Feature coordinates={[7.555549, 9.097158,]} />
                                                    {/* Pakistan */}
                                                    <Feature coordinates={[69.884546, 30.171939,]} />
                                                    {/* Panama */}
                                                    <Feature coordinates={[-79.540863, 9.044274,]} />
                                                    {/* Peru */}
                                                    <Feature coordinates={[-76.170483, -10.214259,]} />
                                                    {/* Philippines */}
                                                    <Feature coordinates={[123.402065, 12.352938,]} />
                                                    {/* Rwanda */}
                                                    <Feature coordinates={[29.917902, -1.991663,]} />
                                                    {/* Senegal */}
                                                    <Feature coordinates={[-14.465954, 14.328547,]} />
                                                    {/* Somalia */}
                                                    <Feature coordinates={[45.357694, 2.478980,]} />
                                                    {/* Sri Lanka */}
                                                    <Feature coordinates={[80.625558, 7.557129,]} />
                                                    {/* Swaziland */}
                                                    <Feature coordinates={[31.476222, -26.498716,]} />
                                                    {/* Syrian Arab Republic */}
                                                    <Feature coordinates={[38.319393, 35.364844,]} />
                                                    {/* Tajikistan */}
                                                    <Feature coordinates={[71.059068, 38.583969,]} />
                                                    {/* Timor-Leste */}
                                                    <Feature coordinates={[125.977371, -8.727266,]} />
                                                    {/* Turkey */}
                                                    <Feature coordinates={[35.343263, 38.778747,]} />
                                                    {/* Uganda */}
                                                    <Feature coordinates={[32.331126, 1.383479,]} />
                                                    {/* Ukraine */}
                                                    <Feature coordinates={[31.326654, 48.940638,]} />
                                                    {/* United Republic of Tanzania */}
                                                    <Feature coordinates={[35.363203, -5.983537,]} />
                                                    {/* Yemen */}
                                                    <Feature coordinates={[47.466198, 15.609636,]} />
                                                    {/* Zambia */}
                                                    <Feature coordinates={[28.655082, -13.827251,]} />
                                                    {/* Zimbabwe */}
                                                    <Feature coordinates={[29.974076, -19.376546,]} />
                                                    {/* State of Palestine */}
                                                    <Feature coordinates={[35.219756, 31.805650,]} />
                                                    {/* Sudan */}
                                                    <Feature coordinates={[30.572141, 16.202975,]} />
                                                    {/* Egypt */}
                                                    <Feature coordinates={[29.938852, 26.457755,]} />
                                                    {/* South Sudan */}
                                                    <Feature coordinates={[29.880811, 7.471664,]} />
                                                </Layer>

                                            </Map>
                                        </Card>
                                    </div>
                                </FuseAnimateGroup>
                            )}
                        {tabValue === 1 && (
                            <FuseAnimateGroup className="flex flex-wrap" enter={{ animation: "transition.slideUpBigIn" }}  >
                                <Dialog
                                    open={setOpen}
                                    onClose={setOpen}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description" >
                                    <DialogTitle id="alert-dialog-title">{"Aviso !!!"}</DialogTitle>
                                    <DialogContent >
                                        <DialogContentText id="alert-dialog-description">
                                            Por favor aguarde. Estamos localizando as informações sobre o país escolhido...
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
                                <div className="widget flex w-full p-12">
                                    <Paper className="w-full rounded-8 shadow-none border-1">
                                        <div className="flex items-center justify-between px-16 h-64 border-b-1">
                                            <Typography className="text-16">Gráfico</Typography>
                                        </div>
                                        <div className="h-100 w-full p-32">
                                            <Scatter data={{
                                                //lightBlue[600],
                                                datasets: [
                                                    {
                                                        label: 'Erro 404',
                                                        fill: true,
                                                        showLine: false,  //!\\ Add this line
                                                        backgroundColor: lightBlue[400],
                                                        pointBorderColor: lightBlue[600],
                                                        pointBackgroundColor: '#fff',
                                                        pointBorderWidth: 10,
                                                        pointHoverRadius: 10,
                                                        pointHoverBackgroundColor: lightBlue[600],
                                                        pointHoverBorderColor: '#f1f1f1',
                                                        pointHoverBorderWidth: 4,
                                                        pointRadius: 2,
                                                        pointHitRadius: 20,
                                                        data: [...data]
                                                    }
                                                ]
                                            }} />
                                        </div>
                                    </Paper>
                                    {/*     <Widget8 widget={widgets.widget8} /> */}
                                </div>
                                {/*   <div className="widget flex w-full sm:w-1/2 p-12">
                                    <Widget9 widget={widgets.widget9} />
                                </div> */}
                                <div className="widget flex w-full p-12">
                                    {/*  <Widget10 widget={widgets.widget10} /> */}
                                </div>
                            </FuseAnimateGroup>
                        )}
                        {tabValue === 2 && (
                            <FuseAnimateGroup className="flex flex-wrap" enter={{ animation: "transition.slideUpBigIn" }}   >
                                <div className="widget flex w-full p-12">
                                    <Widget11 widget={widgets.widget11} />
                                </div>
                            </FuseAnimateGroup>
                        )}
                    </div>
                }
                onRef={instance => {
                    this.pageLayout = instance;
                }}
            />
        );
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getWidgets: Actions.getWidgets,
        getProjects: Actions.getProjects
    }, dispatch);
}

function mapStateToProps({ projectDashboardApp }) {
    return {
        widgets: projectDashboardApp.widgets,
        projects: projectDashboardApp.projects
    }
}

export default withReducer('projectDashboardApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectDashboardApp))));
