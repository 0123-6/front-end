import SearchSvg from "../icon/experiment/SearchSvg";
import React, {useState} from "react";

interface IProps {
  placeholder: string,
  defaultValue: string,
  change: (e)=>void,
  keyDown:(e)=>void,
  ml?:boolean,
  style?:object,
}

export default function SearchBig(props: IProps) {
  // state
  const {placeholder,defaultValue,change,keyDown,ml=true,style={}} = props
  const [isFocused, setIsFocused] = useState(false);
  // methods
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <div className={`w-[236px] big:w-[284px] h-full bg-white flex items-center hover:outline hover:outline-1 hover:outline-main ${isFocused?'outline outline-1 outline-main':''}`}
         style={{border: '1px solid rgba(229,232,235,1)',borderRadius: '20px',marginLeft:ml?'60px':'0',...style}}>
      <input type="text"
             className="ml-5 flex-1"
             defaultValue={defaultValue}
             onChange={change}
             autoComplete={"off"}
             onKeyDown={keyDown}
             placeholder={placeholder}
             onFocus={handleFocus}
             onBlur={handleBlur}
      />
      <span className="mr-4 p-1 flex items-center hover:cursor-pointer"
            onClick={()=>keyDown({keyCode:13})}>
        <SearchSvg/>
      </span>
    </div>
  )
}
