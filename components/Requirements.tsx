import { FC, useRef } from "react";
import { MdOutlineRemoveCircle } from "react-icons/md"

export const Requirements: FC<RequirementsProps> = ({ requirements, setRequirements, requirementsError, setRequirementsError}) => {
  const requirementInput = useRef<HTMLInputElement>(null);

  const addRequirement = (newRequirement: string) => {
    const newRequirements = new Set([...requirements, newRequirement])
    setRequirementsError('')
    setRequirements([...Array.from(newRequirements)])
  }

  const removeRequirement = (removedRequirement: string) => {
    const newRequirements = new Set(requirements.filter(requirement => requirement !== removedRequirement))
    setRequirements([...Array.from(newRequirements)])
  }

  return (
    <>
      <div className="flex flex-col bg-slate-300 py-4 rounded my-4">
        <div className="mx-4 my-2 relative">
          <input type="text" className="input w-full" placeholder="Шаардлага нэмэх" onFocus={e => e.target.value = ''} ref={requirementInput}/>
          <div
            className="bg-slate-300 absolute top-[0.37rem] right-2 px-3 py-1 rounded hover:cursor-pointer ring-1 ring-gray-500 active:bg-blue-400 active:text-white active:ring-blue-500"
            onClick={() => requirementInput.current?.value  && addRequirement(requirementInput.current?.value )}>
            Нэмэх
          </div>
          <div className="text-red-400">
            {requirementsError}
          </div>
        </div>
        {
          requirements.map((requirement, index) => 
            <div className="relative bg-slate-200 pl-4 py-2 text-xl rounded-md my-2 mx-4 flex items-center" key={index}>
              <span>{requirement}</span>
              <MdOutlineRemoveCircle className="absolute right-2 cursor-pointer" onClick={() => removeRequirement(requirement)}/>
            </div>
          )
        }
      </div>
    </>
  )
}

type RequirementsProps = {
  requirements: string[];
  setRequirements: (requirements: string[]) => void;
  requirementsError: string;
  setRequirementsError: (error: string) => void
}
