import React from 'react'

export const ShowTimeItem = ({showtime}) => {
  return (
    <div className="border-s-gray-200 align-middle items-center font-sans font-light text-sm">
        {showtime.showTime}
    </div>
  )
}
