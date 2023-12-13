"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { fetchBackend } from "../_components/helper_functions";
import { useRouter } from "next/navigation";

function Register(props: PageContentProps) {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handle_registerBtn() {
    if (!email.includes("@") || email.length < 5 || email.includes(" ")) {
      setErrMsg("Please provide a valid email address");
    } else if (password.length < 8) {
      setErrMsg("Password must be at least 8 characters long");
    } else if (password.includes(" ")) {
      setErrMsg("Password cannot include white spaces");
    } else if (password !== passwordAgain) {
      setErrMsg("Passwords do not match");
    } else {
      let formData = new FormData();
      formData.append("name", "-");
      formData.append("password", password);
      formData.append("password_confirmation", passwordAgain);
      formData.append("email", email);

      setLoading(true);
      setErrMsg(null);
      const res = await fetchBackend("/register", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (res.status === 200) router.push("/");
      else if (res.status === 422) setErrMsg("email is already taken");
      else setErrMsg("unknown error");
      setLoading(false);
    }
  }

  return (
    <>
      <TextField
        label={"Your email..."}
        variant={"outlined"}
        value={email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />
      <TextField
        label={"Password..."}
        variant={"outlined"}
        type={"password"}
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(event.target.value);
        }}
      />
      <TextField
        label={"Password again..."}
        variant={"outlined"}
        type={"password"}
        value={passwordAgain}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPasswordAgain(event.target.value);
        }}
      />
      {errMsg && (
        <Alert severity="error" variant={"filled"}>
          {errMsg}
        </Alert>
      )}
      <Button variant={"contained"} onClick={handle_registerBtn}>
        {loading ? <CircularProgress color={"secondary"} /> : "Register"}
      </Button>
      <Button
        variant={"contained"}
        onClick={() => props.setPageContent("login")}
      >
        Login
      </Button>
    </>
  );
}

function Login(props: PageContentProps) {
  const router = useRouter();

  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handle_loginBtn() {
    await fetchBackend("/sanctum/csrf-cookie");

    let formData = new FormData();
    formData.append("email", emailValue);
    formData.append("password", passwordValue);

    setLoading(true);
    setErrMsg(null);
    const res = await fetchBackend("/login", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (res.status === 200) router.push("/");
    else if (res.status === 422) setErrMsg("Email or password incorrect");
    else setErrMsg("unknown error");
    setLoading(false);
  }

  return (
    <>
      <TextField
        label={"Your email..."}
        variant={"outlined"}
        value={emailValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmailValue(event.target.value);
        }}
      />
      <TextField
        label={"Password..."}
        variant={"outlined"}
        type={"password"}
        value={passwordValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setPasswordValue(event.target.value);
        }}
      />
      {errMsg && (
        <Alert severity="error" variant={"filled"}>
          {errMsg}
        </Alert>
      )}
      <Button variant={"contained"} onClick={handle_loginBtn}>
        {loading ? <CircularProgress color={"secondary"} /> : "Login"}
      </Button>
      <Button
        variant={"contained"}
        onClick={() => props.setPageContent("register")}
      >
        Register
      </Button>
    </>
  );
}

type PageContentProps = {
  setPageContent: (pageContent: "login" | "register") => void;
};

export default function Page() {
  const [pageContent, setPageContent] = useState<"login" | "register">("login");

  return (
    <Container maxWidth={"sm"}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "grey",
            gap: "1em",
            borderRadius: "1em",
            padding: "1em",
          }}
        >
          {pageContent === "login" ? (
            <Login setPageContent={setPageContent} />
          ) : (
            <Register setPageContent={setPageContent} />
          )}
        </Box>
      </Box>
    </Container>
  );
}
