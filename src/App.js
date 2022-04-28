import "./App.css";
import { useEffect, useState } from "react";
import { FaSave, FaTrash, FaAngleRight, FaAngleLeft } from "react-icons/fa";
import Dialog from "./Dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [chosenWeek, setChosenWeek] = useState("");
  const [open, setOpen] = useState(false);
  const [chosenDay, setChosenDay] = useState(0);

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
    handleSingleExerciseArray(index, eIndex, "excercises", tempSet);
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

  const difficultyOptions = ["easy", "medium", "hard"];

  return (
    <>
      <div className=" px-2">
        <div className="fixed top-0 pt-2 back-color z-10 w-full flex justify-between gap-2 h-14  mb-2">
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
              Add Workout
            </button>
          </div>
        </div>

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
                      <div className="w-1/4 mx-2 ml-4 mt-2 mt-3">
                        <input
                          className="ml-4 titlebox"
                          placeholder="Day"
                          onChange={handleSingleDay(index, "day")}
                          value={each.day}
                        />
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
                        className="ml-16 rounded-full text-white px-4 py-2 flex bg-blue-600 m-2 "
                        onClick={() => handleAddExercise(index)}
                      >
                        {/* <FaPlus className="text-white m-auto" /> */}
                        Add Exercise
                      </div>
                    </div>
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
                            <span className="font-bold text-lg">Exercise</span>

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
                            <div className="grid grid-cols-3 gap-4">
                              <span className="">Reps</span>
                              <span className="">Weight (kg)</span>
                              <span className="">Difficulty</span>
                            </div>
                            {exercise.sets.map((set, sIndex) => (
                              <div className="my-1 grid grid-cols-3 gap-4">
                                <input
                                  className="inputbox"
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
                                  className="inputbox"
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
                                  className="inputbox"
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
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )
            )}
        </div>
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
