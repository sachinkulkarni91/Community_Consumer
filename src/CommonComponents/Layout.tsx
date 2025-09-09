import { useState, useEffect } from "react"
import Banner from "./Banner"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { Outlet, useLocation } from "react-router-dom"

  const Layout = () => {
  const [banner, setBanner] = useState(true)
  const [selected, setSelected] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  
  // Update selected state based on current route
  useEffect(() => {
    if (location.pathname === '/feed') {
      setSelected(1)
    } else if (location.pathname === '/communities' || location.pathname.startsWith('/community/')) {
      setSelected(2)
    } else if (location.pathname.startsWith('/events')) {
      setSelected(3)
    } else if (location.pathname === '/announcements') {
      setSelected(4)
    } else {
      setSelected(1) // Default to My Feed
    }
  }, [location.pathname])
  
  return (
   <div className='w-full h-full bg-secondary relative flex flex-col'>
      <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></Topbar>
      <Banner banner={banner} setBanner={setBanner}></Banner>
        <div className='rounded-2xl flex-1 w-full flex gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 h-full overflow-hidden justify-between'> 
        <Sidebar selected={selected} setSelected={setSelected} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}></Sidebar> 
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Layout