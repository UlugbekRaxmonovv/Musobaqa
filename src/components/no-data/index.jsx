import React, { useContext } from 'react'
import nodataimg from '../../assets/images/no-data.svg'
import { Context } from '../darkMode/Context';
import no from '../../assets/images/no.svg'
const NoData = () => {
  const { theme } = useContext(Context);
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <div className='text-center flex flex-col items-center gap-[20px]'>
          {
            theme ?  <img src={nodataimg} alt="" />
            :
            <img src={no} alt="" />
          }
            <p className='font-[500] text-[#9A9C9C] text-[20px] '>Malumot yo’q</p>
        </div>
    </div>
  )
}

export default NoData