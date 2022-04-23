import "./App.css";
import { useEffect, useState } from "react";
import { FaSave, FaTrash, FaPlus } from "react-icons/fa";

const App = () => {
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [chosenWeek, setChosenWeek] = useState("");
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
      setWeeks(startingVals);
    }
  }, []);

  const handleAddWeek = () => {
    const tempDays = [
      { day: "Sunday", parts: "", excercises: [] },
      { day: "Monday", parts: "", excercises: [] },
      { day: "Tuesday", parts: "", excercises: [] },
      { day: "Wednesday", parts: "", excercises: [] },
      { day: "Thursday", parts: "", excercises: [] },
      { day: "Friday", parts: "", excercises: [] },
      { day: "Saturday", parts: "", excercises: [] },
    ];
    const tempWeeks = [...weeks];
    tempWeeks.push(tempDays);
    setWeeks(tempWeeks);
  };

  const handleWeekChoose = (event) => {
    setChosenWeek(event.target.value);
    setDays(weeks[event.target.value]);
  };

  const handleAddWorkout = () => {
    const tempDays = [...days];
    tempDays.push(singleDay);
    setDays(tempDays);
  };

  const handleSingleDay = (index, name) => (event) => {
    const tempDays = [...days];
    tempDays[index][name] = event.target.value;
    setDays(tempDays);
  };

  const handleSingleDayArray = (index, name, value) => {
    const tempDays = [...days];
    tempDays[index][name] = value;
    setDays(tempDays);
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
    setUpdated(!updated);
  };

  const handleDeleteExercise = (index, eIndex) => {
    const tempDays = [...days];
    tempDays[index].excercises.splice(eIndex, 1);
    setDays(tempDays);
    setUpdated(!updated);
  };

  const handleSave = () => {
    localStorage.setItem("weeks", JSON.stringify(weeks));
    console.log("saved");
  };

  const difficultyOptions = ["easy", "medium", "hard"];

  return (
    <div className="overflow-y-scroll px-2">
      <div className="w-full flex justify-between gap-2 mt-4">
        <div className="font-bold text-4xl">Progress Tracker</div>
        <div className="mr-4">
          <button
            className="p-1 bg-green-600 text-white rounded"
            onClick={handleSave}
          >
            <FaSave className="text-xl" />
          </button>
        </div>
      </div>
      <div className="w-full flex  gap-2 mt-4">
        <div className="w-1/3">
          <select
            className="inputbox"
            value={chosenWeek}
            onChange={handleWeekChoose}
          >
            <option>Choose week</option>
            {weeks.map((each, index) => (
              <option value={index}>Week {index + 1}</option>
            ))}
          </select>
        </div>
        <div className="w-2/3 flex justify-end gap-4 pr-4">
          <button
            className="p-2 bg-blue-400 text-white rounded"
            onClick={handleAddWeek}
          >
            Add Week
          </button>
          <button
            className="p-2 bg-blue-400 text-white rounded"
            onClick={handleAddWorkout}
          >
            Add Workout
          </button>
        </div>
      </div>

      <div className="mt-4">
        {days.length > 0 &&
          days.map((each, index) => (
            <div
              className="m-auto w-full border-2  rounded p-2 my-4"
              key={index}
            >
              <div className="grid grid-cols-3 gap-4">
                <input
                  className="titlebox"
                  placeholder="Day"
                  onChange={handleSingleDay(index, "day")}
                  value={each.day}
                />
                <input
                  className="titlebox"
                  placeholder="Body Parts"
                  onChange={handleSingleDay(index, "parts")}
                  value={each.parts}
                />
                <div
                  className="ml-16 rounded-full h-8 w-8 flex bg-blue-400 m-2"
                  onClick={() => handleAddExercise(index)}
                >
                  <FaPlus className="text-white m-auto" />
                </div>
              </div>
              {each.excercises.length > 0 &&
                each.excercises.map((exercise, eIndex) => (
                  <div className="mt-4 border-solid  border-b-2 border-l-2 p-4">
                    <div className="flex justify-start gap-4">
                      <span className="font-bold text-lg">Exercise</span>

                      <input
                        className="inputbox"
                        placeholder="Exercise"
                        onChange={handleSingleExercise(index, eIndex, "name")}
                        value={exercise.name}
                      />
                      <button
                        className="text-red-500  rounded px-2"
                        onClick={() => handleDeleteExercise(index, eIndex)}
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
          ))}
      </div>
    </div>
  );
};

export default App;
