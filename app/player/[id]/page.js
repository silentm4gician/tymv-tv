'use client'

import NoLinkYet from "@/components/NoLinkYet";
import Player from "@/components/Player"
import { useEffect, useState } from "react"

const getQueryStringParams = query => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [key, value] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, {}
      )
    : {}
};

function removeQuotes(inputString) {
  let string = ''

  inputString == null
    ? null
    : string = inputString.replace(/"/g, '');

  return string
}

const MatchPage = ({ params }) => {
  const [link, setLink] = useState('')
  const game = decodeURIComponent(params.id)

  useEffect(() => {
    const { data } = getQueryStringParams(window.location.search)
    const url = removeQuotes(data)
    setLink(url)
  }, [])

  return (
    <div className="text-center">
      {
        link?.includes('https')
          ? <Player link={link} game={game}/>
          : <NoLinkYet/>
      }
    </div>
  )
}

export default MatchPage