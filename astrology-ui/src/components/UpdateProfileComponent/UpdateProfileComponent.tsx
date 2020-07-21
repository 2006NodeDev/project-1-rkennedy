import React, { FunctionComponent, SyntheticEvent, useState } from "react";
import { Button, TextField, makeStyles, Container, CssBaseline, Typography, Grid, withStyles } from "@material-ui/core";
import { astrologyUpdateUser } from "../../astrology-api/astrology-update-user";
import { User } from "../../models/User";
import { Link, useParams, RouteComponentProps } from 'react-router-dom';
import {toast} from 'react-toastify'

export const UpdateProfileComponent:FunctionComponent<any> = (props) =>{
    const classes = useStyles();

    let {userId} = useParams()

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
        if (e.currentTarget.value !== ''){
            changeFirstName(e.currentTarget.value)
        } 
    }
    const updateLastName = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== ''){
            changeLastName(e.currentTarget.value)
        } 
    } 
    const updateEmail = (e:any) => {
        e.preventDefault()
        if (e.currentTarget.value !== ''){
            changeEmail(e.currentTarget.value)
        } 
    }
    const updateImage = (e:any) => {
        e.preventDefault()
        let file:File = e.currentTarget.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () =>{
            console.log(reader.result);
            changeImage(reader.result) 
        }
    }

    const updateUser = async (e:SyntheticEvent) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error('Passwords Do Not Match!')
        } else if (username && props.user.image && !image){
            toast.error('Please re-upload image so that file can be updated!')
        } else if (!username){
            username = props.user.username
            let updatedUser: User = {
              userId,
              username,
              password,
              firstName,
              lastName,
              email,
              role: "user",
              image 
          }
          let res = await astrologyUpdateUser(updatedUser) //make sure endpoint returns new user
          props.history.push(`/user/profile/${res.userId}`) //send too profile page (or elsewhere?)
        } else {
            let updatedUser: User = {
                userId,
                username,
                password,
                firstName,
                lastName,
                email,
                role: "user",
                image 
            }
            let res = await astrologyUpdateUser(updatedUser) //make sure endpoint returns new user
            props.history.push(`/user/profile/${res.userId}`) //send too profile page (or elsewhere?)
        }
    }
    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Update User Profile
          </Typography>
          <form autoComplete="off" onSubmit={updateUser} className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="username"
                  label="New Username"
                  name="username"
                  value={username}
                  onChange={updateUsername}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New Password"
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
                  fullWidth
                  name="confirm-password"
                  label="Confirm New Password"
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
                  label="Change Email"
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
                  label="Change First Name"
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
                  label="Change Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={updateLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="file">Change Profile Picture</label> <br/>
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
                > Update
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