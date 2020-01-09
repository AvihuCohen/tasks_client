import React, {Component} from 'react';
import classes from './AuthForm.module.css';
import {createArrayFromObject} from '../../shared/utility';
import {updateObject, checkValidity} from '../../shared/utility';
import {Link} from 'react-router-dom';

import {connect} from 'react-redux';
import * as actions from '../../store/actions';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';


class AuthForm extends Component {
    state = {
        controls: this.props.controls,
        formIsValid: false,
        signIn: this.props.isSignIn
    };

    static getDerivedStateFromProps(props, state) {
        if (props.isSignIn !== state.signIn) {
            console.log("getDerivedStateFromProps");
            return {
                controls: props.controls,
                signIn: props.isSignIn
            };
        }
        return null;
    }

    componentDidMount() {
        // console.log("componentDidMount");
        this.props.onResetError();
    };


    checkIfFormIsValid = () => {
        let isFormValid = true;
        for (let key in this.state.controls) {
            if (!this.state.controls[key].valid) {
                isFormValid = false;
            }
        }
        if (this.state.formIsValid !== isFormValid) {
            this.setState({formIsValid: isFormValid});
        }
    };

    onInputChangeHandler = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: event.target.value,
                touched: true,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation)
            })
        });

        // let formIsValid = this.checkIfFormIsValid();

        this.setState({controls: updatedControls}, this.checkIfFormIsValid);
    };

    createArrayFromObject = () => {
        let formElementsArray = [];

        for (let key in this.state.controls) {
            formElementsArray.push({
                    id: key,
                    config: this.state.controls[key]
                }
            );
        }

        return formElementsArray;
    };

    createInputs = (formElementsArray) => {
        let inputs = formElementsArray.map(formElement => {
            return <Input
                elementType={formElement.config.elementType}
                label={formElement.id}
                key={formElement.id}
                value={formElement.config.value}
                invalid={!formElement.config.valid}
                touched={formElement.config.touched}
                shouldValidate={formElement.config.validation}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(event) => this.onInputChangeHandler(event, formElement.id)}
            />
        });
        return inputs;
    };

    createTitle = () => {
        let res = null;

        if (this.props.isSignIn) {
            res = <div className={classes.Title}>
                <h2>Log In</h2>
            </div>;
        } else {
            res = <div className={classes.Title}>
                <h2>Sign Up</h2>
            </div>;
        }

        return res;
    };

    createMemberView = () => {
        let member = null;

        if (!this.props.isSignIn) {
            member = <div className={classes.Member}>
                <p> Already a member?
                    <Link to='/signIn'>
                        <span> Sign In</span>
                    </Link>
                </p>
            </div>
        } else {
            member = <div className={classes.Member}>
                <p> Not a member?
                    <Link to='/signUp'>
                        <span> Sign Up</span>
                    </Link>
                </p>
            </div>
        }

        return member;
    };

    createFormOfInputs = (formElementsArray) => {
        let inputs = this.createInputs(formElementsArray);
        let submit = this.props.isSignIn ? 'Log In' : 'Sign Up';
        let title = this.createTitle();
        let terms = !this.props.isSignIn ?
            <div className={classes.TermsAndPolicy}>
                <p>
                    By clicking the button, I agree to the
                    <span className={classes.Underline}> Term of Services </span>
                    and
                    <span className={classes.Underline}> Privacy Policy</span>.
                </p>
            </div> : null;

        let member = this.createMemberView();
        let button =
            <div
                onClick={(event) => {
                    if (this.state.formIsValid) {
                        console.log("GGGGG");

                        this.submitHandler(event);
                    }
                }}
                className={this.state.formIsValid ? classes.Submit : classes.SubmitDisabled + " " + classes.Submit }>
                <Button disabled={!this.state.formIsValid}>{submit}</Button>
            </div>;

        let error = this.createErrors();


        let form = <form className={classes.AuthForm} onSubmit={this.submitHandler}>
            {title}
            {error}
            {inputs}
            {button}
            {terms}
            {member}
        </form>;

        if (this.props.loading) {
            form = <Spinner/>
        }

        if (this.props.loading) {
            form = <Spinner/>
        }


        return form;
    };

    submitHandler = async (event) => {
        try {
            event.preventDefault();
            let signUp = this.props.isSignIn === false;


            if (signUp) {
               await this.props.onAuth(this.state.controls.Email.value, this.state.controls.Password.value, this.state.controls.Name.value, true, this.state.controls.Gender.value);
            } else {
                this.props.onAuth(this.state.controls.Email.value, this.state.controls.Password.value, null, false);
            }
        }catch (e) {

        }

    };

    createErrors = () => {
        let errors = this.props.error ? <div className={classes.Errors}>
            <h5>{this.props.error}</h5>
        </div> : null;

        return errors;
    };

    render() {
        let formElementsArray = createArrayFromObject(this.state.controls);

        let form = this.createFormOfInputs(formElementsArray);
        let authForm =
            <div className={classes.Auth}>
                {form}
            </div>;

        return (
            authForm
        )
    };
};

const mapStatesToProps = (state) => {
    return {
        loading: state.auth.loading,
        isAuthenticated: state.auth.token !== null,
        error: state.auth.error,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, fullName, signUp, gender) => dispatch(actions.auth(email, password, fullName, signUp, gender)),
        onResetError: () => dispatch(actions.authResetError())
    };
};

export default connect(mapStatesToProps, mapDispatchToProps)(AuthForm);