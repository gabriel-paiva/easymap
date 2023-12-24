'use client'

import { useDraw } from "@/hooks/useDraw";
import { ReactElement, useState } from "react";
import { ChromePicker } from 'react-color';

const Home = (): ReactElement => {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, onClear } = useDraw({color});

  return (
    <main className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col gap-10 pr-10">
      <ChromePicker 
        color={color}
        onChange={(event) => setColor(event.hex)}
      />
      <button type="button" className="p-2 rounded-md border border-black" onClick={(onClear)} >Clear canvas</button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </main>
  );
};

export default Home;
