import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [values, setValues] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user?.displayName);
        navigate("/dashboard");
      } else {
        setUserName("");
      }
    });
  }, []);

  const getUserData = (e) => {
    let name, value;

    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };
  const handleSubmit = async (e) => {
    const { name, email, password } = values;
    if (email === "" || password === "") {
      setErrorMsg("Please Fill all Fields.");
      return;
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (res) => {
          setErrorMsg("");
          navigate("/dashboard");
        })
        .catch((err) => {
          setErrorMsg(err.message);
        });
    }
  };

  return (
    <Grid
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#8aa1cf",
      }}
    >
      <Paper
        elevation={10}
        style={{
          padding: 20,
          width: 300,
          margin: "20px",
        }}
      >
        <Grid align={"center"}>
          <Avatar style={{ backgroundColor: "#1bbd7e" }}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <TextField
          style={{ margin: "10px 0px" }}
          label={"username"}
          placeholder={"Enter username"}
          name="email"
          onChange={getUserData}
          value={values.email}
          fullWidth
          required
        />
        <TextField
          style={{ margin: "10px 0px" }}
          label={"password"}
          placeholder={"Enter password"}
          type={"password"}
          name="password"
          onChange={getUserData}
          value={values.password}
          fullWidth
          required
        />
        <p style={{ color: "red", fontWeight: "600" }}>{errorMsg}</p>
        <Button
          style={{
            margin: "10px 0px",
            backgroundColor: "#1976d2",
            color: "#fff",
          }}
          type={"submit"}
          color={"primary"}
          varient={"contained"}
          fullWidth
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <Typography style={{ margin: "10px 0px" }}>
          Create a new account ? <Link to={"/signup"}>Sign Up</Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default Login;
