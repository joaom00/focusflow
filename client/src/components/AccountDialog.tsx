import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'

import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

type AccountDialogProps = {
  children?: React.ReactNode
}

export const AccountDialog = ({ children }: AccountDialogProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900/90 fixed inset-0 motion-safe:animate-overlayShow" />
        <Dialog.Content className="bg-gray-800 border border-gray-700 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-lg w-11/12 motion-safe:animate-contentShow">
          <Tabs.Root defaultValue="login">
            <Tabs.List className="grid grid-cols-2">
              <Tabs.Trigger
                type="button"
                value="login"
                className="py-3 px-5 text-gray-400 border-b border-b-gray-700 radix-tab-active:border-b-pink-500 radix-tab-active:text-white relative transition-colors duration-150"
              >
                Log in to your account
              </Tabs.Trigger>
              <Tabs.Trigger
                type="button"
                value="register"
                className="py-3 px-5 text-gray-400 border-b border-b-gray-700 radix-tab-active:text-white relative"
              >
                Create an account
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login">
              <Dialog.Description className="text-sm text-gray-400 pl-5 pt-5">
                Enter your credentials to access your account.
              </Dialog.Description>

              <SignInForm />
            </Tabs.Content>

            <Tabs.Content value="register">
              <Dialog.Description className="text-sm text-gray-400 pl-5 pt-5">
                Enter your details to create an account.
              </Dialog.Description>

              <SignUpForm />
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
