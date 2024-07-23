import LoadingScreen from "./LoadingScreen"

const NoLinkYet = () => {
  return (
    <div className="text-center">
      <LoadingScreen/>
      <p className="font-bold italic text-xl">Todavia no hay un stream disponible, regrese más tarde</p>
      <a href="/">
        <button className="mr-4 mt-6 font-semibold bg-zinc-900 p-3 rounded hover:bg-red-700">
          VOLVER
        </button>
      </a>
    </div>
  )
}

export default NoLinkYet