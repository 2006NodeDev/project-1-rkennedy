import React, { FunctionComponent, useState, SyntheticEvent } from "react"
import { astrologyLogin } from "../../astrology-api/astrology-login"
import { RouteComponentProps } from "react-router"
import {TextField, Button, makeStyles, Container, CssBaseline, Typography, Grid, withStyles} from "@material-ui/core"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

interface ILoginProps extends RouteComponentProps{
    changeCurrentUser:(newUser:any)=>void
}

export const LoginComponent:FunctionComponent<ILoginProps> = (props) => {
    const classes = useStyles();
    const [username, changeUsername] = useState("")
    const [password, changePassword] = useState("")

    const updatePassword = (event:any) => { 
        event.preventDefault() 
        changePassword(event.currentTarget.value) 
    }

    const updateUsername = (event:any) => {
        event.preventDefault()
        changeUsername(event.currentTarget.value) 
    }
    
    const loginSubmit = async (e:SyntheticEvent) => { 
        e.preventDefault()
        let res = await astrologyLogin(username, password) 
        console.log(res)
        
        if (!res.userId){
            toast.error('Invalid Login Credentials! Please try again.')
            props.history.push(`/login`) 
        } else {
            props.changeCurrentUser(res) 
            props.history.push(`/user/profile/${res.userId}`) 
        }
    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Typography component="h1" variant="h5">
            Sign In
            </Typography>
            <form autoComplete="off" onSubmit={loginSubmit} className={classes.form} noValidate>
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
                <Grid item xs={12}>
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
                <CustomButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                > Login
                </CustomButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                <Link to= "/home" style={{ textDecoration:"none"}}>
                <CustomButton
                    type="submit"
                    fullWidth
                    variant="contained"
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
  
//styles at the bottom because closer to html return
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: '#ffb2e6',
        color: 'Purple',
        fontSize: 18,
    },
    media: {

    }
}));