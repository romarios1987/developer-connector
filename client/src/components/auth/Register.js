import React, {Component} from 'react';
import axios from 'axios';
import classNames from 'classnames';

class Register extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        errors: {}
    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };


    onSubmit = (e) => {
        e.preventDefault();
        const {errors, ...fields} = this.state;
        const newUser = {...fields};
        console.log(newUser);


        axios.post('/api/users/register', newUser)
            .then(res => console.log(res.data))
            .catch(err => this.setState({errors: err.response.data}))

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

export default Register;