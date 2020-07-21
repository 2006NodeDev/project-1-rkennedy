import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { Button, TextField, withStyles, makeStyles, Container, CssBaseline, Typography, Grid } from "@material-ui/core";
import { astrologySignUp } from "../../astrology-api/astrology-sign-up";
import { User } from "../../models/User";
import { RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify'

interface ISignInProps extends RouteComponentProps{
    changeCurrentUser:(newUser:any)=>void
}

export const SignUpComponent:FunctionComponent<ISignInProps> = (props) =>{
    const classes = useStyles();

    let [username, changeUsername] = useState("") 
    let [password, changePassword] = useState("")
    let [confirmPassword, changeConfirmPassword] = useState("")
    let [firstName, changeFirstName] = useState("")
    let [lastName, changeLastName] = useState("")
    let [email, changeEmail] = useState("")
    let [image, changeImage] = useState(null)

    const updateUsername = (e:any) => {
        e.preventDefault()
        changeUsername(e.currentTarget.value)
    }
    const updatePassword = (e:any) => {
        e.preventDefault()
        changePassword(e.currentTarget.value)
    }
    const updateConfirmPassword = (e:any) => {
        e.preventDefault()
        changeConfirmPassword(e.currentTarget.value)
    }
    const updateFirstName = (e:any) => {
        e.preventDefault()
        changeFirstName(e.currentTarget.value)
    }
    const updateLastName = (e:any) => {
        e.preventDefault()
        changeLastName(e.currentTarget.value)
    } 
    const updateEmail = (e:any) => {
        e.preventDefault()
        changeEmail(e.currentTarget.value)
    }
    const updateImage = (e:any) => {
        e.preventDefault()
        let file:File = e.currentTarget.files[0]
        if (file){
          let reader = new FileReader()
          //start an async function on reader object
          reader.readAsDataURL(file)
          //set a callback for when it's done reading
          reader.onload = () =>{
              console.log(reader.result); //to see binary representation of the image
              changeImage(reader.result)
          }
        }
    }
    const submitUser = async (e:SyntheticEvent) => {
        e.preventDefault() // always have to prevent default of refreshing the page
        if(password !== confirmPassword){
            toast.error('Entered Passwords Do Not Match!')
        } else {
            let newUser: User = { //assign values to new user
                userId: 0,
                username,
                password,
                firstName,
                lastName,
                email,
                //should this be "user"?
                role: "user", //changed roles to just be strings
                image //need to add to models and user router!!!
            }
            let res = await astrologySignUp(newUser) //return a new user
            props.changeCurrentUser(res) //change current user
            props.history.push(`/user/profile/${res.userId}`) //send too profile page (or elsewhere?)
        }
    }
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form autoComplete="off" onSubmit={submitUser} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={updateUsername}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={updatePassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={updateConfirmPassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  value={email}
                  onChange={updateEmail}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  value={firstName}
                  onChange={updateFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={updateLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="file">Profile Picture</label> <br/>
                <input type="file" name="file" accept="image/*" onChange={updateImage} />
                <img src={image} width="100%"/>
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                > Register
                </CustomButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Link to= "/home" style={{ textDecoration:"none"}}>
                <CustomButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                > Cancel 
                </CustomButton>
                </Link>
              </Grid>
            </Grid>            
          </form>
        </div>
      </Container>
    )
}
const CustomButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText('#ffb2e6'),
    backgroundColor: "'#ffb2e6'",
    '&:hover': {
      backgroundColor: '#1c3041',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(6),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: '#ffb2e6',
      color: 'purple',
      fontFamily: "Ubuntu",
      fontSize: 18
    },
    media: {
    }
}));