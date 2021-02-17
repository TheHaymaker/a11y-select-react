import React from "react"
import { escapeRegExp } from "../utils"

interface DropdownItem {
  label: string; 
  value: string;
}

const SCROLL_OPTIONS: ScrollIntoViewOptions = {behavior: "smooth", block: "center", inline: "nearest"}

const Select: React.FC<{
  type: "single" | "multi";
  label: string;
  selectOptions: DropdownItem[];
  selection?: DropdownItem[] | [];
  hasClearAll?: boolean;
  hasCheckboxes?: boolean;
}> = ({ type, label, selectOptions, selection = [], hasClearAll = true, hasCheckboxes = false }): React.ReactElement => {
  let _timeoutID: number
  const [isManagingFocus, setIsManagingFocus] = React.useState(false)

  const _onBlur = (): void => {
    // since the blue event emits first
    // we push the state update to the next
    // 'tick' on the event loop
    // by using a setTimeout
    _timeoutID = window.setTimeout((): void => {
      if (isManagingFocus) {
        setIsManagingFocus((): boolean => false)
        setSearchValue('')
        setFilteredDropdownItems(dropdownItems)
      }
    }, 0)
  }

  const _onFocus = (): void => {
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
    clearTimeout(_timeoutID)
    if (!isManagingFocus) {
      setIsManagingFocus((): boolean => true)
    }
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dropdownItems, setDropdownItems] = React.useState(selectOptions)

  React.useEffect(() => {
    setDropdownItems(selectOptions)
  }, [selectOptions])
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(
    selectOptions as DropdownItem[]
  )
  const [selected, setSelected] = React.useState(selection)

  const [selectedRefs, setSelectedRefs] = React.useState<React.MutableRefObject<HTMLDivElement|null>[]>([])
  const multiInFocus = React.useRef(-9999)

  React.useEffect(() => {
    const refs: React.MutableRefObject<HTMLDivElement|null>[] = []
    Array.from(selected.entries()).forEach((item) => {
      refs.push(React.createRef())
    })
    setSelectedRefs(refs)
  }, [selected])

 

  const myRef: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null)
  const searchRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState("")

  React.useEffect((): void => {
    if (!isManagingFocus) {
      // if it isn't managing focus
      // close the dropdown
      setIsOpen(false)
      setSearchValue('')
      setFilteredDropdownItems(dropdownItems)
      if(containerRef.current && containerRef.current !== undefined) {
        containerRef.current.setAttribute("aria-expanded", 'false')
      }
    }
  }, [dropdownItems, isManagingFocus])

  const handleKeyDownCapture = React.useCallback((e) => {
    if(e.key === 'ArrowLeft' && !searchValue) {
      const mySelections = selectedRefs.filter(item => item.current !== null)
      if(mySelections.length > 0) {
        if(multiInFocus.current === 0) {
          return
        } else {
          if(multiInFocus.current !== null) {
            multiInFocus.current = multiInFocus.current !== -9999 ? multiInFocus.current - 1 : mySelections.length - 1
            const btn = mySelections[multiInFocus.current].current?.querySelector('button')
            btn?.focus()
          }
        }
      }
    } else if(e.key === 'ArrowRight' && !searchValue) {
      if(multiInFocus.current === -9999) {
        return
      }
      const mySelections = selectedRefs.filter(item => item.current != null)
      if(mySelections.length > 0) {
        if(multiInFocus.current === mySelections.length - 1) {
          if(searchRef.current) {
            searchRef.current.focus()
          }
          return
        } else {
          multiInFocus.current = multiInFocus.current !== -9999 ? multiInFocus.current + 1 : mySelections.length - 1
          const btn = mySelections[multiInFocus.current].current?.querySelector('button')
          btn?.focus()
        }
      }
    }
  }, [selectedRefs, searchValue])

  const autoSizeRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if(autoSizeRef.current !== null && searchRef.current) {
      searchRef.current.style.width = `${autoSizeRef.current.clientWidth + 2}px`
    }

  }, [searchValue, autoSizeRef])

  return (
    <div
      ref={containerRef}
      className="select-container"
      aria-haspopup={true}
      aria-expanded={false}
      onBlur={_onBlur}
      onFocus={_onFocus}
    >
      <label htmlFor={`${type === 'single' ? 'input-2' : 'input-1'}`}>{label}</label>
      <div
        role="presentation"
        className="input-container"
        onClick={() => {
          if(searchRef.current) {
            searchRef.current.focus()
          }
          setIsOpen((prev): boolean => {

            if(prev) {
              if(containerRef.current) {
                containerRef.current.setAttribute("aria-expanded", 'false')
              }
              return false
            } else {
              if(containerRef.current) {
                containerRef.current.setAttribute("aria-expanded", 'true')
              }
              return true
            }
          })
        }}
        onMouseDown={(e) => {
          e.preventDefault()
        }}
        onMouseUp={(e) => {
          e.preventDefault()
        }}
        onBlur={(e) => e}
        onFocus={(e) => e}
        onKeyDownCapture={handleKeyDownCapture}
      >
        {type === "multi" ? (
          <div className="input-flex">
            {selected.length !== 0 && selected.map((item, index): React.ReactNode => (
              <div 
                ref={selectedRefs[index]} 
                key={item.value}
                className="multiValue"
              >
                <div className="multiValue--inner">{item.label}</div>
                <button
                  tabIndex={-1}
                  aria-label="Remove selected item"
                  className="multiValue--close"
                  onClick={(): void => {
                    if(item.label === "No Options" || item.value === '') return
                    setSelected(prev => {
                      const newArr = [...prev]
                      const isChosen = newArr.findIndex(el => el.value === item.value && el.label === item.label)
                      if(isChosen !== -1) {
                        // if prev contains the item - remove it
                        newArr.splice(isChosen, 1)
                        return newArr
                      } else {
                        // else add it
                        newArr.push(item)
                        return newArr
                      }

                    })
                    
                    setSearchValue('')
                    setFilteredDropdownItems(dropdownItems)
                    if(searchRef.current) {
                      searchRef.current.focus()
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="bevel"
                  >
                    <line x1="18"
                      y1="6"
                      x2="6"
                      y2="18"
                    ></line>
                    <line x1="6"
                      y1="6"
                      x2="18"
                      y2="18"
                    ></line>
                  </svg>
                </button>
              </div>
            ))}
            <div className="input-size-wrapper">
              <input
                ref={searchRef}
                className="search-input"
                id={"input-1"}
                type="text"
                onFocus={(e): void => {
                  multiInFocus.current = -9999
                }}
                value={searchValue ? searchValue : ""}
                onChange={(e): void => {
                  const val = escapeRegExp(e.target.value.trim())
                  const v = e.target.value.trimStart()
                  setSearchValue((prev): string => v)
                  if (val) {

                    setIsOpen(true)
                    if(containerRef.current && containerRef.current !== undefined) {
                      containerRef.current.setAttribute("aria-expanded", 'true')
                    }

                    let filteredItems = dropdownItems.reduce((filtered: DropdownItem[], item: DropdownItem) => {
                      if (new RegExp(val, 'gi').test(`${item.label}`)) {
                        filtered.push(item)
                      }
                      return filtered
                    }, [])


                    filteredItems = filteredItems.length
                      ? filteredItems
                      : [
                        {
                          label: "No Options",
                          value: "",
                        },
                      ]

                    setFilteredDropdownItems(() => filteredItems)
                  } else {
                    setFilteredDropdownItems(() => dropdownItems)
                  }
                }}
                onKeyDown={(e): void => {
                  e.stopPropagation()
                  if (e.key === "ArrowDown") {
                    e.persist()
                    e.preventDefault()
                    if (isOpen) {
                      if(myRef.current) {
                        const childrenArr = (myRef.current.children as HTMLCollection)
                        if(!searchValue && childrenArr[currentFocus]){
                          const listItemParent = (childrenArr[currentFocus] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                        
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        } else {
                          const listItemParent = (childrenArr[0] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                          
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        }
                        
                      }
                      setIsOpen((prev): boolean => {
                        if (prev) {
                          if(myRef.current) {
                            const childrenArr = (myRef.current.children as HTMLCollection)
                            if(!searchValue && childrenArr[currentFocus]){
                              const listItemParent = (childrenArr[currentFocus] as HTMLElement)
                              const btn = (listItemParent.children[0] as HTMLButtonElement)
                            
                              setTimeout((): void => {
                                btn.focus()
                                btn.scrollIntoView(SCROLL_OPTIONS)
                              }, 0)
                            } else {
                              const listItemParent = (childrenArr[0] as HTMLElement)
                              const btn = (listItemParent.children[0] as HTMLButtonElement)
                                
                              setTimeout((): void => {
                                btn.focus()
                                btn.scrollIntoView(SCROLL_OPTIONS)
                              }, 0)
                            }
                          }
                       
                          return prev
                        }
                        return !prev
                      })
                    } else {
                      setIsOpen((): boolean => {
                        if(containerRef.current) {
                          containerRef.current.setAttribute("aria-expanded", 'true')
                        }
                        return true
                      })
                    }
                  }
                }}
              />
              <div ref={autoSizeRef}
                style={
                  {
                    position: "absolute", 
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    height: 0, 
                    overflow: "scroll", 
                    whiteSpace: "pre",
                    fontSize: '16px'
                  }
                }
              >{searchValue}</div>
            </div>
          </div>
        ) : (
          <div className="input-flex">
            {selected.length !== 0 && selected.map((item, index): React.ReactNode => (
              <div key={item.value}
                className="singleValue"
              >
                <div className="singleValue--inner">{!searchValue && item.label}</div>
                {hasClearAll && 
                    <button
                      tabIndex={-1}
                      aria-label="Remove selected item"
                      className="singleValue--close"
                      onClick={() => {
                        setSelected(() => [])
                        setSearchValue('')
                        setFilteredDropdownItems(dropdownItems)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="bevel"
                      >
                        <line x1="18"
                          y1="6"
                          x2="6"
                          y2="18"
                        ></line>
                        <line x1="6"
                          y1="6"
                          x2="18"
                          y2="18"
                        ></line>
                      </svg>
                    </button>}
              </div>
            ))}
            <div className="input-size-wrapper">
              <input
                ref={searchRef}
                className="search-input"
                id={"input-2"}
                type="text"
                onFocus={(e): void => {
                  multiInFocus.current = -9999
                }}
                value={searchValue ? searchValue : ""}
                onChange={(e): void => {
                  if(!isOpen) {
                    setIsOpen(true)
                  }
                  const val = escapeRegExp(e.target.value.trim())
                  const v = e.target.value.trimStart()
                  setSearchValue((prev): string => v)
                  if (val) {

                    let filteredItems = dropdownItems.reduce((filtered: DropdownItem[], item: DropdownItem) => {
                      if (new RegExp(val, 'gi').test(`${item.label}`)) {
                        filtered.push(item)
                      }
                      return filtered
                    }, [])


                    filteredItems = filteredItems.length
                      ? filteredItems
                      : [
                        {
                          label: "No Options",
                          value: "",
                        },
                      ]

                    setFilteredDropdownItems(() => filteredItems)
                  } else {
                    setFilteredDropdownItems(() => dropdownItems)
                  }
                }}
                onKeyDown={(e): void => {
                  e.stopPropagation()
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    if (isOpen) {
                      if(myRef.current) {
                        const childrenArr = (myRef.current.children as HTMLCollection)
                        if(childrenArr[currentFocus]){
                          const listItemParent = (childrenArr[currentFocus] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                        
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        } else if(childrenArr[0]){
                          const listItemParent = (childrenArr[0] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                        
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        }
                      }
                    }
                    setIsOpen((prev): boolean => {
                      if (prev) {
                        if(myRef.current) {
                          const childrenArr = (myRef.current.children as HTMLCollection)
                          if(childrenArr[currentFocus]){
                            const listItemParent = (childrenArr[currentFocus] as HTMLElement)
                            const btn = (listItemParent.children[0] as HTMLButtonElement)
                            setTimeout((): void => {
                              btn.focus()
                              btn.scrollIntoView(SCROLL_OPTIONS)
                            }, 0)
                          } else {
                            if(childrenArr[0]){
                              const listItemParent = (childrenArr[0] as HTMLElement)
                              const btn = (listItemParent.children[0] as HTMLButtonElement)
                              setTimeout((): void => {
                                btn.focus()
                                btn.scrollIntoView(SCROLL_OPTIONS)
                              }, 0)
                            }
                          }
                        }
                        return prev
                      }
                      return !prev
                    })
                  }
                }}
              />
              <div ref={autoSizeRef}
                style={
                  {
                    position: "absolute", 
                    top: 0,
                    left: 0,
                    visibility: "hidden",
                    height: 0, 
                    overflow: "scroll", 
                    whiteSpace: "pre",
                    fontSize: '16px'
                  }
                }
              >{searchValue}</div>
            </div>
          </div>
        )}
        <button
          aria-label={`Toggle dropdown ${isOpen ? "closed" : "open"}`}
          className={`drop-btn ${isOpen ? "rotate" : ""}`}
          tabIndex={-1}
          onClick={(e): void => {
            e.stopPropagation()
            if (!isOpen) {
              setIsOpen((prev) => !prev)
              if(searchRef.current) {
                searchRef.current.focus()
              }
            } else {
              setIsOpen((prev) => !prev)
              if(searchRef.current) {
                searchRef.current.blur()
              }
            }
          }}
          onMouseDown={(e): void => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onMouseUp={(e): void => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="bevel"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      <div>
        <ul
          ref={myRef}
          className={`dropdown ${isOpen ? "show-dropdown" : ""}`}
          role={"menu"}
          onKeyPress={(e): void => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onKeyUp={(e: React.SyntheticEvent<HTMLUListElement>): void => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onKeyDown={(e): void => {
           
            e.stopPropagation()
            if (e.key === "ArrowDown") {
              e.preventDefault()
              if(myRef.current) {
                if (
                  myRef.current.children.length === 0 ||
                  currentFocus === myRef.current.children.length - 1
                ) {
                  setTimeout((): void => {
                    if(myRef.current) {

                      const childrenArr = (myRef.current.children as HTMLCollection)
                      if(childrenArr[0]){
                        const listItemParent = (childrenArr[0] as HTMLElement)
                        const btn = (listItemParent.children[0] as HTMLButtonElement)
                        btn.focus()
                        btn.scrollIntoView(SCROLL_OPTIONS)
                      }
                    }
                    setCurrentFocus((prev): number => 0)
                  }, 0)
                } else {
                  setTimeout((): void => {
                    if(myRef.current) {

                      const childrenArr = (myRef.current.children as HTMLCollection)
                      console.log(childrenArr)
                     
                      if (childrenArr.length <= currentFocus) {
                        if(childrenArr[0]){
                          const listItemParent = (childrenArr[0] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        }
                        setCurrentFocus((prev): number => 0)
                      } else {
                        if(childrenArr[currentFocus + 1]){
                          const listItemParent = (childrenArr[currentFocus + 1] as HTMLElement)
                          const btn = (listItemParent.children[0] as HTMLButtonElement)
                          btn.focus()
                          btn.scrollIntoView(SCROLL_OPTIONS)
                        }
                        setCurrentFocus((prev): number => prev + 1)
                      }
                    }
                  }, 0)
                }
              }
            } else if (e.key === "ArrowUp") {
              e.preventDefault()

              if (currentFocus === 0 && myRef.current && myRef.current.children.length > 0) {
                setTimeout((): void => {
                  if(myRef.current) {
                    const listItemParent = (myRef.current.children[
                      myRef.current.children.length - 1
                    ] as HTMLElement)
                    const btn = (listItemParent.children[0] as HTMLButtonElement)
                    btn.focus()
                    btn.scrollIntoView(SCROLL_OPTIONS)
                    setCurrentFocus((prev): number => myRef.current ? myRef.current.children.length - 1 : prev)
                  }
                }, 0)
              } else if (
                currentFocus !== 0 &&
                myRef.current &&
                myRef.current.children.length > 0
              ) {
                setTimeout((): void => {
                  if(myRef.current) {
                    if (myRef.current.children.length <= currentFocus) {
                      const listItemParent = (myRef.current.children[0] as HTMLElement)
                      const btn = (listItemParent.children[0] as HTMLButtonElement)
                      btn.focus()
                      btn.scrollIntoView(SCROLL_OPTIONS)
                      setCurrentFocus((prev): number => 0)
                    } else {
                      const listItemParent = (myRef.current.children[currentFocus - 1] as HTMLElement)
                      const btn = (listItemParent.children[0] as HTMLButtonElement)
                      btn.focus()
                      btn.scrollIntoView(SCROLL_OPTIONS)
                      setCurrentFocus((prev): number => prev - 1)
                    }
                  }
                }, 0)
              }
            }
          }}
        >
          {filteredDropdownItems && filteredDropdownItems.length > 0
            ? filteredDropdownItems.map((item, index): React.ReactNode => (
              <li
                key={item.value}
                className="dropdownItem"
                aria-label={"menuitemcheckbox"}
                
              >
                <button
                  data-value={item.value}
                  tabIndex={-1}
                  aria-label={"menuitemcheckbox"}
                  aria-pressed={selected.findIndex(el => el.label === item.label && el.value === item.value) !== -1}
                  onClick={(e: React.MouseEvent): void => {

                    if(item.label === "No Options" || item.value === '') return

                    if(type === 'multi') {
                      setSelected(prev => {
                        const newArr = [...prev]
                        const isChosen = newArr.findIndex(el => el.value === item.value && el.label === item.label)
                        if(isChosen !== -1) {
                          // if prev contains the item - remove it
                          newArr.splice(isChosen, 1)
                          return newArr
                        } else {
                          // else add it
                          newArr.push(item)
                          return newArr
                        }
                      })
                      setSearchValue('')
                      setFilteredDropdownItems(dropdownItems)
                    } else {
                      setSelected(() => [item])
                      setSearchValue('')
                      setFilteredDropdownItems(dropdownItems)
                    }
                  }}
                  onKeyUp={(e: React.KeyboardEvent): void => {
                    if (e.key === "Enter" || e.key === " ") {
                      if(item.label === "No Options" || item.value === '') return
                      if(type === 'multi') {
                        setSelected(prev => {
                          const newArr = [...prev]
                          const isChosen = newArr.findIndex(el => el.value === item.value && el.label === item.label)
                          if(isChosen !== -1) {
                            // if prev contains the item - remove it
                            newArr.splice(isChosen, 1)
                            return newArr
                          } else {
                            // else add it
                            newArr.push(item)
                            return newArr
                          }
    
                        })
                        setSearchValue('')
                        setFilteredDropdownItems(dropdownItems)
                      } else {
                        setSelected(() => [item])
                        setSearchValue('')
                        setFilteredDropdownItems(dropdownItems)
                      }
                    }
                  }}
                >
                  {
                    hasCheckboxes ? (selected.findIndex(el => el.value === item.value && el.label === item.label) !== -1 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="bevel"
                      >
                        <polyline points="9 11 12 14 22 4"></polyline>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeLinejoin="bevel"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                      </svg>
                    )
                    ) : null
                  }
                  {" "}
                  <span
                    style={{
                      pointerEvents: "none",
                      cursor: "none",
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))
            : null}
        </ul>
      </div>
    </div>
  )
}

export { Select }
