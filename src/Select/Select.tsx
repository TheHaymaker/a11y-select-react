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
    },
    {
      value: '4',
      label: 'Option 4'
    },
    {
      value: '5',
      label: 'Option 5'
    },
    {
      value: '6',
      label: 'Option 6'
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
            e.stopPropagation()
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              if(isOpen) {
                myRef.current.children[currentFocus].focus()
                myRef.current.children[currentFocus].scrollIntoView()
              }
              setIsOpen(prev => {
                if(prev){
                  setTimeout(() => {
                    myRef.current.children[currentFocus].focus()
                    myRef.current.children[currentFocus].scrollIntoView()
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
          onKeyPress={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onKeyUp={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              if (
              currentFocus === myRef.current.children.length - 1) {
               setTimeout(() => {
                myRef.current.children[0].focus()
                myRef.current.children[0].scrollIntoView()
               }, 0)
                setCurrentFocus(prev => 0)
              } else {
                setTimeout(() => {
                  myRef.current.children[currentFocus + 1].focus()
                  myRef.current.children[currentFocus + 1].scrollIntoView()
                 }, 0)
                setCurrentFocus( prev => prev + 1)
              }
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              if (
              currentFocus === 0) {
                setTimeout(() => {   
                  myRef.current.children[myRef.current.children.length - 1].focus()
                  myRef.current.children[myRef.current.children.length - 1].scrollIntoView()
                 }, 0)
                setCurrentFocus(prev =>  myRef.current.children.length - 1)
              } else {
                setTimeout(() => {
                  myRef.current.children[currentFocus - 1].focus()
                  myRef.current.children[currentFocus - 1].scrollIntoView()
                 }, 0)
                setCurrentFocus( prev => prev - 1)    
              }
            }
          }}
        >
          {filteredDropdownItems && filteredDropdownItems.length > 0
          ? filteredDropdownItems.map((item, index) => (
              <li 
               key={item.value}
               id={`listItem--${item.value}`}
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
