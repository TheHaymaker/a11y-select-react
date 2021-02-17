import React from "react"
import "./App.css"
import { Select } from "./Select"

const App: React.FC = (): React.ReactElement => (
  <div className="my-grid">
    <Select label="Multi Input"
      type="multi"
    />
    <Select label="Single Input"
      type="single"
    />
  </div>
)

export default App
