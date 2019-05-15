import { FuseAnimateGroup, FusePageSimple } from '@fuse';
import { Hidden, Icon, IconButton, Menu, MenuItem, Tab, Tabs, Typography, withStyles } from '@material-ui/core';
import withReducer from 'app/store/withReducer';
import classNames from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import Widget1 from './widgets/Widget1';
import Widget10 from './widgets/Widget10';
import Widget11 from './widgets/Widget11';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import Widget7 from './widgets/Widget7';
import Widget8 from './widgets/Widget8';
import Widget9 from './widgets/Widget9';
import WidgetNow from './widgets/WidgetNow';

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
        projectMenuEl: null
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
        this.props.getWidgets();
        this.props.getProjects();
    }

    render() {
        const { widgets, projects, classes } = this.props;
        const { tabValue, selectedProjectId, projectMenuEl } = this.state;

        if (!widgets || !projects) {
            return null;
        }

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
                                    aria-label="open left sidebar"
                                >
                                    <Icon>menu</Icon>
                                </IconButton>
                            </Hidden>
                        </div>
                        <div className="flex items-end">
                            <div className="flex items-center">
                                <div className={classNames(classes.selectedProject, "flex items-center h-40 px-16 text-16")}>
                                    {_.find(projects, ['id', selectedProjectId]).name}
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
                                    onClose={this.handleCloseProjectMenu}
                                >
                                    {projects && projects.map(project => (
                                        <MenuItem key={project.id} onClick={ev => {
                                            this.handleChangeProject(project.id)
                                        }}>{project.name}</MenuItem>
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
                                <FuseAnimateGroup
                                    className="flex flex-wrap"
                                    enter={{
                                        animation: "transition.slideUpBigIn"
                                    }}
                                >
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Widget1 widget={widgets.widget1} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Widget2 widget={widgets.widget2} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Widget3 widget={widgets.widget3} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
                                        <Widget4 widget={widgets.widget4} />
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
                rightSidebarContent={
                    <FuseAnimateGroup
                        className="w-full"
                        enter={{
                            animation: "transition.slideUpBigIn"
                        }}
                    >
                        <div className="widget w-full p-12">
                            <WidgetNow />
                        </div>
                    </FuseAnimateGroup>
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
