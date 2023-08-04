import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  push,
  update,
  remove,
} from "firebase/database";

import { useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Snackbar from "@mui/material/Snackbar";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

function Dashboard() {
  const navigate = useNavigate();
  const db = getDatabase();
  const dbRef = ref(db);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectCategory, setSelectCategory] = useState({});
  const [editCategory, setEditCategory] = useState("");
  const [subcategory, setSubcategory] = useState({
    title: "",
    username: "",
    password: "",
    otherDetails: "",
    date: "",
    key: "",
  });
  const [subcategories, setSubcategories] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [editSubCategory, setEditSubCategory] = useState("");

  const handleLogOut = () => {
    signOut(auth)
      .then(async () => {
        await handleNotification(true, "success", "Success");
        await navigate("/");
      })
      .catch(() => {
        handleNotification(true, "error", "Something went wrong");
      });
  };

  const handleNotification = (open, msgType, msg) => {
    setNotification((prev) => ({
      ...prev,
      open: open,
      message: <Alert severity={msgType}>{msg}</Alert>,
    }));
  };

  const handleAddModal = (modalOpen, edit, editType = "") => {
    if (edit !== undefined && Object.keys(edit).length > 0 && modalOpen) {
      if (editType === "category") {
        setEditCategory(edit.id);
        handleCategorySelect(edit);
        setNewCategory(edit.name);
      } else {
        setEditSubCategory(edit.key);
        setSubcategory({
          title: edit.title,
          username: edit.username,
          password: edit.password,
          otherDetails: edit.otherDetails,
          date: edit.date,
          key: edit.key,
        });
      }
    } else {
      if (editType === "category") {
        setNewCategory("");
        setEditCategory("");
        setSelectCategory("");
      } else {
        setSubcategory({
          title: "",
          username: "",
          password: "",
          otherDetails: "",
          date: "",
          key: "",
        });
        setEditSubCategory("");
      }
    }
    setAddModalOpen(modalOpen);
  };

  const handleSubmitCategory = async () => {
    if (newCategory === "") {
      setErrorMsg("Please Fill Category Name.");
      return;
    } else {
      setErrorMsg("");
      if (editCategory === "") {
        const id = Math.floor(Math.random() * 1000);
        await set(ref(db, auth.currentUser.uid + "/Category/" + id), {
          id: id,
          name: newCategory,
          date: new Date().toLocaleDateString("en-GB"),
        });
        handleNotification(true, "success", "Success");
      } else {
        update(
          ref(db, auth.currentUser.uid + "/Category/" + selectCategory.id),
          { ...selectCategory, name: newCategory }
        )
          .then(() => {
            handleNotification(true, "success", "Success");
          })
          .catch((error) => {
            handleNotification(true, "error", "Something went wrong");
          });
        setEditCategory("");
        setSelectCategory("");
      }
      setNewCategory("");
      setAddModalOpen(false);
      handleDisplayCategory();
    }
  };

  const handleCategorySelect = (data) => {
    setSelectCategory(data);
    setSubcategories(
      "subcategory" in data ? Object.values(data?.subcategory) : []
    );
  };

  const handleDeleteCategory = (id) => {
    get(child(dbRef, auth.currentUser.uid + "/Category/" + id))
      .then((snapshot) => {
        if (snapshot.exists()) {
          if ("subcategory" in snapshot.val()) {
            handleNotification(
              true,
              "error",
              "Please Remove all subcategories of this category"
            );
          } else {
            remove(ref(db, auth.currentUser.uid + "/Category/" + id))
              .then(() => {
                handleNotification(true, "success", "Success");
                handleDisplayCategory();
              })
              .catch(() => {
                handleNotification(true, "error", "Something went wrong");
              });
          }
        } else {
          handleNotification(true, "error", "Something went wrong");
        }
      })
      .catch(() => {
        handleNotification(true, "error", "Something went wrong");
      });
  };

  const handleSubmitSubcategory = async (id) => {
    const { title, username, password } = subcategory;

    if (title === "" || username === "" || password === "") {
      setErrorMsg("Please Fill All Fields.");
      return;
    } else {
      setErrorMsg("");
      let success = false;
      if (editSubCategory === "") {
        const newKey = push(child(ref(db), "posts")).key;
        const newSubcategory = {
          ...subcategory,
          date: new Date().toLocaleDateString("en-GB"),
          key: newKey,
        };
        await set(
          ref(
            db,
            auth.currentUser.uid + "/Category/" + id + "/subcategory/" + newKey
          ),
          newSubcategory
        )
          .then(() => {
            success = true;
          })
          .catch(() => {
            handleNotification(true, "error", "Something went wrong 1");
          });
      } else {
        const newSubcategory = {
          ...subcategory,
          date: new Date().toLocaleDateString("en-GB"),
        };
        await update(
          ref(
            db,
            auth.currentUser.uid +
              "/Category/" +
              id +
              "/subcategory/" +
              subcategory.key
          ),
          newSubcategory
        )
          .then(() => {
            success = true;
          })
          .catch(() => {
            handleNotification(true, "error", "Something went wrong 2");
          });
      }
      if (success === true) {
        get(child(dbRef, auth.currentUser.uid + "/Category/" + id))
          .then((snapshot) => {
            if (snapshot.exists()) {
              setSubcategories(
                "subcategory" in snapshot.val()
                  ? Object.values(snapshot.val()?.subcategory)
                  : []
              );
              handleNotification(true, "success", "Success");
            } else {
              handleNotification(true, "error", "Something went wrong 3");
            }
          })
          .catch(() => {
            handleNotification(true, "error", "Something went wrong 4");
          });
        setSubcategory({
          title: "",
          username: "",
          password: "",
          otherDetails: "",
          date: "",
          key: "",
        });
        setAddModalOpen(false);
      } else {
        handleNotification(true, "error", "Something went wrong 5");
      }
    }
  };

  const handleSubCategorySelect = (data) => {
    handleDetailsModal(true);
    setDetails(data);
  };

  const handleDetailsModal = (modalOpen) => {
    setDetailsModalOpen(modalOpen);
  };

  const getSubcategoryData = (e) => {
    setSubcategory({ ...subcategory, [e.target.name]: e.target.value });
  };

  const handleDeleteSubCategory = (id) => {
    remove(
      ref(
        db,
        auth.currentUser.uid +
          "/Category/" +
          selectCategory.id +
          "/subcategory/" +
          id
      )
    )
      .then(() => {
        handleNotification(true, "success", "Success");
        get(child(dbRef, auth.currentUser.uid + "/Category/" + id))
          .then((snapshot) => {
            if (snapshot.exists()) {
              setSubcategories(
                "subcategory" in snapshot.val()
                  ? Object.values(snapshot.val()?.subcategory)
                  : []
              );
            } else {
              setSubcategories([]);
            }
          })
          .catch(() => {
            handleNotification(true, "error", "Something went wrong");
          });
      })
      .catch(() => {
        handleNotification(true, "error", "Something went wrong");
      });
  };

  const handleDisplayCategory = () => {
    get(child(dbRef, auth?.currentUser?.uid + "/Category/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setData(Object.values(snapshot.val()));
        } else {
          handleNotification(true, "error", "No data Available");
        }
      })
      .catch(() => {
        handleNotification(true, "error", "Something went wrong");
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user?.displayName);
        setUserId(user?.uid);
        navigate("/dashboard");
      } else {
        setUserName("");
        setUserId("");
        navigate("/");
      }
    });
    if (userId !== "") {
      handleDisplayCategory();
    }
  }, [userId]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={notification.open}
        autoHideDuration={2000}
        onClose={() => handleNotification(false, "")}
        TransitionComponent="down"
        key={"down"}
      >
        <h4>{notification.message}</h4>
      </Snackbar>
      <Modal
        open={addModalOpen}
        onClose={() => handleAddModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
            padding: 20,
            borderRadius: 10,
          }}
        >
          <div>
            <Grid align={"center"}>
              <h2>
                {Object.keys(selectCategory).length > 0 && editCategory === ""
                  ? "Add Details " + selectCategory.name
                  : editCategory === ""
                  ? "New Category"
                  : "Edit Category"}
              </h2>
            </Grid>
            {Object.keys(selectCategory).length > 0 && editCategory === "" ? (
              <>
                <TextField
                  style={{ margin: "10px 0px" }}
                  label={"Title"}
                  placeholder={"Enter title"}
                  name="title"
                  onChange={getSubcategoryData}
                  value={subcategory.title}
                  fullWidth
                  required
                />
                <TextField
                  style={{ margin: "10px 0px" }}
                  label={"User Name"}
                  placeholder={"Enter username"}
                  name="username"
                  onChange={getSubcategoryData}
                  value={subcategory.username}
                  fullWidth
                  required
                />
                <TextField
                  style={{ margin: "10px 0px" }}
                  label={"password"}
                  placeholder={"Enter password"}
                  name="password"
                  onChange={getSubcategoryData}
                  value={subcategory.password}
                  fullWidth
                  required
                />
                <TextField
                  style={{ margin: "10px 0px" }}
                  label={"Other Details"}
                  placeholder={"Enter other details"}
                  name="otherDetails"
                  onChange={getSubcategoryData}
                  value={subcategory.otherDetails}
                  fullWidth
                  multiline
                  rows={4}
                />
              </>
            ) : (
              <>
                <TextField
                  style={{ margin: "10px 0px" }}
                  label={"Category Name"}
                  placeholder={"Enter category"}
                  name="category"
                  onChange={(e) => setNewCategory(e.target.value)}
                  value={newCategory}
                  fullWidth
                  required
                />
              </>
            )}
            <p style={{ color: "red", fontWeight: "600" }}>{errorMsg}</p>
            <div style={{ justifyContent: "space-evenly", display: "flex" }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  Object.keys(selectCategory).length > 0 && editCategory === ""
                    ? handleSubmitSubcategory(selectCategory.id)
                    : handleSubmitCategory()
                }
              >
                Submit
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={detailsModalOpen}
        onClose={() => handleDetailsModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/*<Box*/}
        {/*  style={{*/}
        {/*    position: "absolute",*/}
        {/*    top: "50%",*/}
        {/*    left: "50%",*/}
        {/*    transform: "translate(-50%, -50%)",*/}
        {/*    width: 200,*/}
        {/*    backgroundColor: "white",*/}
        {/*    boxShadow: 24,*/}
        {/*    p: 4,*/}
        {/*    padding: 20,*/}
        {/*    borderRadius: 10,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div>*/}
        {/*<div*/}
        {/*  style={{*/}
        {/*    justifyContent: "space-evenly",*/}
        {/*    display: "flex",*/}
        {/*    paddingTop: 25,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    variant="contained"*/}
        {/*    color="error"*/}
        {/*    onClick={() => handleDetailsModal(false)}*/}
        {/*  >*/}
        {/*    Close*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <Card
          sx={{
            maxWidth: 400,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            backgroundColor: "white",
            boxShadow: 24,
            // p: 4,
            // padding: 20,
            // borderRadius: 10,
          }}
        >
          <CardHeader
            action={
              <IconButton
                aria-label="settings"
                onClick={() => handleDetailsModal(false)}
              >
                <CloseIcon />
              </IconButton>
            }
            title={details.title}
          />
          <Divider />
          <CardContent
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <p style={{ color: "#212121", margin: "unset" }}>Username : </p>
              <span style={{ color: "#808080", fontSize: "medium" }}>
                {details.username}
              </span>
            </div>
            <div>
              <p style={{ color: "#212121", margin: "unset" }}>Password : </p>
              <span style={{ color: "#808080", fontSize: "medium" }}>
                {details.password}
              </span>
            </div>
            <div>
              <p style={{ color: "#212121", margin: "unset" }}>
                Other Details :{" "}
              </p>
              <span style={{ color: "#808080", fontSize: "medium" }}>
                {details.otherDetails}
              </span>
            </div>
          </CardContent>
          <Divider />
          <CardActions disableSpacing>
            <span style={{ color: "#212121" }}>Last Updated : </span>
            <span
              style={{ color: "#808080", fontSize: "smaller", paddingLeft: 5 }}
            >
              {details.date}
            </span>
          </CardActions>
        </Card>

        {/*<div style={{ overflow: "auto", maxHeight: 500 }}>*/}
        {/*  <div>*/}
        {/*    <Tooltip title="Delete">*/}
        {/*      <Button*/}
        {/*        color="inherit"*/}
        {/*        style={{*/}
        {/*          color: "#636060",*/}
        {/*          borderRadius: 20,*/}
        {/*          minWidth: "unset",*/}
        {/*        }}*/}
        {/*        onClick={() => handleDetailsModal(false)}*/}
        {/*      >*/}
        {/*        <CloseIcon />*/}
        {/*      </Button>*/}
        {/*    </Tooltip>*/}
        {/*  </div>*/}
        {/*<table style={{ width: "100%", paddingLeft: 50 }}>*/}
        {/*{details &&*/}
        {/*  Object.keys(details)?.map((item, i) => {*/}
        {/*    let name = "";*/}
        {/*    if (i === 1) {*/}
        {/*      name = "username";*/}
        {/*    } else if (i === 2) {*/}
        {/*      name = "password";*/}
        {/*    } else if (i === 3) {*/}
        {/*      name = "date";*/}
        {/*    } else if (i === 4) {*/}
        {/*      name = "otherDetails";*/}
        {/*    } else if (i === 5) {*/}
        {/*      name = "";*/}
        {/*    } else {*/}
        {/*      name = "title";*/}
        {/*    }*/}

        {/*    if (name !== "") {*/}
        {/*      return (*/}
        {/*        <div style={{ margin: "10px 0px" }}>*/}
        {/*          <h4*/}
        {/*            style={{*/}
        {/*              textTransform: "capitalize",*/}
        {/*              margin: "unset",*/}
        {/*              textDecoration: "underline",*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            {name} :*/}
        {/*          </h4>*/}
        {/*          <h5 style={{ margin: "unset", color: "#636060" }}>*/}
        {/*            {details[name]}*/}
        {/*          </h5>*/}
        {/*        </div>*/}
        {/*      );*/}
        {/*      // <tr>*/}
        {/*      //   <td style={{ textTransform: "capitalize" }}>*/}
        {/*      //     {name}*/}
        {/*      //   </td>*/}
        {/*      //   <td style={{ padding: 10 }}>:</td>*/}
        {/*      //   <td style={{ overflowWrap: "anywhere", padding: 10 }}>*/}
        {/*      //     {details[name]}*/}
        {/*      //   </td>*/}
        {/*      // </tr>*/}
        {/*    }*/}
        {/*  })}*/}
        {/*</table>*/}
        {/*</div>*/}
        {/*  </div>*/}
        {/*</Box>*/}
      </Modal>
      <AppBar
        position="static"
        style={{ background: "#fff", color: "#636060" }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AccountCircleIcon />
            <span style={{ fontWeight: 700, marginLeft: 5 }}>
              Hello {userName}
            </span>
          </div>
          <Tooltip title="LogOut">
            <Button color="inherit" onClick={handleLogOut}>
              <PowerSettingsNewIcon />
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <>
        <div
          style={
            Object.keys(selectCategory).length > 0 && editCategory === ""
              ? {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }
              : {}
          }
        >
          {Object.keys(selectCategory).length > 0 && editCategory === "" ? (
            <div
              style={{
                textAlignLast: "start",
                margin: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={(e) => handleCategorySelect({})}
              >
                <ArrowBackIcon
                  style={{
                    margin: 2,
                    padding: 5,
                    border: "2px solid #636060",
                    borderRadius: 10,
                    color: "#636060",
                  }}
                />
              </IconButton>
              <span
                style={{
                  fontWeight: 700,
                  marginLeft: 5,
                  fontSize: "larger",
                  color: "#636060",
                }}
              >
                {selectCategory.name}
              </span>
            </div>
          ) : null}
          <div style={{ textAlignLast: "end", margin: 10 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => handleAddModal(true)}
            >
              <AddIcon
                style={{
                  margin: 2,
                  padding: 5,
                  border: "2px solid #636060",
                  borderRadius: 10,
                  color: "#636060",
                }}
              />
            </IconButton>
          </div>
        </div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          style={{ padding: 20 }}
        >
          {Object.keys(selectCategory).length > 0 && editCategory === ""
            ? subcategories?.length > 0
              ? subcategories?.map((subcat, i) => (
                  <Grid item xs={12} sm={4} md={3} key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: -40,
                      }}
                    >
                      <Tooltip title="Edit">
                        <Button
                          color="inherit"
                          style={{
                            color: "#fff",
                            backgroundColor: "#636060",
                            borderRadius: 20,
                            minWidth: "unset",
                          }}
                          onClick={() => handleAddModal(true, subcat, "sub")}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Button
                          color="inherit"
                          style={{
                            color: "#fff",
                            backgroundColor: "#636060",
                            borderRadius: 20,
                            minWidth: "unset",
                          }}
                          onClick={() => handleDeleteSubCategory(subcat.key)}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </Tooltip>
                    </div>
                    <Card
                      style={{
                        padding: 16,
                        textAlign: "center",
                        color: "#fff",
                        cursor: "pointer",
                        backgroundColor: "#636060",
                      }}
                      onClick={() => handleSubCategorySelect(subcat)}
                    >
                      <h3>{subcat.title}</h3>
                    </Card>
                  </Grid>
                ))
              : null
            : data?.length > 0
            ? data?.map((categories, i) => (
                <Grid item xs={12} sm={4} md={3} key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: -40,
                    }}
                  >
                    <Tooltip title="Edit">
                      <Button
                        color="inherit"
                        style={{
                          color: "#636060",
                          borderRadius: 20,
                          minWidth: "unset",
                        }}
                        onClick={() =>
                          handleAddModal(true, categories, "category")
                        }
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        color="inherit"
                        style={{
                          color: "#636060",
                          borderRadius: 20,
                          minWidth: "unset",
                        }}
                        onClick={() => handleDeleteCategory(categories.id)}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </Tooltip>
                  </div>
                  <Card
                    style={{
                      padding: 16,
                      textAlign: "center",
                      color: "#636060",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCategorySelect(categories)}
                  >
                    <h3>{categories.name}</h3>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>
      </>
    </Box>
  );
}

export default Dashboard;
