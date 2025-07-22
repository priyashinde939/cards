"use client"

import SceneMakerPage2 from "../SceneMakerPage2"
import ScrollingCards3 from "../scrolling-cards3"
import ScrollingCards2 from "../scrolling-cards2"
import SceneMakerPage from "../SceneMakerPage"
import SceneMakerPage3 from "@/SceneMakerPage3"

export default function Page() {
  // return <ScrollingCards />
  // return <ScrollingCards3 />
   return (
    <div>
      {/* <ScrollingCards2 /> */}
      <SceneMakerPage3 />
    </div>
  );
}


// current is 2
// modified scene maker page is in 3
// 2 backup in 1
// remover the 2 bkp from 1 and added new code in 1
// renamed 1 to SceneMakerPage2
// final code in SceneMakerPage2.tsx
// test code in sceneMakerPage3.tsx