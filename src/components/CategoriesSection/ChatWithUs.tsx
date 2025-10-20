import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const ChatWithUs = () => {
  return (
    <div className='fixed z-50 bottom-3 right-3 px-2 md:px-3 py-4 w-[100px] md:w-[130px]  rounded-lg cursor-pointer hover:bg-primary-0 hover:border-primary-400 duration-300 border border-gray-200 bg-background shadow-searchSuggestionShadow'>
      <Avatar className='w-8 h-8 md:w-12 md:h-12 border-2 border-primary-400 z-0 mx-auto'>
        <AvatarFallback className='bg-background'>
          <img src="/icons/default-avatar.svg" alt="chat with us" />
        </AvatarFallback>
        <AvatarImage src="/images/chat-with-us.png" alt="chat with us" />
      </Avatar>
      <p className='text-xs md:text-base font-medium text-gray-800 pt-3'>Chat With Us</p>
    </div>
  )
}

export default ChatWithUs
