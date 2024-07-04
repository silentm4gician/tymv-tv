import LoadingScreen from "./LoadingScreen"

const NoLinkYet = () => {
  return (
    <div className="text-center">
      <LoadingScreen/>
      <p className="font-bold italic text-xl">Todavia no hay un stream disponible, regrese más tarde</p>
    </div>
  )
}

export default NoLinkYet