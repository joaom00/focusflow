import React from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { FiEdit2 } from 'react-icons/fi'
import Textarea from 'react-textarea-autosize'
import { CheckboxTodo } from './CheckboxTodo'

interface TodoProps {
  id: string
  value: string
  edit: boolean
  onBlurEmptyValue: (id: string) => void
  onBlur: ({ id, value }: { id: string; value: string }) => void
  onSubmit: ({ id, value }: { id: string; value: string }) => void
  onDone?: () => void
  onDelete?: () => void
}

export const Todo = (props: TodoProps) => {
  const {
    edit: editProp,
    onBlurEmptyValue,
    onBlur: onBlurProp,
    onSubmit,
    onDone,
    ...todoProps
  } = props
  const id = React.useId()
  const [edit, setEdit] = React.useState(editProp)
  const [value, setValue] = React.useState(todoProps.value)
  const [hovering, setHovering] = React.useState(false)
  const prevValueRef = React.useRef(todoProps.value)

  const onBlur = () => {
    if (!value && !prevValueRef.current) return onBlurEmptyValue(todoProps.id)
    if (!value && prevValueRef.current) {
      setValue(prevValueRef.current)
      setEdit(false)
      return
    }
    prevValueRef.current = value
    setEdit(false)
    onBlurProp({ id: todoProps.id, value })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        if (!value) return onBlurEmptyValue(todoProps.id)
        prevValueRef.current = value
        onSubmit({ id: todoProps.id, value })
        break
      }
      case 'Backspace': {
        if (!value) {
          event.preventDefault()
          props.onBlurEmptyValue(todoProps.id)
        }
        break
      }
      case 'Escape': {
        if (!value && !prevValueRef.current) return onBlurEmptyValue(todoProps.id)
        if (!value && prevValueRef.current) {
          setValue(prevValueRef.current)
          setEdit(false)
          return
        }
        prevValueRef.current = value
        onBlurProp({ id: todoProps.id, value })
        setEdit(false)
        break
      }
    }
  }

  const onTodoKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        event.preventDefault()
        setEdit(true)
      }
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value)
  }

  return (
    <motion.li
      className="border-t border-t-gray-700"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { duration: 0.2 },
      }}
      tabIndex={-1}
      onKeyDown={onTodoKeyDown}
    >
      <motion.div
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
        animate={hovering ? 'hovering' : 'unhovering'}
        variants={{
          hovering: {
            backgroundColor: 'rgb(51 51 56)',
            transition: { duration: 0 },
          },
          unhovering: {
            backgroundColor: 'rgb(51 51 56 / 0)',
            transition: { duration: 0.18 },
          },
        }}
        className={clsx(
          'group hover:bg-gray-750 min-h-[36px] h-full grid relative',
          edit ? 'pointer-events-none' : 'pointer-events-auto'
        )}
      >
        <CheckboxTodo id={id} edit={edit} onClick={onDone} />

        <div className="hidden absolute top-1/2 right-2 -translate-y-1/2 group-hover:flex">
          <button className="hover:bg-gray-800 p-1.5 rounded-md" onClick={() => setEdit(true)}>
            <FiEdit2 size={14} />
          </button>
        </div>

        {edit ? (
          <Textarea
            ref={(node) => {
              if (node) {
                const end = value.trim().length
                node.setSelectionRange(end, end)
                node.focus()
              }
            }}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={clsx(
              'resize-none bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none border-t border-t-transparent focus:border-t-pink-500 absolute inset-x-0 shadow-lg shadow-[rgba(0,0,0,0.5)] rounded-md',
              edit && 'pointer-events-auto z-30'
            )}
            placeholder="Enter a name"
            minRows={1}
            style={{ gridColumn: '1/2', gridRow: '1/2' }}
          />
        ) : (
          <label
            htmlFor={id}
            className="self-baseline pl-10 pr-5 text-sm break-all mt-[9px] w-fit"
            style={{
              gridColumn: '1/2',
              gridRow: '1/2',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {value}
          </label>
        )}
      </motion.div>
    </motion.li>
  )
}
