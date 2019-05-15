import React, { Component } from 'react';
import { withStyles, Button, Tab, Tabs, TextField, InputAdornment, Icon, Typography, IconButton } from '@material-ui/core';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { FuseAnimate, FusePageCarded } from '@fuse';
import { orange } from '@material-ui/core/colors';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import classNames from 'classnames';
import _ from '@lodash';
import Visibility from '@material-ui/icons/Visibility';
import withReducer from 'app/store/withReducer';
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

    state = {
        tabValue: 0,
        form: null
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

    handleChipChange = (value, name) => {
        this.setState({ form: _.set({ ...this.state.form }, name, value.map(item => item.value)) });
    };

    setFeaturedImage = (id) => {
        this.setState({ form: _.set({ ...this.state.form }, 'featuredImageId', id) });
    };

    canBeSubmitted() {
        const { name } = this.state.form;
        return (
            name.length > 0 &&
            !_.isEqual(this.props.product.data, this.state.form)
        );
    }

    render() {
        const { classes, saveProduct } = this.props;
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
                                    onClick={() => saveProduct(form)}
                                >
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
                        <Tab className="h-64 normal-case" label="Informação básica" />
                    </Tabs>
                }
                content={
                    form && (
                        <div className="p-16 sm:p-24 max-w-6xl">
                            {tabValue === 0 &&
                                (
                                    <div>

                                        <TextField
                                            className="mt-8 mb-16"
                                            error={form.name === ''}
                                            required
                                            label="URL"
                                            autoFocus
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={this.handleChange}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            className="mt-8 mb-16"
                                            required
                                            id="description"
                                            name="description"
                                            onChange={this.handleChange}
                                            label="Login"
                                            type="text"
                                            value={form.description}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            id="filled-adornment-password"
                                            className="mt-8 mb-16"
                                            fullWidth
                                            required
                                            variant="outlined"
                                            type={this.state.showPassword ? 'text' : 'password'}
                                            label="Password"
                                            value={this.state.password}
                                            //onChange={this.handleChange('password')}
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
                            {tabValue === 1 && (
                                <div>
                                    <div className="flex justify-center sm:justify-start flex-wrap">
                                        {form.images.map(media => (
                                            <div
                                                onClick={() => this.setFeaturedImage(media.id)}
                                                className={
                                                    classNames(
                                                        classes.productImageItem,
                                                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer",
                                                        (media.id === form.featuredImageId) && 'featured')
                                                }
                                                key={media.id}
                                            >
                                                <Icon className={classes.productImageFeaturedStar}>star</Icon>
                                                <img className="max-w-none w-auto h-full" src={media.url} alt="product" />
                                            </div>
                                        ))}
                                    </div>
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
        saveProduct: Actions.saveProduct
    }, dispatch);
}

function mapStateToProps({ eCommerceApp }) {
    return {
        product: eCommerceApp.product
    }
}

export default withReducer('eCommerceApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Product))));
