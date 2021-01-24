import React from "react"
import "./App.css"
import { Select } from "./Select"

const App: React.FC = (): React.ReactElement => (
  <div>
    <Select label="Multi Input"
      type="multi"
    />
    <br />
    <br />
    <br />
    <Select label="Single Input"
      type="single"
    />
  </div>
)

export default App
