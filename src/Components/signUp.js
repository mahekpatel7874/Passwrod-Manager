import React, { useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const getUserData = (e) => {
    let name, value;

    name = e.target.name;
    value = e.target.value;

    setValues({ ...values, [name]: value });
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    const { name, email, password } = values;
    if (name === "" || email === "" || password === "") {
      setErrorMsg("Please Fill all Fields.");
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          setErrorMsg("");
          signOut(auth)
            .then(() => {
              navigate("/");
            })
            .catch((err) => {
              setErrorMsg(err.message);
            });
          // updateProfile(res.user, {
          //   displayName: name,
          // });
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
        elevation={20}
        style={{
          padding: "30px 20px",
          margin: "20px auto",
          width: 300,
        }}
      >
        <Grid align={"center"}>
          <Avatar style={{ backgroundColor: "#1bbd7e" }}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2>Sign Up</h2>
        </Grid>
        <form method="POST">
          <TextField
            style={{ margin: "10px 0px" }}
            label={"Fullname"}
            placeholder={"Enter fullname"}
            name="name"
            onChange={getUserData}
            value={values.name}
            fullWidth
            required
          />
          <TextField
            style={{ margin: "10px 0px" }}
            label={"email"}
            placeholder={"Enter email"}
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
            name="password"
            onChange={getUserData}
            value={values.password}
            type={"password"}
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
            color={"primary"}
            varient={"contained"}
            fullWidth
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </form>

        <Typography style={{ margin: "10px 0px" }}>
          Do you have an account ? <Link to={"/"}>Sign In</Link>
        </Typography>
      </Paper>
    </Grid>
  );
}

export default SignUp;
