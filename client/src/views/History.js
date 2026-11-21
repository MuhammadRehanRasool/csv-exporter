import React, { useState, useEffect } from "react";
import UserData from "../components/UserData";
import "react-csv-importer/dist/index.css";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  getDummyData,
  checkLoginFromNonLogin,
} from "./../CONSTANT";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import "./../css/Home.css";
import axios from "axios";

export default function History() {
  let navigate = useNavigate();
  const { session, setSession } = React.useContext(UserData);
  useEffect(() => {
    if (checkLoginFromNonLogin()) {
      navigate("/");
    }
  }, []);

  const [data, setData] = useState([]);

  const [output, setOutput] = useState({
    output: "",
    type: "",
    feedback: "",
    isOutput: false,
  });

  const fetchLogs = async (type) => {
    setMessage("Please wait...<br/>Fetching needs time!", "success");
    resetMessage();
    await axios
      .get(CONSTANT.server + `records/${session.personal.id}`)
      .then((responce) => {
        if (responce.data.message) {
          setMessage(responce.data.message, "danger");
        } else {
          setData([...responce.data]);
        }
      })
      .catch((error) => {
        setMessage(error.response.data.detail, "danger");
        console.log(error.response.data.detail);
      });
  };

  useEffect(() => {
    if (session.personal.id !== "") {
      fetchLogs();
    }
  }, [session]);

  return (
    <div className="__Home">
      {session.isLoggedIn ? (
        !output.isOutput ? (
          <div className="d-lex justify-content-center align-items-center flex-row w-100 px-5 py-5 mt-2 mb-2">
            {data.length > 0
              ? data.map((one, i) => {
                  return (
                    <div className="card" key={one.id}>
                      <div className="card-header">{one.feedback}</div>
                      <div className="card-body">
                        <p className="card-text">
                          Computed At :{" "}
                          {new Date(one.datetime).toLocaleString()}
                        </p>
                        <p className="card-text">Type : {one.type}</p>
                        <a
                          href="#"
                          onClick={() => {
                            setOutput({
                              output: JSON.parse(one.output),
                              type: one.type,
                              feedback: one.feedback,
                              isOutput: true,
                            });
                          }}
                          className="btn btn-primary"
                        >
                          Open DataTable
                        </a>
                      </div>
                    </div>
                  );
                })
              : "No records"}
          </div>
        ) : (
          <div className="output">
            <span className="h4 text-muted">{output.feedback}</span>
            <DataTable output={output.output} />
            <a
              href="#"
              onClick={() => {
                setOutput({
                  output: "",
                  type: "",
                  feedback: "",
                  isOutput: false,
                });
              }}
              className="btn btn-primary mt-2"
            >
              Back To Logs
            </a>
          </div>
        )
      ) : (
        <div>
          <img src="/lock.svg" className="img-fluid mb-3" alt="Lock" />
          <span>Please Login to See Past Records</span>
        </div>
      )}
      <p
        className="text-danger p-0 m-0 mb-2"
        id="error"
        style={{ display: "none" }}
      >
        Error
      </p>
    </div>
  );
}
