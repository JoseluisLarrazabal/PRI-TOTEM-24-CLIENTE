import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./formStyle.css";
import { deletePublicidades } from "../../../components/redux/publicidadSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import connectionString from "../../../components/connections/connection";

const Form = ({ CloseMod }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [files, setFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const totem = useSelector((state) => state.totem);

  const dropzoneRef = useRef();
  const inputRef = useRef(null);
  const totemId = totem.idTotem;

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("FechaInicio", startDate.toISOString());
    formData.append("FechaFin", endDate.toISOString());
    formData.append("Imagen", files);
    formData.append("IdTotem", totemId);
    axios
      .post(connectionString + "/Publicidad", formData)
      .then((response) => {
        console.log(response);
        dispatch(deletePublicidades());
        // navigate("/Publicidad/:"+totemId);
        CloseMod();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function handleDropzoneClick() {
    // Abre el explorador de archivos cuando el usuario hace clic en el dropzone
    inputRef.current.click();
  }
  //evento de subida de imagen
  function handleImageUpload(event) {
    const file = event.target.files[0];
    setFiles(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  }
  //eventos de dropzone
  function handleDropzoneHover(event) {
    event.preventDefault();
    dropzoneRef.current.style.cursor = "pointer";
  }
  function handleDropzoneHoverOut(event) {
    event.preventDefault();
    dropzoneRef.current.style.cursor = "initial";
  }

  return (
    <div className="form-container">
      <div className="form-group">
        <label>Fecha de inicio</label>
        <br />
        <DatePicker
          selected={startDate}
          minDate={new Date()}
          onChange={(date) => setStartDate(date)}
        />
      </div>

      <div className="form-group">
        <label>Fecha de fin</label>
        <br />
        <DatePicker
          selected={endDate}
          minDate={new Date()}
          onChange={(date) => setEndDate(date)} />
      </div>

      <div className="form-group">
        <label>Archivos</label>
        <br />
        <div
          className="dropzone"
          ref={dropzoneRef}
          onClick={handleDropzoneClick}
          onDrop={handleImageUpload}
          onDragOver={handleDropzoneHover}
          onDragLeave={handleDropzoneHoverOut}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={inputRef}
            style={{ display: "none" }}
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "250px", height: "400px" }}
            />
          ) : (
            <p>Arrastra una imagen aquí o haz clic para seleccionar una.</p>
          )}
        </div>
      </div>
      <button type="submit" onClick={handleSubmit}>Enviar</button>
    </div>
  );
};

export default Form;