import React from "react";
import "./sidebar.css";
/*import icons */
import { MdEditLocationAlt, MdFileOpen } from "react-icons/md";
import { HiTemplate, HiHome } from "react-icons/hi";
import { MdContactMail } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { Fragment, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}



const Sidebar = () => {
  const totem = useSelector((state) => state.totem);
  const navigate = useNavigate();

  const navegation = [
    /* {
      name: "Datos del Totem",
      current: false,
      icon: HiHome,
      path: `/TotemEdit/:${totem.idTotem}`,
    }, */

    
    
    {
      name: "Panel Totems",
      current: false,
      icon: HiHome,
      path: `/Panel`,
    },
    {
      name: "Locaciones",
      current: false,
      icon: MdEditLocationAlt,
      path: `/ListaLocaciones/:${totem === null ? 0 : totem.idTotem}`,
    },

    {
      name: "Ubicaciones",
      current: false,
      icon: MdEditLocationAlt,
      path: "/Ubicaciones", // Ruta directa a la página de Ubicaciones
    },

    
    {
      name: "Plantillas",
      current: false,
      icon: HiTemplate,
      path: "/Plantillas",
    },
    {
      name: "Publicidad",
      current: false,
      icon: MdContactMail,
      path: `/Publicidad/:${totem === null ? 0 : totem.idTotem}`,
    },
    {
      name: "Archivos",
      current: false,
      icon: MdFileOpen,
      path: `/ArchivosTotem/:${totem === null ? 0 : totem.idTotem}`
    },
    {
      name: "Editar Información",
      current: false,
      icon: HiTemplate,
      path: `/TotemEdit/:${totem === null ? 0 : totem.idTotem}`,
    },
    /* {
      name: "Admins",
      current: false,
      icon: MdContactMail,
      path: "/AdminForm",
    },
    {
      name: "Totems",
      current: false,
      icon: HiTemplate,
      path: "/TotemForm",
    }, */
  ];

  const location = useLocation();

  // Verifica si la ruta actual es "/Login"
  if (
    location.pathname === "/" ||
    location.pathname === "/ForgotPassword" ||
    location.pathname === "/Panel" ||
    location.pathname === "/Totems" ||
    location.pathname === "/SuperAdminView" ||
    location.pathname === "/TotemNew" ||
    location.pathname === "/TotemAdvertising" ||
    location.pathname === "/Template" ||
    /^\/ChatTotem\/\d+$/.test(location.pathname)
  ) {
    return null; // Retorna null para ocultar el sidebar
  }

  return (
    <div className="sideBar grid">
      {/* <Link to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2209/2209054.png"
            alt=""
            className="Image Name"
            /UserUpdateForm
          />
        </Link> */}
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-6">
        <div>
          <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="sr-only">Open user menu</span>
            <img
              className="h-12 w-12 rounded-full"
              src={
                totem === null
                  ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  : totem.urlLogo
              }
              alt=""
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 translate-x-1/2"
          enterTo="opacity-100 translate-x-0"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 translate-x-0"
          leaveTo="opacity-0 translate-x-1/2"
        >
          <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={() => navigate("/UserUpdateForm")}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  Perfil
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/Login"
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "block px-4 py-2 text-sm text-gray-700"
                  )}
                >
                  Logout
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <div className="menuDiv">
        <h3 className="divTitle">MENU</h3>
        <nav>
          <ul className="menuList grid">
            {navegation.map((item) => (
              <li className="listItem">
                <a
                  onClick={() => navigate(item.path)}
                  className="menuLink cursor-pointer"
                  flex
                >
                  <item.icon className="icon" />
                  <span className="smallText">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sideBardCard">
        <BsQuestionCircle className="icon" />
        <div className="cardContent">
          <div className="circle1"></div>
          <div className="circle2"></div>

          <h3>Help Center</h3>
          <p>Please contact us</p>
          <a href="https://wa.me/59172984846" className="btn">Go to help</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;