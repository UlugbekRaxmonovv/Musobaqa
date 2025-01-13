import React from 'react'
import nodataimg from '../../assets/images/no-data.svg'
const NoData = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='text-center flex flex-col items-center gap-[20px]'>
            <img src={nodataimg} alt="" />
            <p className='font-[500] text-[#9A9C9C] text-[20px] '>Malumot yo’q</p>
        </div>
    </div>
  )
}

export default NoData