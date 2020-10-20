import React, { useEffect } from "react";
// import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Backdrop,
  Box,
  Button,
  ButtonBase,
  Grid,
  List,
  ListItem,
  Modal,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";

// url axios
import axios from "axios";
import { URL } from "../../config";
// form
import { useForm } from "react-hook-form";
// framer motion
import { motion } from "framer-motion";
// import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import TaskItem from "./taskItem";
import "../../css/App.css";
// react-alert
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  taskList: {
    width: "100%",
    height: "60vh",
    borderRadius: theme.spacing(4),
    padding: theme.spacing(4, 3, 1, 3),
  },
  createBtn: {
    width: 52,
    height: 52,
    backgroundColor: "#aed581",
    borderRadius: "50%",
    color: "white",
  },
  panel: {
    padding: theme.spacing(4),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  list: {
    overflow: "auto",
    maxHeight: "35vh",
  },
  header: {
    paddingRight: theme.spacing(4),
  },
  // modal
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "40vw",
    height: "20vh",
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2, 4, 3),
    outline: 0,
  },
  inputCard: {
    border: "0px solid",
    borderRadius: "8px",
    backgroundColor: grey[200],
    alignItems: "center",
    width: "100%",
    height: "3rem",
    margin: theme.spacing(0.5, 0, 1.5, 0),
    padding: theme.spacing(1.5),
    outline: "none",
  },
  submit: {
    textTransform: "none",
    width: "40%",
    height: "2.5rem",
    borderRadius: "8px",
    marginTop: theme.spacing(1),
    padding: theme.spacing(0, 6),
    flexGrow: 1,
  },
}));

const MyTabs = withStyles((theme) => ({
  root: {
    borderBottom: "1px solid #f1f2f6",
    maxWidth: 418,
    paddingLeft: theme.spacing(2),
  },
  indicator: {
    backgroundColor: "#aed581",
  },
}))(Tabs);

const MyTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 90,
    fontWeight: theme.typography.fontWeightRegular,
    transition: "easeInOut 0.4s",
    fontSize: 18,
    padding: 0,
    "&:hover": {
      fontSize: "2.2rem",
      color: "#A4C1A1",
      opacity: 1,
      marginBottom: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&$selected": {
      color: "#A4C1A1",
      marginBottom: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#A4C1A1",
    },
  },
  selected: {
    fontSize: "2.2rem",
  },
}))((props) => <Tab disableRipple {...props} />);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div hidden={value !== index} {...other} className={classes.panel}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

// const Fade = React.forwardRef(function Fade(props, ref) {
//     const { in: open, children, onEnter, onExited, ...other } = props;
//     const style = useSpring({
//       from: { opacity: 0 },
//       to: { opacity: 1 },
//       onStart: () => {
//         if (open && onEnter) {
//           onEnter();
//         }
//       },
//       onRest: () => {
//         if (!open && onExited) {
//           onExited();
//         }
//       }
//     });

//     return (
//       <animated.div ref={ref} style={style} {...other}>
//         {children}
//       </animated.div>
//     );
// });

// Fade.propTypes = {
//   children: PropTypes.element,
//   in: PropTypes.bool.isRequired,
//   onEnter: PropTypes.func,
//   onExited: PropTypes.func,
// };

// export const CategoryContext = React.createContext();

export default function TaskList(props) {
  const classes = useStyles();
  const cid = props.cid;
  const alert = useAlert();

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [taskArr, setTaskArr] = React.useState([]);
  const [inProcess, setInProcess] = React.useState([]);
  const [done, setDone] = React.useState([]);
  const [taskDescription, setTaskDescription] = React.useState("");

  const fetchTasks = async () => {
    const res = await axios.post(
      URL + "getTasksByCategoryId?category_id=" + cid
    );
    console.log(res.data);
    const arr = splitTaskByStatus(res.data);
    console.log(arr);
    setTaskArr(res.data.reverse());
    setInProcess(arr.inProcess);
    setDone(arr.done);
  };

  const splitTaskByStatus = (arr) => {
    const arr1 = []; // In process
    const arr2 = []; // Done
    arr.forEach((ele) => {
      if (ele.status) {
        arr2.push(ele);
      } else {
        arr1.push(ele);
      }
    });
    return { inProcess: arr1, done: arr2 };
  };

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    setTaskDescription(data.content);
    const res = await axios.post(
      URL + "addNewTask?description=" + data.content + "&category_id=" + cid
    );
    console.log(res);
    fetchTasks();
    alert.success("Task added!");
    handleClose();
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [taskDescription]);

  return (
    <React.Fragment>
      <div className={`taskList-bgcolor ${classes.taskList}`}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Grid item>
            <MyTabs value={value} onChange={handleChange}>
              <MyTab label="All"></MyTab>
              <MyTab label="In progress"></MyTab>
              <MyTab label="Done"></MyTab>
            </MyTabs>
          </Grid>
          <Grid item>
            <motion.div
              whileHover={{
                rotate: [0, 0, 360, 360, 0],
              }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
              }}
            >
              <ButtonBase
                variant="contained"
                color="primary"
                className={classes.createBtn}
                onClick={handleOpen}
              >
                <AddIcon fontSize="large" />
              </ButtonBase>
            </motion.div>
            <Modal
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <div className={classes.paper}>
                <Typography variant="h4" component="div">
                  <Box fontWeight="600">Add New Task</Box>
                </Typography>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <input
                        name="content"
                        ref={register({ required: true })}
                        className={classes.inputCard}
                        placeholder="Task"
                      />
                      {errors.username && (
                        <Typography
                          variant="caption"
                          component="p"
                          color="error"
                          style={{ marginBottom: "4px" }}
                        >
                          This field is required
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        disableElevation
                        className={`btn-grad ${classes.submit}`}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Modal>
          </Grid>
        </Grid>
        <TabPanel value={value} index={0}>
          <List className={classes.list}>
            {taskArr ? (
              taskArr.length != 0 ? (
                taskArr.map((item) => {
                  return (
                    <ListItem key={item.taskId}>
                      <TaskItem taskInfo={item} fetchData={fetchTasks} />
                    </ListItem>
                  );
                })
              ) : (
                <div>Create new todos</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </List>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <List className={classes.list}>
            {inProcess ? (
              inProcess.length != 0 ? (
                inProcess.map((item) => {
                  return (
                    <ListItem key={item.taskId}>
                      <TaskItem taskInfo={item} fetchData={fetchTasks} />
                    </ListItem>
                  );
                })
              ) : (
                <div>Create new todos</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </List>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <List className={classes.list}>
            {done ? (
              done.length != 0 ? (
                done.map((item) => {
                  return (
                    <ListItem key={item.taskId}>
                      <TaskItem taskInfo={item} fetchData={fetchTasks} />
                    </ListItem>
                  );
                })
              ) : (
                <div>All Done, Great!</div>
              )
            ) : (
              <div>Loading...</div>
            )}
          </List>
        </TabPanel>
      </div>
    </React.Fragment>
  );
}
