import React from 'react'

function Navbarmainpage() {
	return (
		<div>
	
    <nav className="
      w-full
      min-h-[64px]
      h-auto
      px-4 sm:px-6 lg:px-12
      bg-slate-900
      text-white
      flex
      items-center
      justify-between
    ">
      <div className="text-lg font-semibold">
        CodeHub
      </div>

      <ul className="flex gap-6 cursor-pointer">
        <li>Sign In</li>
        <li>Explore</li>
       <li>About us</li>
      </ul>
    </nav>
 

		</div>
	)
}

export default Navbarmainpage
