/**
 *
 * Dialog
 *
 */

import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import "./dialog.css";
import Modal from "../Modal";

function useComponentVisible(initialIsVisible, setShowList) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    // uses ref to check if outside of Div is clicked
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
      if (setShowList === undefined) {
        console.log("!! onClose function not passed to dialog component. !!");
      } else {
        setShowList(false);
      }
    }
  };

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setShowList(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}

const Dialog = ({ open, onClose, className, title, body, actions }) => {
  useComponentVisible(open, onClose);

  const dialogHeight = { maxHeight: "calc(100vh - 100px)" };

  const children = (
    <>
      <div
        className="w-screen h-screen z-40 fixed top-0 left-0 bg-black bg-opacity-25 overflow-auto"
        onClick={onClose}
      />
      <div
        className={`fixed left-2/4 top-2/4 z-50 shadow-lg transform -translate-x-2/4 -translate-y-2/4 rounded-lg bg-white slide-dialog ${
          className && className !== "" ? className : "max-w-xl"
        } `}
      >
        {title !== undefined && (
          <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-gray-900 rounded-tl-lg rounded-tr-lg">
            <h3 className="m-0 text-xl text-white">{title}</h3>
            <button
              type="button"
              className="text-white opacity-75 hover:opacity-100 text-xl"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
        )}
        {body !== undefined && (
          <div style={dialogHeight} className="overflow-auto p-4 back-color">
            {body}
          </div>
        )}
        {actions !== undefined && (
          <div className="border-t p-2 flex justify-end back-color">
            {actions}
          </div>
        )}
      </div>
    </>
  );

  return open ? <Modal>{children}</Modal> : null;
};

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  title: PropTypes.any,
  body: PropTypes.any,
  actions: PropTypes.any,
};

export default Dialog;
