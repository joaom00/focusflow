import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { CheckmarkIcon, ErrorIcon, LoaderIcon } from 'react-hot-toast'

type PrimitivInputProps = React.ComponentPropsWithRef<'input'>

type InputProps = PrimitivInputProps & {
  label: string
  name: string
  status?: 'idle' | 'loading' | 'success'
  inputIcon?: React.ReactNode
  trailingAccessory?: React.ReactNode
}

export const Input = ({
  name,
  className,
  label,
  status = 'idle',
  trailingAccessory,
  ...props
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]
  const hasError = !!error

  const isLoading = status === 'loading'
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm select-none flex justify-between items-center">
        {label}

        {isLoading && <LoaderIcon />}

        {!isLoading && hasError && (
          <ErrorIcon className="w-4 h-4 bg-red-500 before:w-[10px] after:w-[10px] before:left-[3px] before:bottom-[7px] after:left-[3px] after:bottom-[7px]" />
        )}

        {isSuccess && <CheckmarkIcon />}

        {!isLoading && !isSuccess && !hasError && trailingAccessory}
      </label>

      <input
        {...props}
        id={name}
        className={clsx(
          'w-full h-9 rounded-md bg-gray-750 pl-3 pr-9 text-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none transition duration-200 focus:bg-gray-850 caret-pink-300 peer',
          hasError ? 'focus:ring-red-400 caret-red-300' : 'focus:ring-pink-400 caret-pink-300',
          className
        )}
        aria-invalid={hasError ? 'true' : 'false'}
        {...register(name)}
      />

      {!!error && (
        <motion.span
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          role="alert"
          className="text-xs font-medium text-red-400 mt-1"
        >
          {error.message as string}
        </motion.span>
      )}
    </div>
  )
}