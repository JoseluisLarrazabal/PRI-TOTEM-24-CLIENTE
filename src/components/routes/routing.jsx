import React from "react";
import "../sidebar_section/sidebar.css";
/*import icons */
import { Routes, Route, redirect, Navigate } from "react-router-dom";
import AdvertisingDisplay from "../../views/Advertising/Adversising_Display";
import PanelTotem from "../../views/Panel/PanelTotem";
import FormLocation from "../../views/Forms/Locacion";
import SeleccionPlantilla from "../../views/Forms/SeleccionPlantilla";
import Login from "../../views/Login/LoginPage";
import ForgotPassword from "../../views/Login/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import SelectTotem from "../../views/TotemsView/SelectTotem";
import Logos from "../../views/Forms/Logos";
import TotemForm from "../../views/Forms/TotemForm";
import { useLocalStorage } from "react-use";
import UserUpdateForm from "../../views/Login/UserUpdateForm";
import TotemEdit from "../../views/Forms/TotemEdit";
import LocacionesTable from "../../views/Forms/ListaLocaciones";
import Locacion from "../../views/Forms/Locacion";
import { useSelector } from "react-redux";
import DisplayTotem from "../../views/TotemTemplates/DisplayTotem";
import SuperAdminView from "../../views/SuperAdmin/SuperAdminView";
import EditLocacion from "../../views/Forms/EditLocaciones";
import TotemAdvertising from "../../views/Advertising/TotemAdvertising";
import ArchivosTotem from "../../views/Forms/ArchivosTotem"
import ChatTotem from "../../views/ChatPDF/ChatTotem"

const Routing = () => {
  const user = useSelector((state) => state.user);
  return (
    <Routes>
      <Route element={<PrivateRoute token={user.token} />}>
        <Route path="/Panel" element={<PanelTotem />} />
        <Route path="/Publicidad/:id" element={<AdvertisingDisplay />} />
        <Route path="/Locaciones" element={<FormLocation />} />
        <Route path="/ListaLocaciones/:id" element={<LocacionesTable />} />
        <Route path="/Plantillas" element={<SeleccionPlantilla />} />
        <Route path="/Logos" element={<Logos />} />
        <Route path="/EditLocacion/:id" element={<EditLocacion />} />
        {/*<Route path="/AdminForm" element={<AdminForm />} />
          <Route path="/TotemForm" element={<TotemForm />} />*/}
        <Route path="/TotemNew" element={<TotemForm />} />
        <Route path="/TotemEdit/:id" element={<TotemEdit />} />
        <Route path="/ArchivosTotem/:id" element={<ArchivosTotem />} />
        <Route path="/Locaciones" element={<FormLocation />} />
        <Route path="/UserUpdateForm" element={<UserUpdateForm />} />
        <Route path="/UserUpdateForm" element={<UserUpdateForm />} />
        <Route path="/SuperAdminView" element={<SuperAdminView />} />

      </Route>

      <Route index element={<Login />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/Totems" element={<SelectTotem />} />
      <Route path="/Template" element={<DisplayTotem />} />
      <Route path="/ChatTotem/:id" element={<ChatTotem />} />
      <Route path="/TotemAdvertising" element={<TotemAdvertising />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Routing;