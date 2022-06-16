import "./App.css";

import useWindowDimensions from "./utils/windowDimension";

import Dialog from "./Dialog";
import { useEffect, useState } from "react";

const Notice = () => {
  const { width } = useWindowDimensions();

  const show = JSON.parse(localStorage.getItem("notice"));

  const [open, setOpen] = useState(show === true ? false : true);
  const [checked, setChecked] = useState(false);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("notice", checked);
  };

  useEffect(() => {}, [show]);

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Dialog
        title="Notice"
        className="w-4/5"
        open={open}
        onClose={() => handleClose()}
        body={
          <>
            {width < 769 ? (
              <>
                This is an PWA app that works offline too once added to Home
                Screen
              </>
            ) : (
              <>
                This is an PWA app that works offline too once installed.
                Optimized for mobile view
              </>
            )}
            <div className="mt-4">
              <input
                type="checkbox"
                value={checked}
                onChange={handleChecked}
                id="checked"
              />
              <label className="ml-2" htmlFor="checked">
                Do not show this again
              </label>
            </div>
          </>
        }
      />
    </>
  );
};

export default Notice;
