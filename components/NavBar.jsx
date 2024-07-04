import Link from "next/link"

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link href={'/'} className="hover:text-red-500">
        <h3 className="italic font-semibold ml-5">TOCO Y ME VOY <span className="text-red-500 font-bold">TV</span></h3>
      </Link>
    </nav>
  )
}

export default NavBar