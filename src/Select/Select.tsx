import * as React from 'react'
import { escapeRegExp } from '../utils'



const Select: React.FC = () => {
  let _timeoutID: any;
  const [isManagingFocus, setIsManagingFocus] = React.useState(false)
    
    const _onBlur = () => {
      console.log('Blur Fired')
      // since the blue event emits first
      // we push the state update to the next
      // 'tick' on the event loop
      // by using a setTimeout
      _timeoutID = setTimeout(() => {
        if (isManagingFocus) {
          setIsManagingFocus(() => false);
          console.log('State set inside Timeout!')
        }
      }, 0);
    }
    
    const _onFocus = () => {
      console.log('Focus happened')

      // Since the focus event is emitted
      // directly after the blur event,
      // and they both bubble up in react,
      // we can cancel the state change
      // that takes place inside of the
      // blur event's setTimeout by clearing
      // the timeout interval before it takes place
      // on the event loop
      // Otherwise, only the blur event is emitted
      // when the parent loses focus to another
      // element on the page
      clearTimeout(_timeoutID);
      if (!isManagingFocus) {
        console.log('State set inside Focus')
        setIsManagingFocus(() => true)
      }
    }

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
  const containerRef = React.useRef(null as any)
  const [dropdownItems, setDropdownItems] = React.useState(options)
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(options as any[])
  const [isOpen, setIsOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(options.length ? options[0] : {value: 'No options', label: 'No options.'})
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState('')

  React.useEffect(() => {
  
    if(!isManagingFocus) {
      setIsOpen(false)
    }

  }, [isManagingFocus])

  return (
    <div
      ref={containerRef}
      className="select-container"
      aria-haspopup={true}
      aria-expanded={false}
      onBlur={_onBlur}
      onFocus={_onFocus}
    >
      {console.log(isManagingFocus)}
      <label htmlFor="input-1">Input 1</label>
      <div className="input-container">
        <input
          ref={searchRef}
          className="search-input"
          id={'input-1'}  
          type="text"
          onFocus={(e) => setIsOpen(() => { 
            const wrapper = containerRef.current;
            wrapper.setAttribute('aria-expanded', true)
            return true 
          })}
          value={searchValue ? searchValue : ''}
          onChange={(e) => {
           const val = escapeRegExp(e.target.value.trim())
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
                const el =  myRef.current.children[currentFocus] ? myRef.current.children[currentFocus] : myRef.current.children[0]

                el.focus()
                el.scrollIntoView()
              }
              setIsOpen(prev => { 
                const wrapper = containerRef.current;
                if(prev){
                  const el =  myRef.current.children[currentFocus] ? myRef.current.children[currentFocus] : myRef.current.children[0]

                  setTimeout(() => {
                   el.focus()
                    el.scrollIntoView()
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
          role={'menu'}
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
              myRef.current.children.length === 0 || currentFocus === myRef.current.children.length - 1) {
               setTimeout(() => {
                myRef.current.children[0].focus()
                myRef.current.children[0].scrollIntoView()
                setCurrentFocus(prev => 0)
               }, 0)
              } else {
                setTimeout(() => {
                  if(myRef.current.children.length <= currentFocus) {
                    myRef.current.children[0].focus()
                    myRef.current.children[0].scrollIntoView()
                    setCurrentFocus( prev => 0)
                  } else {
                    myRef.current.children[currentFocus + 1].focus()
                    myRef.current.children[currentFocus + 1].scrollIntoView()
                    setCurrentFocus( prev => prev + 1)
                  }
                }, 0)
              }
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              
              if (
                currentFocus === 0 && myRef.current.children.length > 0) {
                  setTimeout(() => {   
                    myRef.current.children[myRef.current.children.length - 1].focus()
                    myRef.current.children[myRef.current.children.length - 1].scrollIntoView()
                    setCurrentFocus(prev =>  myRef.current.children.length - 1)
                  }, 0)
                } else if (currentFocus !== 0 && myRef.current.children.length > 0){
                  setTimeout(() => {
                    if(myRef.current.children.length <= currentFocus) {
                      myRef.current.children[0].focus()
                      myRef.current.children[0].scrollIntoView()
                      setCurrentFocus( prev => 0)
                    } else {
                      myRef.current.children[currentFocus - 1].focus()
                      myRef.current.children[currentFocus - 1].scrollIntoView()
                      setCurrentFocus( prev => prev - 1)
                    }
                 }, 0)  
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
               role={'menuitemcheckbox'}
               aria-checked={'false'}
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
