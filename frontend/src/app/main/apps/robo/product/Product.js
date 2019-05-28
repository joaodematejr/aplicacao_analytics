import { FuseAnimate, FusePageCarded } from '@fuse';
import _ from '@lodash';
import { Button, Icon, IconButton, InputAdornment, Tab, Tabs, TextField, Typography, withStyles } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import withReducer from 'app/store/withReducer';
import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import connect from 'react-redux/es/connect/connect';
import { Link, withRouter } from 'react-router-dom';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import { bindActionCreators } from 'redux';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import InputLabel from '@material-ui/core/InputLabel';


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

    state = {
        tabValue: 0,
        form: null,
        showPassword: 'password'
    };

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

    enviarDados() {
        console.log('this.state.form', this.state.form)
    }

    canBeSubmitted() {
        const { url } = this.state.form;
        return (
            url.length > 0 &&
            !_.isEqual(this.props.product.data, this.state.form)
        );
    }


    render() {
        const { tabValue, form } = this.state;
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
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/apps/dashboards/analytics">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Configuração
                                    </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">
                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography className="text-16 sm:text-20 truncate">
                                                Configuração Robo
                                            </Typography>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography variant="caption">Login / Senha</Typography>
                                        </FuseAnimate>
                                    </div>
                                </div>
                            </div>
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Button
                                    className="whitespace-no-wrap"
                                    variant="contained"
                                    disabled={!this.canBeSubmitted()}
                                    onClick={() => this.enviarDados()} >
                                    Enviar
                                </Button>
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
                    </Tabs>
                }
                content={
                    form && (
                        <div className="p-16 sm:p-24 max-w-6xl">
                            {tabValue === 0 &&
                                (
                                    <div>

                                        <FormControl className="mt-8 mb-16" required id="navegador" labelWidth={''} error={form.url === ''} fullWidth variant="outlined" >
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
