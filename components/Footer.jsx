import Link from "next/link"

const Footer = () => {
  return (
    <footer className="text-center font-medium mt-20 mx-[30%]">
      ningun link está alojado en nuestros servidores
      <Link href={'https://silentm4gician.netlify.app/'} target="_blank">
        <div>
          ©️copyright <span className="italic font-bold hover:text-red-500 mt-1">silentM4gician</span>
        </div>
      </Link>
    </footer>
  )
}

export default Footer