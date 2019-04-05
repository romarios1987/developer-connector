import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withRouter} from "react-router-dom";

import classNames from 'classnames';

import {connect} from 'react-redux';
import {registerUser} from "../../actions/authAction";

class Register extends Component {

  state = {
    name: '',
    email: '',
    password: '',
    password_confirm: '',
    errors: {}
  };


  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.errors) {
      this.setState({errors: nextProps.errors})
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };


  onSubmit = (e) => {
    e.preventDefault();
    const {errors, ...fields} = this.state;
    const newUser = {...fields};

    //console.log(newUser);

    this.props.registerUser(newUser, this.props.history)

  };

  render() {
    const {name, email, password, password_confirm, errors} = this.state;

    return (
          <div className="register">

            <div className="container">
              <div className="row">
                <div className="col-md-8 m-auto">
                  <h1 className="display-4 text-center">Sign Up</h1>
                  <p className="lead text-center">Create your DevConnector account</p>
                  <form noValidate onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <input type="text"
                             className={classNames('form-control form-control-lg', {
                               'is-invalid': errors.name
                             })}
                             placeholder="Name"
                             name="name"
                             value={name}
                             onChange={this.onChange}/>
                      {errors.name && (<div className="invalid-feedback"> {errors.name}</div>)}
                    </div>

                    <div className="form-group">
                      <input type="email"
                             className={classNames('form-control form-control-lg', {
                               'is-invalid': errors.email
                             })}
                             placeholder="Email Address"
                             name="email"
                             value={email}
                             onChange={this.onChange}/>
                      {errors.email && (<div className="invalid-feedback"> {errors.email}</div>)}
                    </div>

                    <div className="form-group">
                      <input type="password"
                             className={classNames('form-control form-control-lg', {
                               'is-invalid': errors.password
                             })}
                             placeholder="Password"
                             name="password"
                             value={password}
                             onChange={this.onChange}/>
                      {errors.password && (<div className="invalid-feedback"> {errors.password}</div>)}
                    </div>
                    <div className="form-group">
                      <input type="password"
                             className={classNames('form-control form-control-lg', {
                               'is-invalid': errors.password_confirm
                             })}
                             placeholder="Confirm Password"
                             name="password_confirm"
                             value={password_confirm}
                             onChange={this.onChange}/>
                      {errors.password_confirm && (<div className="invalid-feedback"> {errors.password_confirm}</div>)}
                    </div>
                    <input type="submit" className="btn btn-info btn-block mt-4"/>
                  </form>
                </div>
              </div>
            </div>
          </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(mapStateToProps, {registerUser})(withRouter(Register));