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
  const searchRef = React.useRef(null as any)
  const [dropdownItems, setDropdownItems] = React.useState(options)
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(options as any[])
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(options.length ? options[0] : {value: 'No options', label: 'No options.'})
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState('')


  return (
    <div className="select-container">
      <label htmlFor="input-1">Input 1</label>
      <div className="input-container" onBlur={(e) => setIsOpen(() => false)}>
        <input
          ref={searchRef}
          className="search-input"
          id={'input-1'}  
          type="text"
          onFocus={(e) => setIsOpen(() => true)}
          value={searchValue ? searchValue : ''}
          onChange={(e) => {
           const val = e.target.value.trim()
           const v = e.target.value.trimStart();
            setSearchValue(prev => v)
            if (val) {
              let filteredItems = dropdownItems.map((item: {
                label: string
                value: string
              }) =>  {

                if (new RegExp(val).test(`${item.label}`)) {
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
            if (e.key === 'ArrowDown') {
              if(isOpen) {
                myRef.current.children[currentFocus].focus()
              } else {

              }
              setIsOpen(prev => {
                if(prev){
                  setTimeout(() => {
                    myRef.current.children[currentFocus].focus()
                  }, 0)
                  return prev
                }
                return !prev
              })
            }}}
        />
        <button 
          className="drop-btn"  
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            if (!isOpen) {
              setIsOpen(prev => !prev)
              searchRef.current.focus()
            } else {
              setIsOpen(prev => !prev)
              searchRef.current.blur()
            }
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onMouseUp={(e) => {
            e.stopPropagation()
            e.preventDefault()
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
            e.stopPropagation()
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
