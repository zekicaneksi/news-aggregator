'use client'

import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {

	async function foo(){
		let res = await fetch('/api/fetch-news-local');
		console.log(res);
	}

  return (
	<div>
		<button onClick={foo}>click me</button>
		<p>hello</p>
	</div>
  )
}
