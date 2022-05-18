import "./App.css";
import { useEffect, useState } from "react";
import {
  FaSave,
  FaTrash,
  FaAngleRight,
  FaAngleLeft,
  FaPlus,
  FaMinusCircle,
  FaArrowsAlt,
  FaTimesCircle,
} from "react-icons/fa";
import Dialog from "./Dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useWindowDimensions from "./utils/windowDimension";
import MobileView from "./Mobile";
import WebView from "./Web";

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable as arrayMove } from "array-move";

const DragHandle = SortableHandle(() => (
  <span className="hover:shadow-lg ease-in-out cursor-move">
    <FaArrowsAlt className="text-2xl" />
  </span>
));

const SortableItem = SortableElement(({ value, listIndex, currentIndex }) => (
  <div
    className={`mt-2 border-solid  border-b-2 border-l-2 p-2 ${
      listIndex === currentIndex
        ? "border-blue-600 border-t-2"
        : "border-gray-300"
    } `}
  >
    {value}
  </div>
));

const SortableList = SortableContainer(
  ({
    items,
    handleSingleDay,
    handleRemoveWorkout,
    currentIndex,
    setChosenDay,
  }) => {
    return (
      <div className="">
        {items.map((each, index) => (
          <SortableItem
            key={index}
            index={index}
            currentIndex={currentIndex}
            listIndex={index}
            value={
              <div
                className="mt-2 grid grid-cols-3 gap-4"
                onClick={() => setChosenDay(index)}
              >
                <div className="ml-4 z-10">
                  <DragHandle />
                </div>
                <div className="">
                  <input
                    className=" inputbox"
                    placeholder="Day"
                    onChange={handleSingleDay(index, "day")}
                    value={each.day}
                  />
                </div>
                <button className="text-red-500 flex justify-end mt-1 mr-2">
                  <FaMinusCircle onClick={() => handleRemoveWorkout(index)} />
                </button>
              </div>
            }
          />
        ))}
      </div>
    );
  }
);

const App = () => {
  const { width } = useWindowDimensions();

  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [chosenWeek, setChosenWeek] = useState("");
  const [open, setOpen] = useState(false);
  const [chosenDay, setChosenDay] = useState(0);
  const [manageDays, setManageDays] = useState(false);

  const singleDay = { day: "", parts: "", excercises: [] };
  const singleExercise = {
    name: "",
    sets: [
      { rep: 12, weight: "", difficulty: "" },
      { rep: 10, weight: "", difficulty: "" },
      { rep: 8, weight: "", difficulty: "" },
    ],
    notes: "",
  };

  useEffect(() => {
    const startingVals = JSON.parse(localStorage.getItem("weeks"));
    if (startingVals) {
      const lastIndex = startingVals.length - 1;
      setWeeks(startingVals);
      setChosenWeek(lastIndex);
      setDays(startingVals[lastIndex]);
    }
  }, []);

  const handleShow = () => {
    setOpen(true);
  };

  const handleHide = () => {
    setOpen(false);
  };

  const handleShowManage = () => {
    setManageDays(true);
  };

  const handleHideManage = () => {
    setManageDays(false);
  };

  const handleAddWeek = (copy) => {
    let tempDays = [
      { day: "Sunday", parts: "", excercises: [] },
      { day: "Monday", parts: "", excercises: [] },
      { day: "Tuesday", parts: "", excercises: [] },
      { day: "Wednesday", parts: "", excercises: [] },
      { day: "Thursday", parts: "", excercises: [] },
      { day: "Friday", parts: "", excercises: [] },
      { day: "Saturday", parts: "", excercises: [] },
    ];
    const tempWeeks = [...weeks];
    if (copy) {
      const lastWeek = tempWeeks[tempWeeks.length - 1];
      for (let index = 0; index < lastWeek.length; index++) {
        const element = lastWeek[index];
        tempDays[index].day = element.day;
        tempDays[index].parts = element.parts;
        let tempExercise = [];
        for (let index2 = 0; index2 < element.excercises.length; index2++) {
          const element2 = element.excercises[index2];
          const newExercise = {
            name: element2.name,
            sets: element2.sets.map((each) => {
              return {
                rep: each.rep,
                weight: each.weight,
                difficulty: each.difficulty,
              };
            }),
            notes: "",
          };
          tempExercise.push(newExercise);
        }
        tempDays[index].excercises = tempExercise;
      }
    }
    tempWeeks.push(tempDays);
    setWeeks(tempWeeks);
    handleHide();
  };

  const handleWeekChoose = (event) => {
    setChosenWeek(event.target.value);
    setDays(weeks[event.target.value]);
  };

  const handleAddWorkout = () => {
    const tempDays = [...days];
    tempDays.push(singleDay);
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
  };

  const handleRemoveWorkout = (index) => {
    const tempDays = [...days];
    tempDays.splice(index, 1);
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
  };

  const handleClearWorkout = () => {
    const tempDays = [...days];
    tempDays[chosenDay] = { ...tempDays[chosenDay], exercises: [] };
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
  };

  const handleSingleDay = (index, name) => (event) => {
    const tempDays = [...days];
    tempDays[index][name] = event.target.value;
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
  };

  const handleSingleDayArray = (index, name, value) => {
    const tempDays = [...days];
    tempDays[index][name] = value;
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
  };

  const handleSingleExercise = (index, eIndex, name) => (event) => {
    let tempExercise = [...days[index].excercises];
    tempExercise[eIndex][name] = event.target.value;
    handleSingleDayArray(index, "excercises", tempExercise);
  };

  const handleSingleExerciseArray = (index, eIndex, name, value) => {
    let tempExercise = [...days[index].excercises];
    tempExercise[eIndex][name] = value;
    handleSingleDayArray(index, "excercises", tempExercise);
  };

  const handleSingleSet = (index, eIndex, sIndex, name) => (event) => {
    let tempSet = [...days[index].excercises[eIndex].sets];
    tempSet[sIndex][name] = event.target.value;
    handleSingleExerciseArray(index, eIndex, "sets", tempSet);
  };

  const handleAddExercise = (index) => {
    const tempDays = [...days];
    tempDays[index].excercises.push(singleExercise);
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
    setUpdated(!updated);
  };

  const handleAddSet = (index, eIndex) => {
    const tempDays = [...days];
    tempDays[index].excercises[eIndex].sets.push({
      rep: 8,
      weight: "",
      difficulty: "",
    });
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
    setUpdated(!updated);
  };

  const handleRemoveSet = (index, eIndex, sIndex) => {
    let tempSet = [...days[index].excercises[eIndex].sets];
    tempSet.splice(sIndex, 1);
    console.log(tempSet);
    handleSingleExerciseArray(index, eIndex, "sets", tempSet);
  };

  const handleDeleteExercise = (index, eIndex) => {
    const tempDays = [...days];
    tempDays[index].excercises.splice(eIndex, 1);
    setDays(tempDays);
    const tempWeeks = [...weeks];
    tempWeeks[chosenWeek] = tempDays;
    setWeeks(tempWeeks);
    setUpdated(!updated);
  };

  const handleSave = () => {
    localStorage.setItem("weeks", JSON.stringify(weeks));
    toast("Saved");
    // console.log("saved");
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const newImage = arrayMove(days, oldIndex, newIndex);
    setDays(newImage);
  };

  const difficultyOptions = ["easy", "medium", "hard"];

  return (
    <>
      {width < 769 ? <MobileView /> : <WebView />}

      <div id="modal-root" />
      <ToastContainer position="top-center" theme="dark" autoClose={1000} />
    </>
  );
};

export default App;
