const Player = ({ link, game }) => {
  return (
    <div className="mt-20 mx-[7%] lg:mx-[20%] md:mx-[15%]">
      <h2 className="mb-6 font-semibold bg-zinc-900 rounded p-2"><span className="text-red-500 font-bold">LIVE</span> - {game}</h2>
      <iframe src={link} frameBorder="0" allowFullScreen={true} scrolling="no" className="p-1 rounded-md bg-zinc-900 h-[200px] w-[100%] lg:h-[500px] md:h-[300px]"></iframe>
      <a href="/">
        <button className="mr-4 mt-2 font-semibold bg-zinc-900 p-3 rounded hover:bg-red-700">
          VOLVER
        </button>
      </a>
      <a href={window.location.href}>
        <button className="mt-2 font-semibold bg-zinc-900 p-3 rounded hover:bg-red-700">
          RECARGAR REPRODUCTOR
        </button>
      </a>
    </div>
  )
}

export default Player