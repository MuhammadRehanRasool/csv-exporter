import React, { useState, useEffect } from "react";
import UserData from "../components/UserData";
import { Importer, ImporterField } from "react-csv-importer";
import "react-csv-importer/dist/index.css";
import {
  CONSTANT,
  setMessage,
  resetMessage,
  getDummyData,
} from "./../CONSTANT";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import "./../css/Home.css";
import axios from "axios";

export default function Home() {
  const [processedData, setProcessedData] = useState([]);
  const [output, setOutput] = useState({
    output: "",
    type: "",
    feedback: "",
    isOutput: false,
  });

  useEffect(() => {}, []);

  const changeProcessedData = (data) => {
    setProcessedData([...data]);
  };

  const sendToBackend = async (type) => {
    setMessage("Please wait...<br/>Computation needs time!", "success");
    resetMessage();
    if (processedData.length < 1) {
      setMessage("Please provide data!", "danger");
    }
    await axios
      .post(CONSTANT.server + "data", {
        raw: processedData,
        user: session.personal.id,
        type: type,
      })
      .then((responce) => {
        if (responce.data.message) {
          setMessage(responce.data.message, "danger");
        } else {
          setOutput({
            ...responce.data,
            output: JSON.parse(responce.data.output),
            isOutput: true,
          });
          setProcessedData([]);
          setMessage("Here is your result", "success");
        }
      })
      .catch((error) => {
        setMessage(error.response.data.detail, "danger");
        console.log(error.response.data.detail);
      });
  };

  let navigate = useNavigate();
  const { session, setSession } = React.useContext(UserData);
  return (
    <div className="__Home">
      {session.isLoggedIn ? (
        !output.isOutput ? (
          <div className="custom-upload">
            <Importer
              chunkSize={10000} // optional, internal parsing chunk size in bytes
              className="custom-upload-box"
              assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
              restartable={false} // optional, lets user choose to upload another file when import is complete
              onStart={({ file, fields }) => {
                // optional, invoked when user has mapped columns and started import
                // console.log(
                //   "starting import of file",
                //   file,
                //   "with fields",
                //   fields
                // );
              }}
              processChunk={async (rows) => {
                // required, receives a list of parsed objects based on defined fields and user column mapping;
                // may be called several times if file is large
                // (if this callback returns a promise, the widget will wait for it before parsing more data)
                console.log("received batch of rows", rows.length);
                changeProcessedData(rows);

                // mock timeout to simulate processing
                await new Promise((resolve) => setTimeout(resolve, 500));
              }}
              onComplete={({ file, fields }) => {
                // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
                // console.log(
                //   "finished import of file",
                //   file,
                //   "with fields",
                //   fields
                // );
              }}
              onClose={() => {
                // optional, invoked when import is done and user clicked "Finish"
                // (if this is not specified, the widget lets the user upload another file)
                console.log("importer dismissed");

                sendToBackend("sumOfMontant"); // Requires a argument (type) so that backend can be configured as per you want
              }}
            >
              <ImporterField name="JournalCode" label="JournalCode" />
              <ImporterField name="JournalLib" label="JournalLib" />
              <ImporterField name="EcritureNum" label="EcritureNum" />
              <ImporterField name="EcritureDate" label="EcritureDate" />
              <ImporterField name="CompteNum" label="CompteNum" />
              <ImporterField name="CompteLib" label="CompteLib" />
              <ImporterField name="CompteAuxNum" label="CompteAuxNum" />
              <ImporterField name="CompteAuxLib" label="CompteAuxLib" />
              <ImporterField name="PieceRef" label="PieceRef" />
              <ImporterField name="PieceDate" label="PieceDate" />
              <ImporterField name="EcritureLib" label="EcritureLib" />
              <ImporterField name="Montant" label="Montant" />
              <ImporterField name="Sens" label="Sens" />
              <ImporterField name="EcritureLet" label="EcritureLet" />
              <ImporterField name="DateLet" label="DateLet" />
              <ImporterField name="ValidDate" label="ValidDate" />
              <ImporterField name="MontantDevise" label="MontantDevise" />
              <ImporterField name="Idevise" label="Idevise" />
              <ImporterField name="CompCode" label="CompCode" optional />
              <ImporterField name="Periode" label="Periode" optional />
            </Importer>
          </div>
        ) : (
          <div className="output">
            <span className="h4 text-muted">{output.feedback}</span>
            <DataTable output={output.output} />
          </div>
        )
      ) : (
        <div>
          <img src="/lock.svg" className="img-fluid mb-3" alt="Lock" />
          <span>Please Login to Compute Data</span>
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
