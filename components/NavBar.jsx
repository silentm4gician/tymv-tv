import Link from "next/link"

const NavBar = () => {
  return (
    <nav className="navbar">
      <a href={'/'} className="hover:text-red-500">
        <h3 className="italic font-semibold ml-5">TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span></h3>
      </a>
    </nav>
  )
}

export default NavBar