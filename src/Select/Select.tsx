import * as React from 'react'
import { escapeRegExp } from '../utils'

const Select: React.FC = () => {
  let _timeoutID: any;
  const [isManagingFocus, setIsManagingFocus] = React.useState(false)
    
    const _onBlur = () => {
      // since the blue event emits first
      // we push the state update to the next
      // 'tick' on the event loop
      // by using a setTimeout
      _timeoutID = setTimeout(() => {
        if (isManagingFocus) {
          setIsManagingFocus(() => false);
        }
      }, 0);
    }
    
    const _onFocus = () => {
      // Since the focus event is emitted
      // at the same time as the blur event,
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

  // const selectedOptionsMap = React.useRef(new Map())
  const selectedOptionsMap = new Map()
  options.map(obj => selectedOptionsMap.set(JSON.stringify(obj), false))
  const [selected, setSelected] = React.useState(selectedOptionsMap)

  const myRef = React.useRef(null as any)
  const searchRef = React.useRef(null as any)
  const containerRef = React.useRef(null as any)
  const [dropdownItems, setDropdownItems] = React.useState(options)
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(options as any[])
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState('')

  React.useEffect(() => {
  
    if(!isManagingFocus) {
      // if it isn't managing focus
      // close the dropdown
      setIsOpen(false)
      containerRef.current.setAttribute('aria-expanded', false)
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
      <label htmlFor="input-1">Input 1</label>
      <div className="input-container">
        <div className="input-flex">
          {
            Array.from(selected.entries()).map((item: any) => {
              if(item[1]) {
                const option = JSON.parse(item[0])
                return (
                  <div key={option.value} className="multiValue">
                    <div className="multiValue--inner">{option.label}</div>
                    <button
                      aria-label='Remove selected item'
                      className="multiValue--close"
                      onClick={() => {
                        const key = item[0];
                        setSelected(prev => {
                          const next = new Map(prev)
                          next.set( key, !next.get(key))
                          return next
                        })
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                )
              }
              return null
            })
          }
          {
            // Wrap the below div in another div
            // contrained to a few pixels width
            // positioned relatively
            // Then...
            // position the input inside absolutely
            // see react-select library
          }
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
                if (isOpen) {
                  const el =  myRef.current.children[currentFocus] ? myRef.current.children[currentFocus] : myRef.current.children[0]
                  el.focus()
                  el.scrollIntoView()
                }
                setIsOpen(prev => { 
                  if(prev){
                    const el = myRef.current.children[currentFocus] ? myRef.current.children[currentFocus] : myRef.current.children[0]

                    setTimeout(() => {
                    el.focus()
                      el.scrollIntoView()
                    }, 0)
                    return prev
                  }
                  return !prev
                })
              }}
            }
          />
        </div>
        <button 
          aria-label={`Toggle dropdown ${isOpen ? 'closed' : 'open'}`}
          className={`drop-btn ${isOpen ? 'rotate' : ''}`}  
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
               aria-checked={selected.get(JSON.stringify(item))}
               onClick={(e: React.MouseEvent) => {
                const key = JSON.stringify(item)
                setSelected(prev => {
                  const next = new Map(prev)
                  next.set( key, !next.get(key))
                  return next
                })
               }}
               onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  const key = JSON.stringify(item)
                  setSelected(prev => {
                    const next = new Map(prev)
                    next.set( key, !next.get(key))
                    return next
                  })
                }
               }}
              >
                {selected.get(JSON.stringify(item))
                  ? (<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>)
                  : (<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>)}
                  {' '}
                  <span style={{
                    pointerEvents: 'none',
                    cursor: 'none'
                  }}>
                  {item.label}
                  </span>
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
