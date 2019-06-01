import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { Card, Hidden, Icon, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import axios from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import ReactMapboxGl, { Feature, Layer, ZoomControl, ScaleControl, RotationControl } from "react-mapbox-gl";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { END_POINT } from '../../../../../endPoint';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget10 from './widgets/Widget10';
import Widget11 from './widgets/Widget11';
import Widget8 from './widgets/Widget8';
import Widget9 from './widgets/Widget9';

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
        analyticsTotalCidades: 0
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


    render() {
        const { widgets, projects, classes } = this.props;
        const { tabValue, projectMenuEl, responseJson, linhasAnalisadas, routeAnalyticsKM, analyticsTotalCidades } = this.state;


        if (!widgets || !projects) {
            return null;
        }

        let listaPaises = _.map(responseJson, paises => ({
            id: Math.random(),
            name: paises,
        }));

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
                                        <MenuItem onBlur key={paises.id} onClick={ev => { alert(paises.name) }}>{paises.name}</MenuItem>
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
                        <Tab className="text-14 font-600 normal-case" label="Budget Summary" />
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
                                                <Typography className="text-16">Cidade</Typography>
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
                                                preserveDrawingBuffer={true}
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
                                                   //parei aki {/* Honduras */}
                                                    <Feature coordinates={[-87.146349, 14.847678,]} />
                                                    {/* India */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Indonesia */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Iran (Islamic Republic of) */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Iraq */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Jordan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Kenya */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Kyrgyzstan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Lao People's Democratic Republic */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Lebanon */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Lesotho */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Liberia */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Madagascar */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Malawi */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Mali */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Mauritania */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Mozambique */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Myanmar */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Nepal */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Niger */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Nigeria */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Pakistan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Panama */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Peru */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Philippines */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Rwanda */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Senegal */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Somalia */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Sri Lanka */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Swaziland */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Syrian Arab Republic */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Tajikistan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Timor-Leste */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Turkey */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Uganda */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Ukraine */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* United Republic of Tanzania */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Yemen */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Zambia */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Zimbabwe */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* State of Palestine */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Sudan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* Egypt */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                    {/* South Sudan */}
                                                    <Feature coordinates={[-75.675690, 4.535000]} />
                                                </Layer>

                                            </Map>
                                        </Card>
                                    </div>
                                </FuseAnimateGroup>
                            )}
                        {tabValue === 1 && (
                            <FuseAnimateGroup className="flex flex-wrap" enter={{ animation: "transition.slideUpBigIn" }}  >
                                <div className="widget flex w-full sm:w-1/2 p-12">
                                    <Widget8 widget={widgets.widget8} />
                                </div>
                                <div className="widget flex w-full sm:w-1/2 p-12">
                                    <Widget9 widget={widgets.widget9} />
                                </div>
                                <div className="widget flex w-full p-12">
                                    <Widget10 widget={widgets.widget10} />
                                </div>
                            </FuseAnimateGroup>
                        )}
                        {tabValue === 2 && (
                            <FuseAnimateGroup
                                className="flex flex-wrap"
                                enter={{
                                    animation: "transition.slideUpBigIn"
                                }}
                            >
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
