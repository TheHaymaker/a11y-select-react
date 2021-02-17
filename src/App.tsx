import React from "react"
import "./App.css"
import { Select } from "./Select"

const App: React.FC = (): React.ReactElement => {

  const [selectOptions, setSelectOptions] = React.useState([
    {
      value: "1",
      label: "Option 1",
    },
    {
      value: "2",
      label: "Option 2",
    },
    {
      value: "3",
      label: "Option 3",
    },
    {
      value: "4",
      label: "Option 4",
    },
    {
      value: "5",
      label: "Option 5",
    },
    {
      value: "6",
      label: "Option 6",
    },
  ])

  return (
    <div className="my-grid">
      <Select selectOptions={selectOptions}
        label="Multi Input"
        type="multi"
        hasCheckboxes
      />
      <Select 
        selectOptions={selectOptions}
        label="Single Input"
        type="single"
      />

      <button onClick={() => setSelectOptions(prev => [...prev, {
        value: `${prev.length + 1}`,
        label: `Option ${prev.length + 1}`,
      }])}
      >Add Item</button>
    </div>
  )}

export default App
