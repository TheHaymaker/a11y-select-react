import * as React from 'react'

const Select: React.FC = () => {

  const options = [
    {
      value: '1',
      label: 'Option 1'
    },
    {
      value: '2',
      label: 'Option 2'
    },
    {
      value: '3',
      label: 'Option 3'
    }
  ]

  const myRef = React.useRef(null as any)
  const [dropdownItems, setDropdownItems] = React.useState(options)
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(options as any[])
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(options.length ? options[0] : {value: 'No options', label: 'No options.'})
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState('')


  return (
    <div className="select-container">
      <label htmlFor="input-1">Input 1</label>
      <div className="input-container">
        <input
          className="search-input"
          id={'input-1'}
          type="text"
          onClick={(e) => setIsOpen( prev => !prev)}
          value={searchValue ? searchValue : ''}
          onChange={(e) => {
           const val = e.target.value.trim()
            setSearchValue(prev => val)
            if (val) {
              let filteredItems = dropdownItems.map((item: {
                label: string
                value: string
              }) =>  {
                if (/`${val}`/.test(item.label)) {
                  return item
                } else {
                  return null;
                }
              }).filter(item => item ? item : false)

              filteredItems = filteredItems.length ? filteredItems : [
                {
                   label: 'No Options',
                   value: ''
                }
              ]

              setFilteredDropdownItems(() => filteredItems)
            } else {
              setFilteredDropdownItems(() => dropdownItems)
            }
          }}          
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === '' || e.key === 'ArrowDown')
            setIsOpen( prev => {
              if(!prev){
                setTimeout(() => {
                  myRef.current.children[currentFocus].focus()
                }, 0)
              }
            return !prev})
          }}
        />
        <button 
          className="drop-btn"
          onClick={(e) => setIsOpen( prev => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === '' || e.key === 'ArrowDown')
            setIsOpen( prev => {
              if(!prev){
                setTimeout(() => {
                  myRef.current.children[currentFocus].focus()
                }, 0)
              }
            return !prev})
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>  
      <div>
        <ul
          ref={myRef}
          className={`dropdown ${isOpen ? 'show-dropdown' : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              if (
              currentFocus === myRef.current.children.length - 1) {
                myRef.current.children[0].focus()
                setCurrentFocus(prev => 0)
              } else {
                myRef.current.children[currentFocus + 1].focus()
                setCurrentFocus( prev => prev + 1)
              }
            } else if (e.key === 'ArrowUp') {
              if (
              currentFocus === 0) {
                myRef.current.children[myRef.current.children.length - 1].focus()
                setCurrentFocus(prev =>  myRef.current.children.length - 1)
              } else {
                myRef.current.children[currentFocus - 1].focus()
                setCurrentFocus( prev => prev - 1)    
              }
            }
          }}
        >
          {filteredDropdownItems && filteredDropdownItems.length > 0
          ? filteredDropdownItems.map((item, index) => (
              <li 
               key={item.value}
               className="dropdownItem" 
               data-value={item.value}
               tabIndex={-1}
              >
                {item.label}
              </li>
              )
          )
          : null
          }
        </ul>
      </div>
    </div>
  )
}

export {Select}
