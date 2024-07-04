const Player = ({ link, game }) => {
  return (
    <div className="mt-20 mx-[7%] lg:mx-[20%] md:mx-[15%]">
      <h2 className="mb-6 font-semibold bg-zinc-900 rounded p-2"><span className="text-red-500 font-bold">LIVE</span> - {game}</h2>
      <iframe src={link} frameBorder="0" allowFullScreen={true} scrolling="no" className="p-1 rounded-md bg-zinc-900 h-[200px] w-[100%] lg:h-[500px] md:h-[300px]"></iframe>
    </div>
  )
}

export default Player