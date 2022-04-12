import "./App.css";
import { useState } from "react";

const App = () => {
  const [days, setDays] = useState([]);
  const [updated, setUpdated] = useState(false);
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
    setUpdated(!updated);
  };

  console.log(days);
  return (
    <div className="App">
      <h2 className="font-bold text-4xl">Progress Tracker</h2>
      <div className="w-full flex justify-end  pr-4">
        <button
          className="p-2 bg-blue-400 text-white rounded"
          onClick={handleAddWorkout}
        >
          Add Workout
        </button>
      </div>
      <div className="mt-4">
        {days.length > 0 &&
          days.map((each, index) => (
            <div className="m-auto w-3/4 border-2 rounded p-2 my-4" key={index}>
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
                <button
                  className="p-2 bg-blue-400 text-white rounded"
                  onClick={() => handleAddExercise(index)}
                >
                  Add Exercise
                </button>
              </div>
              {each.excercises.length > 0 &&
                each.excercises.map((exercise, eIndex) => (
                  <div className="mt-4 border-solid border-black border-b-2 border-l-2 p-4">
                    <div className="flex justify-start gap-4">
                      <span className="font-bold text-lg">Exercise</span>

                      <input
                        className="inputbox"
                        placeholder="Exercise"
                        onChange={handleSingleExercise(index, eIndex, "name")}
                        value={exercise.name}
                      />
                      <button className="bg-red-500 text-white rounded  px-3 py-2">
                        Remove
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
                          <input
                            className="inputbox"
                            placeholder="Difficulty"
                            onChange={handleSingleSet(
                              index,
                              eIndex,
                              sIndex,
                              "difficulty"
                            )}
                            value={set.difficulty}
                          />
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
