import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { Hidden, Icon, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import axios from 'axios';
import classNames from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { END_POINT } from '../../../../../endPoint';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget10 from './widgets/Widget10';
import Widget11 from './widgets/Widget11';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import Widget7 from './widgets/Widget7';
import Widget8 from './widgets/Widget8';
import Widget9 from './widgets/Widget9';

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
        this.props.getWidgets();
        this.props.getProjects();

    }


    render() {
        const { widgets, projects, classes } = this.props;
        const { tabValue, projectMenuEl, responseJson, linhasAnalisadas, routeAnalyticsKM } = this.state;

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
                        className="w-full border-b-1 px-24"
                    >
                        <Tab className="text-14 font-600 normal-case" label="Home" />
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
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
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
                                    {/*    QUANTIDADES CIDADES  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
                                        <Paper className="w-full rounded-8 shadow-none border-1">
                                            <div className="flex items-center justify-between pr-4 pl-16 pt-4">
                                                <Typography className="text-16">Localidade</Typography>
                                                <IconButton aria-label="more">
                                                    <Icon>more_vert</Icon>
                                                </IconButton>
                                            </div>
                                            <div className="text-center pt-12 pb-28">
                                                <Typography
                                                    className="text-72 leading-none text-green">{routeAnalyticsKM.length}</Typography>
                                                <Typography className="text-16" color="textSecondary">Localidades</Typography>
                                            </div>
                                            <div className="flex items-center px-16 h-52 border-t-1">
                                                <Typography className="text-15 flex w-full" color="textSecondary">
                                                    <span className="truncate">Total de</span>
                                                    :
                                                    <b className="pl-8"> {routeAnalyticsKM.length} </b>
                                                    &#160;
                                                    <span className="truncate"> Localidades </span>
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>
                                    {/*    QUANTIDADES DE LINHAS ANALISADAS  */}
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/3 p-12">
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
                                        <Widget5 widget={widgets.widget5} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/2 p-12">
                                        <Widget6 widget={widgets.widget6} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/2 p-12">
                                        <Widget7 widget={widgets.widget7} />
                                    </div>
                                </FuseAnimateGroup>
                            )}
                        {tabValue === 1 && (
                            <FuseAnimateGroup
                                className="flex flex-wrap"
                                enter={{
                                    animation: "transition.slideUpBigIn"
                                }}
                            >
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
