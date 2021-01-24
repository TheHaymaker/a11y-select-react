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
}> = ({ type, label }): React.ReactElement => {
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

  const options = [
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
  ]

  // const selectedOptionsMap = React.useRef(new Map())
  const selectedOptionsMap = new Map()
  options.forEach((obj): Map<string, string> => selectedOptionsMap.set(JSON.stringify(obj), false))
  const [selected, setSelected] = React.useState(selectedOptionsMap)

  const myRef: React.MutableRefObject<HTMLUListElement | null> = React.useRef(null)
  const searchRef: React.MutableRefObject<HTMLInputElement | null> = React.useRef(null)
  const containerRef: React.MutableRefObject<HTMLDivElement | null> = React.useRef(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dropdownItems, setDropdownItems] = React.useState(options)
  const [filteredDropdownItems, setFilteredDropdownItems] = React.useState(
    options as DropdownItem[]
  )
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentFocus, setCurrentFocus] = React.useState(0)
  const [searchValue, setSearchValue] = React.useState("")

  React.useEffect((): void => {
    if (!isManagingFocus) {
      // if it isn't managing focus
      // close the dropdown
      setIsOpen(false)
      if(containerRef.current && containerRef.current !== undefined) {
        containerRef.current.setAttribute("aria-expanded", 'false')
      }
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
      <label htmlFor={`${type === 'single' ? 'input-2' : 'input-1'}`}>{label}</label>
      <div
        role="presentation"
        className="input-container"
        onClick={() => {
          if(searchRef.current) {
            searchRef.current.focus()
          }
        }}
        onMouseDown={(e) => {
          e.preventDefault()
        }}
        onMouseUp={(e) => {
          e.preventDefault()
        }}
        onBlur={(e) => e}
        onFocus={(e) => e}
      >
        {type === "multi" ? (
          <div className="input-flex">
            {Array.from(selected.entries()).map((item: [string, string]): React.ReactNode => {
              if (item[1]) {
                const option = JSON.parse(item[0])
                return (
                  <div key={option.value}
                    className="multiValue"
                  >
                    <div className="multiValue--inner">{option.label}</div>
                    <button
                      aria-label="Remove selected item"
                      className="multiValue--close"
                      onClick={(): void => {
                        const key = item[0]
                        setSelected((prev): Map<string,string> => {
                          const next = new Map(prev)
                          next.set(key, !next.get(key))
                          return next
                        })
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
                )
              }
              return null
            })}
            <input
              ref={searchRef}
              className="search-input"
              id={"input-1"}
              type="text"
              onFocus={(e): void =>
                setIsOpen((): boolean => {
                  if(containerRef.current) {
                    containerRef.current.setAttribute("aria-expanded", 'true')
                  }
                  return true
                })}
              value={searchValue ? searchValue : ""}
              onChange={(e): void => {
                const val = escapeRegExp(e.target.value.trim())
                const v = e.target.value.trimStart()
                setSearchValue((prev): string => v)
                if (val) {

                  let filteredItems = dropdownItems.reduce((filtered: DropdownItem[], item: DropdownItem) => {
                    if (new RegExp(val).test(`${item.label}`)) {
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
                  console.log('key down: ', e)
                  e.preventDefault()
                  if (isOpen) {
                    if(myRef.current) {
                      const childrenArr = (myRef.current.children as HTMLCollection)
                      if(childrenArr[currentFocus]){
                        const listItemParent = (childrenArr[currentFocus] as HTMLElement)
                        const btn = (listItemParent.children[0] as HTMLButtonElement)
                        
                        btn.focus()
                        btn.scrollIntoView(SCROLL_OPTIONS)
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
                          }
                        }
                       
                        return prev
                      }
                      return !prev
                    })
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="input-flex">
            {Array.from(selected.entries()).map((item: [string, string]): React.ReactNode => {
              if (item[1]) {
                const option = JSON.parse(item[0])
                return (
                  <div key={option.value}
                    className="singleValue"
                  >
                    <div className="singleValue--inner">{option.label}</div>
                    <button
                      aria-label="Remove selected item"
                      className="singleValue--close"
                      onClick={() => {
                        const key = item[0]
                        setSelected((prev) => {
                          const next = new Map(prev)
                          next.set(key, !next.get(key))
                          return next
                        })
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
                )
              }
              return null
            })}
            <input
              ref={searchRef}
              className="search-input"
              id={"input-2"}
              type="text"
              onFocus={(e): void =>
                setIsOpen((): boolean => {
                  if(containerRef.current) {
                    containerRef.current.setAttribute("aria-expanded", 'true')
                  }
                  return true
                })}
              value={searchValue ? searchValue : ""}
              onChange={(e): void => {
                const val = escapeRegExp(e.target.value.trim())
                const v = e.target.value.trimStart()
                setSearchValue((prev): string => v)
                if (val) {

                  let filteredItems = dropdownItems.reduce((filtered: DropdownItem[], item: DropdownItem) => {
                    if (new RegExp(val).test(`${item.label}`)) {
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
                        }
                      }
                      return prev
                    }
                    return !prev
                  })
                }
              }}
            />
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
            width="31"
            height="31"
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
                id={`listItem--${item.value}`}
                className="dropdownItem"
                
              >
                <button
                  data-value={item.value}
                  tabIndex={-1}
                  aria-label={"menuitemcheckbox"}
                  aria-pressed={selected.get(JSON.stringify(item))}
                  onClick={(e: React.MouseEvent): void => {
                    const key = JSON.stringify(item)

                    if(type === 'multi') {
                      setSelected((prev): Map<string, number> => {
                        const next = new Map(prev)
                        next.set(key, !next.get(key))
                        return next
                      })
                    } else {
                      const itemInQuestion = JSON.stringify(item)
                      setSelected((prev): Map<string, number> => {
                        const newSelected = new Map()
                        Array.from(prev).forEach(([key, value]) => {
                          if(itemInQuestion === key) {
                            newSelected.set(key, true)
                          } else {
                            newSelected.set(key, false)
                          }
                        })
                        // return next
                        return newSelected
                      })
                    }
                  }}
                  onKeyUp={(e: React.KeyboardEvent): void => {
                    const key = JSON.stringify(item)

                    if (e.key === "Enter" || e.key === " ") {
                      if(type === 'multi') {
                        setSelected((prev): Map<string, number> => {
                          const next = new Map(prev)
                          next.set(key, !next.get(key))
                          return next
                        })
                      } else {
                        const itemInQuestion = JSON.stringify(item)
                        setSelected((prev): Map<string, number> => {
                          const newSelected = new Map()
                          Array.from(prev).forEach(([key, value]) => {
                            if(itemInQuestion === key) {
                              newSelected.set(key, true)
                            } else {
                              newSelected.set(key, false)
                            }
                          })
                          // return next
                          return newSelected
                        })
                      }
                    }

                  }}
                >

                  {selected.get(JSON.stringify(item)) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="31"
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
                      height="31"
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
                  )}{" "}
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
