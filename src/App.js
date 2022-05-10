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

const SortableItem = SortableElement(({ value }) => (
  <div className="mt-2 border-solid  border-b-2 border-gray-400 border-l-2 p-2">
    {value}
  </div>
));

const SortableList = SortableContainer(
  ({ items, handleSingleDay, handleRemoveWorkout }) => {
    return (
      <div className="">
        {items.map((each, index) => (
          <SortableItem
            key={index}
            index={index}
            value={
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div className="ml-4">
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
                <button
                  className="text-red-500 flex justify-end mt-1 mr-2"
                  onClick={() => handleRemoveWorkout(index)}
                >
                  <FaMinusCircle />
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
      <div className=" px-2">
        <div className="fixed top-0 pt-2 back-color z-10 w-full flex justify-between gap-2 h-14  mb-2 border-b-1 border-b-white">
          <div className="font-bold italic text-2xl">Progress Tracker</div>
          <div className="mr-4">
            <button
              className="p-1 bg-green-600 text-white rounded mt-1 px-2"
              onClick={handleSave}
            >
              <span className="flex flex-wrap gap-2 font-bold">
                <FaSave className="mt-1" /> Save
              </span>
            </button>
          </div>
        </div>
        {manageDays ? (
          <div className="mt-16 w-full">
            <div className="w-full flex justify-between px-2 text-xl">
              <span className="font-bold">Manage Days </span>
              <button onClick={handleHideManage} className="text-red-500">
                <FaTimesCircle />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 font-bold text-lg">
              <div className="ml-4">Order</div>
              <div>Day</div>
            </div>
            <SortableList
              axis="y"
              items={days}
              onSortEnd={onSortEnd}
              useDragHandle
              handleSingleDay={handleSingleDay}
              handleRemoveWorkout={handleRemoveWorkout}
            />
            <div className="back-color border border-gray-200 text-white w-full py-1 flex justify-center rounded-full mt-4">
              <button onClick={handleAddWorkout}>Add Day</button>
            </div>
          </div>
        ) : (
          <>
            {/* main body */}
            <div className="mt-16 w-full flex  gap-2 ">
              <div className="w-1/3">
                <select
                  className="inputbox"
                  value={chosenWeek}
                  onChange={handleWeekChoose}
                >
                  <option value={""}>Choose week</option>
                  {weeks.map((each, index) => (
                    <option value={index}>Week {index + 1}</option>
                  ))}
                </select>
              </div>
              <div className="w-2/3 flex justify-end gap-4 pr-4">
                {weeks.length > 0 ? (
                  <button
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                    onClick={handleShow}
                  >
                    Add Week
                  </button>
                ) : (
                  <button
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                    onClick={() => handleAddWeek(false)}
                  >
                    Add Week
                  </button>
                )}

                <button
                  className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                  onClick={handleAddWorkout}
                >
                  Add Day
                </button>
              </div>
            </div>
            {/* bottom menu */}

            <div className="mt-4">
              {days &&
                days.length > 0 &&
                days.map(
                  (each, index) =>
                    chosenDay === index && (
                      <div
                        className="relative m-auto w-full border-2 border-gray-400  rounded p-2 my-4"
                        key={index}
                      >
                        {/* bottom menu */}

                        <div className="fixed bottom-0 w-full nav-color z-10 flex flex-warp -ml-6">
                          <div className="text-white flex flex-wrap w-fulll text-xl ml-4 mt-4">
                            <FaAngleLeft
                              onClick={() =>
                                index !== 0
                                  ? setChosenDay(chosenDay - 1)
                                  : setChosenDay(days.length - 1)
                              }
                            />
                          </div>
                          <div
                            className="w-1/5 mx-2 ml-8 mt-2 mt-3"
                            onClick={handleShowManage}
                          >
                            {/* <input
                              className="ml-4 titlebox"
                              placeholder="Day"
                              onChange={handleSingleDay(index, "day")}
                              value={each.day}
                            /> */}
                            {each.day}
                          </div>
                          <div className="text-white flex flex-wrap w-fulll ml-4 text-xl mt-4">
                            <FaAngleRight
                              onClick={() =>
                                index !== days.length - 1
                                  ? setChosenDay(chosenDay + 1)
                                  : setChosenDay(0)
                              }
                            />
                          </div>

                          <div
                            className="ml-16 text-sm rounded-full text-white px-4 py-2 flex bg-blue-600 m-2 "
                            onClick={() => handleAddExercise(index)}
                          >
                            {/* <FaPlus className="text-white m-auto" /> */}
                            Add Exercise
                          </div>
                        </div>
                        {/* bottom menu end */}
                        <div>
                          <input
                            className="inputbox"
                            placeholder="Body Parts"
                            onChange={handleSingleDay(index, "parts")}
                            value={each.parts}
                          />
                        </div>
                        {each.excercises.length > 0 &&
                          each.excercises.map((exercise, eIndex) => (
                            <div
                              className="mt-2 border-solid  border-b-2 border-gray-400 border-l-2 p-4 last:mb-8"
                              key={`week-${chosenWeek}-${index}=${eIndex}`}
                            >
                              <div className="flex justify-start gap-4">
                                <span className="font-bold text-lg">
                                  Exercise
                                </span>

                                <input
                                  className="inputbox"
                                  placeholder="Exercise"
                                  onChange={handleSingleExercise(
                                    index,
                                    eIndex,
                                    "name"
                                  )}
                                  value={exercise.name}
                                />
                                <button
                                  className="text-red-500  rounded px-2"
                                  onClick={() =>
                                    handleDeleteExercise(index, eIndex)
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </div>
                              <div className="mt-2">
                                <div className="grid grid-cols-7 gap-4">
                                  <span className="grid col-span-2">Reps</span>
                                  <span className="grid col-span-2">
                                    Weight (kg)
                                  </span>
                                  <span className="grid col-span-2">
                                    Difficulty
                                  </span>
                                  <span> </span>
                                </div>
                                {exercise.sets.map((set, sIndex) => (
                                  <div className="my-1 grid grid-cols-7 gap-4">
                                    <input
                                      className="inputbox grid col-span-2"
                                      placeholder="Reps"
                                      onChange={handleSingleSet(
                                        index,
                                        eIndex,
                                        sIndex,
                                        "rep"
                                      )}
                                      value={set.rep}
                                      type="number"
                                    />
                                    <input
                                      className="inputbox grid col-span-2"
                                      placeholder="Weight"
                                      onChange={handleSingleSet(
                                        index,
                                        eIndex,
                                        sIndex,
                                        "weight"
                                      )}
                                      value={set.weight}
                                      type="number"
                                    />
                                    <select
                                      className="inputbox grid col-span-2"
                                      placeholder="Difficulty"
                                      onChange={handleSingleSet(
                                        index,
                                        eIndex,
                                        sIndex,
                                        "difficulty"
                                      )}
                                      value={set.difficulty}
                                    >
                                      {difficultyOptions.map((diff) => (
                                        <option value={diff}>{diff}</option>
                                      ))}
                                    </select>
                                    <button
                                      className="text-red-500 flex justify-end mt-1 mr-2"
                                      onClick={() =>
                                        handleRemoveSet(index, eIndex, sIndex)
                                      }
                                    >
                                      <FaMinusCircle />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  className="back-color border border-gray-200 text-white w-full py-1 flex justify-center rounded-full mt-2"
                                  onClick={() => handleAddSet(index, eIndex)}
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )
                )}
            </div>
          </>
        )}
      </div>
      <Dialog
        open={open}
        className="w-4/5"
        onClose={handleHide}
        title={"Copy Previous Week?"}
        body={
          "Copy the routine from last week with exercises and sets included ?"
        }
        actions={
          <>
            <button
              className="p-2 bg-red-600 text-white rounded mr-4"
              onClick={() => handleAddWeek(false)}
            >
              New
            </button>
            <button
              className="p-2 bg-green-600 text-white rounded"
              onClick={() => handleAddWeek(true)}
            >
              Copy
            </button>
          </>
        }
      />
      <div id="modal-root" />
      <ToastContainer position="top-center" theme="dark" autoClose={1000} />
    </>
  );
};

export default App;
