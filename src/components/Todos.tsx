import React from 'react'
import { FiPlus, FiChevronDown } from 'react-icons/fi'
import * as Checkbox from '@radix-ui/react-checkbox'

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

export const Todos = () => {
  return (
    <div className="bg-gray-900/90 max-h-[384px] md:max-h-full h-full md:max-w-[340px] w-full backdrop-blur-lg backdrop-saturate-[180%] flex flex-col border-r border-r-gray-700 absolute inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:right-auto">
      <header className="border-b border-b-gray-700 w-full text-center py-4 px-3">
        <p className="text-xl font-bold justify-self-center col-start-2 font-bungee">To-do list</p>
      </header>
      <section className="py-3">
        <div className="flex justify-between items-center px-4">
          <p className="text-sm font-medium">To do</p>
          <button>
            <FiChevronDown />
          </button>
        </div>

        <ul className="mt-3">
          <Todo />
          <Todo />

          <div className="border-t border-t-gray-700 w-full px-4 py-2">
            <button className="text-sm flex items-center gap-2 rounded-lg">
              <div className="border-2 border-white w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
                <FiPlus className="text-white" />
              </div>
              New task
            </button>
          </div>
        </ul>
      </section>
      <section className="py-3">
        <div className="flex justify-between items-center px-4">
          <p className="text-sm font-medium">In progress</p>
          <button>
            <FiChevronDown />
          </button>
        </div>

        <ul className="mt-3">
          <Todo />
          <Todo />

          <div className="border-t border-t-gray-700 w-full px-4 py-2">
            <button className="text-sm flex items-center gap-2 rounded-lg">
              <div className="border-2 border-white w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
                <FiPlus className="text-white" />
              </div>
              New task
            </button>
          </div>
        </ul>
      </section>
      <section className="py-3">
        <div className="flex justify-between items-center px-4">
          <p className="text-sm font-medium">Done</p>
          <button>
            <FiChevronDown />
          </button>
        </div>

        <ul className="mt-3">
          <Todo />
          <Todo />
          <div className="border-t border-t-gray-700 w-full px-4 py-2">
            <button className="text-sm flex items-center gap-2 rounded-lg">
              <div className="border-2 border-white w-[14px] h-[14px] rounded-[4px] flex justify-center items-center">
                <FiPlus className="text-white" />
              </div>
              New task
            </button>
          </div>
        </ul>
      </section>
    </div>
  )
}

const Todo = () => {
  const id = React.useId()
  return (
    <li className="border-t border-t-gray-700 group">
      <div className="group-hover:bg-gray-700 flex items-center gap-2 py-2 px-4">
        <Checkbox.Root
          id={id}
          className="border-2 border-gray-500 w-[14px] h-[14px] rounded-[4px] flex justify-center items-center radix-checked:bg-pink-500 radix-checked:border-transparent transition-colors ease-in-out duration-[250ms]"
        >
          <Checkbox.Indicator className="text-violet-500">
            <CheckIcon className="text-white" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label htmlFor={id} className="cursor-pointer text-sm">
          Teste
        </label>
      </div>
    </li>
  )
}
