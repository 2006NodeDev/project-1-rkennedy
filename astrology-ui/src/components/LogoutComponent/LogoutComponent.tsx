//needs work

import React, { FunctionComponent, SyntheticEvent } from "react";
import { astrologyLogOut } from "../../astrology-api/astrology-logout";
import { Button, makeStyles, CssBaseline, Container, Typography, Grid } from "@material-ui/core";
import { RouteComponentProps } from "react-router";

interface ILogoutProps extends RouteComponentProps{
    changeCurrentUser:(newUser:any)=>void
}

export const LogOutComponent: FunctionComponent<ILogoutProps> = (props)=>{
    const classes = useStyles();

    const logoutUser = async (e: SyntheticEvent) => {
        e.preventDefault()

        let res = await astrologyLogOut()
        console.log(res)
        props.changeCurrentUser(res)
        props.history.push(`/home`)
    } 

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
                Are you sure you want to log out?
            </Typography>
            <Grid item xs={12}>
               <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={logoutUser}
                > Logout
              </Button>
            </Grid>
          </div>
        </Container>

    )
}

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
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: 'green',
      color: 'purple',
      fontSize: 18,
    },

}));